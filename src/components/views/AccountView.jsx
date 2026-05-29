import { useTranslation } from 'react-i18next';

export default function AccountView({ user, currentLang, onChangeLanguage, onLogout }) {
  const { t } = useTranslation();

  return (
    <div className="view-content space-y-6 text-center">
      <div className="flex flex-col items-center p-6 bg-[#2b2930] rounded-3xl">
        <div className="w-20 h-20 rounded-full border-4 border-[#d0bcff] overflow-hidden mb-4">
          {user.photoURL ? (
            <img src={user.photoURL} />
          ) : (
            <i className="fas fa-user text-3xl mt-5"></i>
          )}
        </div>
        <h3 className="font-bold">{user.displayName || 'User'}</h3>
        <p className="text-[#938f99] text-xs">{user.email || ''}</p>
      </div>

      <div className="bg-[#2b2930] rounded-2xl divide-y divide-[#49454f] text-left overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <span className="text-sm">{t('langSelect')}</span>
          <select
            value={currentLang?.split('-')[0] || 'en'}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-[#1c1b1f] text-xs p-2 rounded-lg outline-none"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <button
          onClick={onLogout}
          className="w-full p-4 text-left text-red-400 text-sm font-medium flex gap-3 items-center hover:bg-[#1c1b1f] transition-colors"
        >
          <i className="fas fa-sign-out-alt"></i> {t('logout')}
        </button>
      </div>
    </div>
  );
}

