/**
 * DokunSay Platform — AuthGate (SSO UI Komponenti)
 *
 * Tüm araçlarda kullanılabilen opsiyonel giriş düğmesi + modal.
 * AppShell'in `tools` slot'una veya bağımsız bir köşeye yerleştirilir.
 *
 * Mod:
 *  - "optional" (default): kullanıcı login etmeden de uygulamayı kullanabilir
 *  - "required": login zorunlu, login olmadan içerik gösterilmez
 *
 * 5 dilde i18n: TR, KU, EN, AR, FA (RTL otomatik)
 *
 * Kullanım:
 *   import { AuthGate } from '@shared/AuthGate.jsx';
 *   <AppShell tools={<AuthGate />}>...</AppShell>
 */

import { useState, useEffect } from 'react';
import { authSSO } from './auth-sso.js';
import './AuthGate.css';

const I18N = {
  tr: {
    loginBtn: 'Giriş',
    loginTitle: 'Diskalkuli Derneği Giriş',
    username: 'Kullanıcı adı (e-posta)',
    password: 'Şifre',
    submit: 'Giriş yap',
    cancel: 'İptal',
    logout: 'Çıkış yap',
    welcome: 'Hoş geldin',
    loading: 'Giriş yapılıyor...',
    network_error: 'Sunucuya ulaşılamıyor.',
    invalid_credentials: 'Kullanıcı adı veya şifre hatalı.',
    locked: 'Çok fazla başarısız deneme. Bir süre sonra tekrar dene.',
    missing_credentials: 'Kullanıcı adı ve şifre gerekli.',
    unknown: 'Giriş başarısız.',
    info: 'Diskalkuli Derneği üyeliği ile tüm araçlara giriş yapabilirsin.',
  },
  ku: {
    loginBtn: 'Têketin',
    loginTitle: 'Têketina Komeleya Diskalkulî',
    username: 'Navê bikarhêner (e-name)',
    password: 'Şîfre',
    submit: 'Têkeve',
    cancel: 'Betal',
    logout: 'Derkeve',
    welcome: 'Bi xêr hatî',
    loading: 'Têketin tê kirin...',
    network_error: 'Negihîşt servera.',
    invalid_credentials: 'Navê bikarhêner an şîfre çewt e.',
    locked: 'Pir caran serneket. Piştî demekê dîsa biceribîne.',
    missing_credentials: 'Navê bikarhêner û şîfre pêwîst in.',
    unknown: 'Têketin têk çû.',
    info: 'Bi endamê Komeleya Diskalkulî dikarî têkevî hemû amûran.',
  },
  en: {
    loginBtn: 'Sign in',
    loginTitle: 'Diskalkuli Association Sign In',
    username: 'Username (e-mail)',
    password: 'Password',
    submit: 'Sign in',
    cancel: 'Cancel',
    logout: 'Sign out',
    welcome: 'Welcome',
    loading: 'Signing in...',
    network_error: 'Cannot reach server.',
    invalid_credentials: 'Invalid username or password.',
    locked: 'Too many failed attempts. Try again later.',
    missing_credentials: 'Username and password required.',
    unknown: 'Sign in failed.',
    info: 'Sign in once to access all Diskalkuli Association tools.',
  },
  ar: {
    loginBtn: 'تسجيل الدخول',
    loginTitle: 'تسجيل دخول جمعية عسر الحساب',
    username: 'اسم المستخدم (بريد إلكتروني)',
    password: 'كلمة المرور',
    submit: 'دخول',
    cancel: 'إلغاء',
    logout: 'تسجيل خروج',
    welcome: 'أهلاً',
    loading: 'جارٍ تسجيل الدخول...',
    network_error: 'تعذر الوصول إلى الخادم.',
    invalid_credentials: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    locked: 'محاولات فاشلة كثيرة. حاول لاحقاً.',
    missing_credentials: 'اسم المستخدم وكلمة المرور مطلوبان.',
    unknown: 'فشل تسجيل الدخول.',
    info: 'سجل دخولاً واحداً للوصول إلى جميع أدوات جمعية عسر الحساب.',
  },
  fa: {
    loginBtn: 'ورود',
    loginTitle: 'ورود انجمن دیسکالکولیا',
    username: 'نام کاربری (ایمیل)',
    password: 'رمز عبور',
    submit: 'ورود',
    cancel: 'لغو',
    logout: 'خروج',
    welcome: 'خوش آمدی',
    loading: 'در حال ورود...',
    network_error: 'دسترسی به سرور ممکن نیست.',
    invalid_credentials: 'نام کاربری یا رمز عبور نادرست است.',
    locked: 'تلاش‌های ناموفق زیاد. بعداً دوباره امتحان کن.',
    missing_credentials: 'نام کاربری و رمز عبور لازم است.',
    unknown: 'ورود ناموفق.',
    info: 'یک بار وارد شوید تا به همه ابزارهای انجمن دیسکالکولیا دسترسی یابید.',
  },
};

