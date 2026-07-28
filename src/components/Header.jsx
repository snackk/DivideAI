import { useTranslation } from 'react-i18next';

export default function Header({
  currentView,
  selectedFriendEmail,
  friends,
  user,
  searchOpen,
  searchTerm,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onBack,
  onAccountClick,
}) {
  const { t } = useTranslation();

  const isFriendDetails = currentView === 'friend-details';
  const friend = isFriendDetails
    ? friends.find((f) => f.email === selectedFriendEmail) || { displayName: selectedFriendEmail?.split('@')[0] }
    : null;

  const getTitle = () => {
    if (isFriendDetails) return null;
    switch (currentView) {
      case 'activity': return t('activityTitle');
      case 'friends': return t('friendsTitle');
      case 'account': return t('accountTitle');
      case 'groups': return t('navGroups');
      default: return currentView;
    }
  };

  return (
    <header className="safe-area-top sticky top-0 bg-[#1c1b1f]/75 backdrop-blur-xl z-40 px-4 pb-4 flex items-center justify-between border-b border-[#49454f]/25">
      <div className="flex items-center gap-3 min-w-0">
        {isFriendDetails && (
          <button
            className="text-[#e6e1e5] p-2 -ml-2 rounded-full hover:bg-[#2b2930] transition-colors shrink-0"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
        )}
        {isFriendDetails ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#49454f] flex items-center justify-center overflow-hidden border border-[#938f99]/30 shrink-0">
              {friend?.photoURL ? (
                <img src={friend.photoURL} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-user text-sm"></i>
              )}
            </div>
            <span className="text-lg font-bold truncate max-w-[150px] sm:max-w-[200px]">{friend?.displayName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#e8dbff] to-[#b39ddb] flex items-center justify-center shadow-lg shadow-[#d0bcff]/25 shrink-0">
              <i className="fas fa-wallet text-[#381e72] text-lg"></i>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight tracking-tight truncate">{getTitle()}</h2>
              <p className="text-[9px] text-[#938f99] uppercase tracking-[0.2em] font-medium">DivideAI</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center justify-end shrink-0">
        {searchOpen && (
          <div className="flex items-center bg-[#2b2930] rounded-full px-3 py-1 w-full max-w-[200px] transition-all">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value.toLowerCase())}
              placeholder="Procurar..."
              autoFocus
              className="bg-transparent border-none outline-none text-xs w-full text-[#e6e1e5] placeholder-[#938f99]"
            />
            <button onClick={onSearchClose}>
              <i className="fas fa-times text-[#938f99] text-xs"></i>
            </button>
          </div>
        )}

        {!searchOpen && !isFriendDetails && (
          <button className="text-[#938f99]" onClick={onSearchOpen}>
            <i className="fas fa-search text-xl"></i>
          </button>
        )}

        {!isFriendDetails && (
          <div
            className="w-9 h-9 rounded-full bg-[#49454f] overflow-hidden border border-[#938f99]/40 cursor-pointer active:scale-90 transition-transform"
            onClick={onAccountClick}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-user text-xs flex items-center justify-center h-full"></i>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

