import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TYPES = ['신협', '단위농협', '새마을금고'];

/* ── WebGL 3D 일렁이는 도형 ── */
function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // 버텍스 셰이더 — 물결 변형
    const vsSource = `
      attribute vec3 aPos;
      attribute vec3 aNorm;
      uniform float uTime;
      uniform mat4 uMVP;
      varying vec3 vNorm;
      varying float vDisp;
      void main() {
        float wave = sin(aPos.x * 2.5 + uTime) * 0.22
                   + cos(aPos.y * 2.0 + uTime * 0.8) * 0.18
                   + sin(aPos.z * 1.8 + uTime * 1.2) * 0.14;
        vec3 pos = aPos + aNorm * wave;
        vNorm = aNorm;
        vDisp = wave;
        gl_Position = uMVP * vec4(pos, 1.0);
      }
    `;

    // 프래그먼트 셰이더 — 흑백 그라데이션
    const fsSource = `
      precision mediump float;
      varying vec3 vNorm;
      varying float vDisp;
      void main() {
        vec3 light = normalize(vec3(0.6, 1.0, 0.8));
        float d = dot(normalize(vNorm), light) * 0.5 + 0.5;
        float bright = d * 0.4 + vDisp * 1.2 + 0.1;
        bright = clamp(bright, 0.0, 1.0);
        gl_FragColor = vec4(vec3(bright), 0.85);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // 구체 메시 생성
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const latN = 64, lonN = 64;

    for (let i = 0; i <= latN; i++) {
      const theta = (i / latN) * Math.PI;
      for (let j = 0; j <= lonN; j++) {
        const phi = (j / lonN) * 2 * Math.PI;
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.cos(theta);
        const z = Math.sin(theta) * Math.sin(phi);
        positions.push(x, y, z);
        normals.push(x, y, z);
      }
    }
    for (let i = 0; i < latN; i++) {
      for (let j = 0; j < lonN; j++) {
        const a = i * (lonN + 1) + j;
        const b = a + lonN + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    const aNorm = gl.getAttribLocation(prog, 'aNorm');
    gl.enableVertexAttribArray(aNorm);
    gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMVP = gl.getUniformLocation(prog, 'uMVP');

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mat4 = {
      perspective(fov: number, asp: number, near: number, far: number): number[] {
        const f = 1 / Math.tan(fov / 2);
        return [f/asp,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,(2*far*near)/(near-far),0];
      },
      rotY(a: number): number[] {
        const c = Math.cos(a), s = Math.sin(a);
        return [c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,-3.2,1];
      },
      mul(a: number[], b: number[]): number[] {
        const r = new Array(16).fill(0);
        for(let i=0;i<4;i++) for(let j=0;j<4;j++) for(let k=0;k<4;k++) r[i*4+j]+=a[i*4+k]*b[k*4+j];
        return r;
      }
    };

    let t = 0;
    const startTime = performance.now();
    let raf: number;
    const draw = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      t += elapsed < 3 ? 0.03 : 0.012;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const asp = canvas.width / canvas.height;
      const proj = mat4.perspective(1.0, asp, 0.1, 100);
      const view = mat4.rotY(t * 0.4);
      const mvp = mat4.mul(proj, view);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.uniform1f(uTime, t);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}/>
  );
}

/* ── 메인 로그인 페이지 ── */
export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [institution, setInstitution] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !institution.trim() || !name.trim()) { setError('모든 항목을 입력해주세요.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setUser({ institution: `[${type}] ${institution.trim()}`, name: name.trim() });
    navigate('/role');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff', overflow: 'hidden' }}>

      {/* 좌측 — 3D 캔버스 + 브랜드 */}
      <div className="hidden lg:flex flex-col" style={{
        width: '55%', flexShrink: 0,
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 캔버스 */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <ThreeCanvas/>
        </div>

        {/* 오버레이 텍스트 */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          height: '100%', padding: '52px 56px',
        }}>
          {/* 로고 */}
          <div style={{ marginBottom: 'auto' }}>
            <div style={{
              fontSize: '28px', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.5px',
              lineHeight: 1,
            }}>
              뱅크법률집사
            </div>
          </div>

          {/* 메인 카피 */}
          <div>
            <div style={{
              fontSize: '48px', fontWeight: 800,
              color: '#fff', lineHeight: 1.15,
              letterSpacing: '-2px',
              marginBottom: '20px',
            }}>
              금융기관의 업무 효율을<br/>AI로 혁신합니다
            </div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: '380px' }}>
              채권 관리, 서류 자동화, 리스크 분석까지 —<br/>
              AI 기반 금융 업무 자동화 플랫폼
            </p>
          </div>

          {/* 하단 법무법인 */}
          <div style={{ marginTop: '48px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
              법무법인 더 에이치 황해 × AI Consilium
            </div>
          </div>
        </div>
      </div>

      {/* 우측 — 로그인 폼 */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>

          {/* 모바일 로고 */}
          <div className="lg:hidden" style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: '#000' }}>
              뱅크법률집사
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px', color: '#000', marginBottom: '6px' }}>
              로그인
            </h2>
            <p style={{ fontSize: '13px', color: '#aaa' }}>기관 정보를 입력해 시작하세요</p>
          </div>

          <form onSubmit={submit}>
            {/* 기관 유형 */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '10.5px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>기관 유형</div>
              <div style={{ display: 'flex', border: '1px solid #000' }}>
                {TYPES.map((t, i) => (
                  <button key={t} type="button"
                    onClick={() => { setType(t); setError(''); }}
                    style={{
                      flex: 1, padding: '10px 0',
                      fontSize: '14px', fontWeight: 500,
                      background: type === t ? '#000' : '#fff',
                      color: type === t ? '#fff' : '#888',
                      border: 'none',
                      borderRight: i < TYPES.length - 1 ? '1px solid #000' : 'none',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.1s',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 기관명 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10.5px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>기관명</div>
              <input
                type="text" value={institution}
                onChange={e => { setInstitution(e.target.value); setError(''); }}
                placeholder="예: 서울중앙신협"
                style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}
              />
            </div>

            {/* 담당자 */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ fontSize: '10.5px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>담당자</div>
              <input
                type="text" value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                placeholder="예: 김담당"
                style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}
              />
            </div>

            {error && (
              <div style={{ fontSize: '12px', color: '#c00', marginBottom: '14px' }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px 0',
                background: '#000', color: '#fff',
                border: 'none', cursor: loading ? 'default' : 'pointer',
                fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                borderRadius: '2px',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}>
              {loading ? '로그인 중...' : '시작하기 →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