function useResolvedLang(propLang) {
  const [docLang, setDocLang] = useState(() => {
    if (typeof document === 'undefined') return 'tr';
    const v = document.documentElement.lang?.toLowerCase().slice(0, 2);
    return v && I18N[v] ? v : 'tr';
  });
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const update = () => {
      const v = document.documentElement.lang?.toLowerCase().slice(0, 2);
      setDocLang(v && I18N[v] ? v : 'tr');
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
    return () => observer.disconnect();
  }, []);
  return propLang === undefined ? docLang : (I18N[propLang] ? propLang : docLang);
}

export function AuthGate({ lang, mode = 'optional', onAuthChange }) {
  const [user, setUser] = useState(() => authSSO.current());
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resolvedLang = useResolvedLang(lang);
  const t = I18N[resolvedLang] || I18N.tr;

  // Mount'ta token doğrula (sunucudan) + cross-tab/app değişimleri izle
  useEffect(() => {
    let cancelled = false;
    authSSO.verifyStored().then((u) => {
      if (!cancelled) {
        setUser(u);
        if (onAuthChange) onAuthChange(u);
      }
    });
    const cleanup = authSSO.onChange((u) => {
      if (!cancelled) {
        setUser(u);
        if (onAuthChange) onAuthChange(u);
      }
    });
    return () => { cancelled = true; cleanup(); };
  }, [onAuthChange]);

  // Required mod + henüz login değilse modal'ı otomatik aç
  useEffect(() => {
    if (mode === 'required' && !user) setOpen(true);
  }, [mode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const result = await authSSO.login(username, password);
    setLoading(false);
    if (result.ok) {
      const fresh = authSSO.current();
      setUser(fresh);
      if (onAuthChange) onAuthChange(fresh);
      setOpen(false);
      setUsername('');
      setPassword('');
    } else {
      setError(t[result.reason] || result.message || t.unknown);
    }
  };

  const handleLogout = async () => {
    await authSSO.logout();
    setUser(null);
    if (onAuthChange) onAuthChange(null);
  };

  return (
    <>
      {user ? (
        <div className="ds-auth-pill" title={user.username}>
          <span className="ds-auth-pill__greet" aria-hidden="true">👤</span>
          <span className="ds-auth-pill__name">{user.name}</span>
          <button
            type="button"
            className="ds-auth-pill__logout"
            onClick={handleLogout}
            aria-label={t.logout}
            title={t.logout}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="ds-auth-trigger"
          onClick={() => setOpen(true)}
          aria-label={t.loginBtn}
        >
          <span aria-hidden="true">🔐</span>
          <span className="ds-auth-trigger__label">{t.loginBtn}</span>
        </button>
      )}

      {open && (
        <div className="ds-auth-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="ds-auth-title">
          <div className="ds-auth-modal__body" dir={['ar','fa'].includes(resolvedLang) ? 'rtl' : 'ltr'}>
            <h2 id="ds-auth-title" className="ds-auth-modal__title">{t.loginTitle}</h2>
            <p className="ds-auth-modal__info">{t.info}</p>

            <form onSubmit={handleSubmit} className="ds-auth-form">
              <label className="ds-auth-form__label">
                {t.username}
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </label>
              <label className="ds-auth-form__label">
                {t.password}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </label>

              {error && (
                <div className="ds-auth-form__error" role="alert">
                  {error}
                </div>
              )}

              <div className="ds-auth-form__actions">
                {mode !== 'required' && (
                  <button
                    type="button"
                    className="ds-auth-form__cancel"
                    onClick={() => { setOpen(false); setError(null); }}
                    disabled={loading}
                  >
                    {t.cancel}
                  </button>
                )}
                <button
                  type="submit"
                  className="ds-auth-form__submit"
                  disabled={loading}
                >
                  {loading ? t.loading : t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
