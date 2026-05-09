/**
 * DokunSay Platform — Diskalkuli Derneği Auth SSO İstemcisi
 *
 * Tüm DokunSay araçları (Bar/Basamak/Clock/Kesir/Tam/Geo/Veri/Launcher),
 * NUMAP ve GalakSay için ortak Single Sign-On (SSO) katmanı.
 *
 * Endpoint: https://diskalkulidernegi.org/auth/
 * Backend: PHP REST API (bcrypt + JSON, 30-gün token, rate-limit)
 *
 * ABMAT'ın `RemoteAuthService.js` desenini izler. Token tüm
 * uygulamalarda paylaşılır → cross-app SSO.
 *
 * Kullanım:
 *   import { authSSO } from '@shared/auth-sso.js';
 *   const result = await authSSO.login('user@mail.com', 'password');
 *   if (result.ok) console.log('Hoş geldin', result.name);
 *
 * Mevcut auth'lara dokunmaz:
 *  - DokunSayBar Firebase auth (kalır)
 *  - NUMAP own backend sync.php (kalır)
 *  - Bu modül EK katman olarak çalışır
 */

const AUTH_BASE = 'https://diskalkulidernegi.org/auth/';

/**
 * Ortak storage key — tüm DokunSay araçları, NUMAP ve GalakSay
 * aynı session'ı paylaşır. ABMAT'ın `abmato_auth_v1` key'i
 * geriye dönük olarak okunur (cross-app awareness).
 */
const STORAGE_KEY_NEW = 'diskalkuli:auth:sso:v1';
const STORAGE_KEY_LEGACY = 'abmato_auth_v1'; // ABMAT okuma uyumluluğu

class AuthSSO {
  constructor() {
    this.endpoint = AUTH_BASE;
  }

  // ── HTTP helpers ─────────────────────────────────────────────

  async _post(payload, { signal } = {}) {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
    let data = null;
    try { data = await res.json(); } catch { /* boş cevap */ }
    return { status: res.status, data: data || {} };
  }

  // ── Public API ───────────────────────────────────────────────

  /**
   * Sunucuya login isteği at. Başarılıysa token'ı sakla.
   * @returns {Promise<{ok:boolean, name?:string, username?:string, expiresAt?:number, reason?:string, message?:string}>}
   */
  async login(username, password) {
    if (!username || !password) {
      return { ok: false, reason: 'missing_credentials', message: 'Kullanıcı adı ve şifre gerekli.' };
    }
    let resp;
    try {
      resp = await this._post({
        action: 'login',
        username: String(username).trim(),
        password: String(password),
      });
    } catch (e) {
      return {
        ok: false,
        reason: 'network_error',
        message: 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.',
      };
    }
    const { status, data } = resp;
    if (data.ok) {
      this._save({
        token: data.token,
        name: data.name || username,
        username: data.username || username,
        expiresAt: data.expiresAt,
        savedAt: Math.floor(Date.now() / 1000),
      });
      return {
        ok: true,
        name: data.name,
        username: data.username,
        expiresAt: data.expiresAt,
      };
    }
    if (status === 429) {
      return {
        ok: false,
        reason: 'locked',
        message: data.message || 'Çok fazla başarısız deneme. Bir süre sonra tekrar deneyin.',
      };
    }
    if (status === 401) {
      return {
        ok: false,
        reason: 'invalid_credentials',
        message: 'Kullanıcı adı veya şifre hatalı.',
      };
    }
    return {
      ok: false,
      reason: data.error || 'unknown',
      message: 'Giriş başarısız.',
    };
  }

  /**
   * Kayıtlı token varsa, hâlâ geçerli mi sunucudan doğrula.
   * Çevrimdışıyken yerel expiresAt'a göre tolere et.
   */
  async verifyStored() {
    const stored = this._load();
    if (!stored?.token) return null;

    // Yerel olarak süresi geçtiyse hemen at
    if (stored.expiresAt && stored.expiresAt * 1000 < Date.now()) {
      this.clear();
      return null;
    }

    // Çevrimiçi doğrulama (best-effort, ağ olmazsa local'e güven)
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const { status, data } = await this._post(
        { action: 'verify', token: stored.token },
        { signal: ctrl.signal }
      );
      clearTimeout(timer);

      if (data.ok) {
        const fresh = {
          ...stored,
          name: data.name || stored.name,
          username: data.username || stored.username,
          expiresAt: data.expiresAt || stored.expiresAt,
        };
        this._save(fresh);
        return fresh;
      }
      if (status === 401) {
        this.clear();
        return null;
      }
      return stored;
    } catch (e) {
      return stored;
    }
  }

  /**
   * Token'ı sunucuda da iptal et, yerel temizle.
   */
  async logout() {
    const stored = this._load();
    if (stored?.token) {
      try {
        await this._post({ action: 'logout', token: stored.token });
      } catch { /* sessizce yut */ }
    }
    this.clear();
  }

  /**
   * Senkron: yerel olarak depolanan ve süresi geçmemiş oturumu döndür.
   * Hem yeni hem ABMAT legacy key'lerini kontrol eder (cross-app).
   */
  current() {
    const stored = this._load();
    if (!stored?.token) return null;
    if (stored.expiresAt && stored.expiresAt * 1000 < Date.now()) {
      this.clear();
      return null;
    }
    return stored;
  }

  /**
   * Token değişimini izle (cross-tab/cross-app sync).
   * @param {(user: object|null) => void} callback
   * @returns {() => void} cleanup fonksiyonu
   */
  onChange(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => {
      if (e.key === STORAGE_KEY_NEW || e.key === STORAGE_KEY_LEGACY) {
        callback(this.current());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  // ── Storage ──────────────────────────────────────────────────

  _load() {
    try {
      // Önce yeni key, yoksa ABMAT legacy key
      const raw = localStorage.getItem(STORAGE_KEY_NEW)
        || localStorage.getItem(STORAGE_KEY_LEGACY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _save(data) {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY_NEW, json);
      // Geriye uyumluluk: ABMAT key'ini de güncel tut (aynı browser'da
      // ABMAT açıksa o da haberdar olsun).
      localStorage.setItem(STORAGE_KEY_LEGACY, json);
    } catch { /* quota / private mode */ }
  }

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY_NEW);
      localStorage.removeItem(STORAGE_KEY_LEGACY);
    } catch { /* ignore */ }
  }
}

// Singleton — tek instance tüm uygulamada paylaşılır
export const authSSO = new AuthSSO();
export { AuthSSO, AUTH_BASE, STORAGE_KEY_NEW, STORAGE_KEY_LEGACY };
