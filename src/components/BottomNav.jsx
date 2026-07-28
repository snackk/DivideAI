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

  const NavButton = ({ item }) => (
    <button
      key={item.view}
      onClick={() => onSwitchView(item.view)}
      className={`flex-1 h-full flex items-center justify-center transition-all active:opacity-60 ${
        isActive(item.view) ? 'text-[#d0bcff]' : 'text-[#938f99]'
      }`}
    >
      <span className={`flex flex-col items-center justify-center gap-0.5 h-12 w-14 rounded-2xl transition-all duration-300 ${
        isActive(item.view) ? 'bg-[#d0bcff]/20' : 'bg-transparent'
      }`}>
        <i className={`fas ${item.icon} text-lg`}></i>
        <span className="text-[9px] font-semibold">{item.label}</span>
      </span>
    </button>
  );

  return (
    <div className="fixed inset-x-4 max-w-md mx-auto z-50" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      <nav className="bg-[#2b2930]/95 backdrop-blur-xl rounded-[28px] border border-[#49454f]/30 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] h-20 flex items-center px-2">
        {navItems.map((item) => <NavButton key={item.view} item={item} />)}

        <div className="flex-1 flex justify-center items-center -mt-8">
          <button
            onClick={onFabClick}
            disabled={isAccount}
            className={`w-14 h-14 bg-[#d0bcff] rounded-2xl flex items-center justify-center text-[#381e72] shadow-xl shadow-[#d0bcff]/25 transition-transform active:scale-90 border-4 border-[#1c1b1f] ${
              isAccount ? 'opacity-20 pointer-events-none grayscale' : ''
            }`}
          >
            <i className="fas fa-plus text-2xl"></i>
          </button>
        </div>

        {navItems2.map((item) => <NavButton key={item.view} item={item} />)}
      </nav>
    </div>
  );
}

