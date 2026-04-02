import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TYPES = ['저축은행', '새마을금고', '신협', '단위농협'];

export default function Login() {
  const [institution, setInstitution] = useState('');
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { setUser } = useApp();
  const navigate = useNavigate();

  function handleLogin() {
    if (!institution || !name || !selectedType) return;
    setUser({ institution, name, role: 'teller' });
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="w-full max-w-[400px]">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚖️</div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">뱅크법률집사</h1>
          <p className="text-sm text-gray-500 mt-1">금융기관 법률 서비스 플랫폼</p>
        </div>

        {/* 기관 유형 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">기관 유형</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                  selectedType === t
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 기관명 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">기관명</label>
          <input
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900"
            placeholder="예: 웰컴저축은행"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>

        {/* 이름 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">담당자명</label>
          <input
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900"
            placeholder="예: 홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 로그인 */}
        <button
          onClick={handleLogin}
          disabled={!institution || !name || !selectedType}
          className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          시작하기
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          법무법인 더 에이치 황해 × AI Consilium
        </p>
      </div>
    </div>
  );
}
