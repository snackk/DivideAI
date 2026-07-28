import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AuthScreen({ onLogin }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onLogin();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1b1f] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-10">
        <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#e8dbff] to-[#b39ddb] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#d0bcff]/25">
          <i className="fas fa-wallet text-[#381e72] text-4xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-[#e6e1e5]">{t('welcomeTitle')}</h1>
        <p className="text-[#938f99] mt-2">{t('welcomeSubtitle')}</p>
      </div>

      {loading && (
        <div className="mb-4">
          <div className="inline-block w-8 h-8 border-4 border-[#d0bcff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm mt-2 text-[#938f99]">{t('authLoading')}</p>
        </div>
      )}

      {!loading && (
        <button
          onClick={handleClick}
          className="w-full max-w-xs bg-white text-black font-medium py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-gray-100 shadow-lg"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
          <span>{t('loginText')}</span>
        </button>
      )}
    </div>
  );
}

