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
    <header className="p-4 flex items-center justify-between sticky top-0 bg-[#1c1b1f] z-10 shadow-sm">
      <div className="flex items-center gap-2">
        {isFriendDetails && (
          <button
            className="text-[#e6e1e5] p-2 -ml-2 rounded-full hover:bg-[#2b2930] transition-colors"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
        )}
        {isFriendDetails ? (
          <div className="text-xl font-medium flex items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#49454f] flex items-center justify-center overflow-hidden border border-[#938f99]/30 shrink-0">
                {friend?.photoURL ? (
                  <img src={friend.photoURL} className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-user text-xs"></i>
                )}
              </div>
              <span className="text-lg truncate max-w-[150px] sm:max-w-[200px]">{friend?.displayName}</span>
            </div>
          </div>
        ) : (
          <div className="text-xl font-medium flex items-center gap-2">{getTitle()}</div>
        )}
      </div>

      <div className="flex gap-4 items-center flex-1 justify-end">
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
            className="w-8 h-8 rounded-full bg-[#49454f] overflow-hidden border border-[#938f99] cursor-pointer"
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

