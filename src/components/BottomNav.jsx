import { useTranslation } from 'react-i18next';

export default function BottomNav({ currentView, onSwitchView, onFabClick }) {
  const { t } = useTranslation();
  const isAccount = currentView === 'account';

  const navItems = [
    { view: 'activity', icon: 'fa-clock', label: t('navActivity') },
    { view: 'friends', icon: 'fa-users', label: t('navFriends') },
  ];

  const navItems2 = [
    { view: 'groups', icon: 'fa-layer-group', label: t('navGroups') },
    { view: 'account', icon: 'fa-user-circle', label: t('navAccount') },
  ];

  const isActive = (view) => currentView === view || (currentView === 'friend-details' && view === 'activity');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#2b2930] border-t border-[#49454f] flex justify-between items-center px-4 safe-area-bottom max-w-md mx-auto z-50 h-20 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onSwitchView(item.view)}
          className={`nav-item flex flex-col items-center justify-center flex-1 transition-all active:opacity-50 ${
            isActive(item.view) ? 'text-[#d0bcff]' : 'text-[#938f99]'
          }`}
        >
          <i className={`fas ${item.icon} text-xl mb-1`}></i>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}

      <div className="flex-1 flex justify-center items-center -mt-8">
        <button
          onClick={onFabClick}
          disabled={isAccount}
          className={`w-14 h-14 bg-[#d0bcff] rounded-2xl flex items-center justify-center text-[#381e72] shadow-2xl transition-transform active:scale-90 border-4 border-[#1c1b1f] ${
            isAccount ? 'opacity-20 pointer-events-none grayscale' : ''
          }`}
        >
          <i className="fas fa-plus text-2xl"></i>
        </button>
      </div>

      {navItems2.map((item) => (
        <button
          key={item.view}
          onClick={() => onSwitchView(item.view)}
          className={`nav-item flex flex-col items-center justify-center flex-1 transition-all active:opacity-50 ${
            isActive(item.view) ? 'text-[#d0bcff]' : 'text-[#938f99]'
          }`}
        >
          <i className={`fas ${item.icon} text-xl mb-1`}></i>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

