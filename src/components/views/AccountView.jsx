import { useTranslation } from 'react-i18next';

export default function AccountView({ user, currentLang, onChangeLanguage, onLogout }) {
  const { t } = useTranslation();

  return (
    <div className="view-content space-y-6 text-center">
      <div className="material-card flex flex-col items-center p-6">
        <div className="w-20 h-20 rounded-full border-4 border-[#d0bcff] overflow-hidden mb-4 bg-[#49454f] flex items-center justify-center">
          {user.photoURL ? (
            <img src={user.photoURL} className="w-full h-full object-cover" />
          ) : (
            <i className="fas fa-user text-3xl"></i>
          )}
        </div>
        <h3 className="font-bold">{user.displayName || 'User'}</h3>
        <p className="text-[#938f99] text-xs">{user.email || ''}</p>
      </div>

      <div className="material-card divide-y divide-[#49454f]/40 text-left overflow-hidden">
        <div className="p-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#49454f] text-[#938f99] flex items-center justify-center shrink-0">
              <i className="fas fa-globe text-lg"></i>
            </div>
            <span className="text-sm font-medium truncate">{t('langSelect')}</span>
          </div>
          <select
            value={currentLang?.split('-')[0] || 'en'}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-[#1c1b1f] border border-[#49454f] text-xs p-2 rounded-xl outline-none shrink-0"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <button
          onClick={onLogout}
          className="w-full p-4 flex gap-4 items-center active:bg-[#1c1b1f] transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
            <i className="fas fa-sign-out-alt text-lg"></i>
          </div>
          <span className="text-sm font-medium text-red-400">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}

