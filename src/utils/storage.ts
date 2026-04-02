const PREFIX = 'bank-legal:';

export const storage = {
  get(key: string) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  set(key: string, value: unknown) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  },
  remove(key: string) {
    try { localStorage.removeItem(PREFIX + key); } catch {}
  },
  getUser() {
    return this.get('user');
  },
  setUser(user: unknown) {
    this.set('user', user);
  },
  clearUser() {
    this.remove('user');
  },
  getCurrentCase() {
    return this.get('currentCase');
  },
  setCurrentCase(id: string) {
    this.set('currentCase', id);
  },
  getCurrentForm() {
    return this.get('currentForm');
  },
  setCurrentForm(data: Record<string, string>) {
    this.set('currentForm', data);
  },
};
