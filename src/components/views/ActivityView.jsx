import { useTranslation } from 'react-i18next';
import { useLongPress } from '../../utils/gestures';
import { calculateFriendBalance } from '../../utils/balance';

export default function ActivityView({ expenses, friends, user, searchTerm, onOpenFriendDetails, onOpenSettle }) {
  const { t } = useTranslation();

  const filteredExpenses = expenses.filter((exp) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    const descMatch = exp.description.toLowerCase().includes(term);
    const friend = friends.find((f) => f.email === exp.friendId);
    const nameMatch = friend ? friend.displayName.toLowerCase().includes(term) : false;
    const emailMatch = exp.friendId.toLowerCase().includes(term);
    return descMatch || nameMatch || emailMatch;
  });

  if (filteredExpenses.length === 0) {
    return (
      <div className="p-12 text-center opacity-40">
        <i className="fas fa-search text-5xl mb-4 text-[#d0bcff]"></i>
        <p>{t('noActivityFound')}</p>
      </div>
    );
  }

  // Group by friend
  const grouped = {};
  filteredExpenses.forEach((exp) => {
    if (!grouped[exp.friendId]) grouped[exp.friendId] = [];
    grouped[exp.friendId].push(exp);
  });

  const cards = [];
  Object.keys(grouped).forEach((friendEmail) => {
    const friendExpenses = grouped[friendEmail];
    const friend = friends.find((f) => f.email === friendEmail) || { displayName: friendEmail.split('@')[0] };

    const groupBalance = friendExpenses.reduce((sum, e) => {
      const amount = e.splitType === 'equal' ? e.amount / 2 : e.amount;
      return sum + (e.paidByEmail === user.email ? amount : -amount);
    }, 0);

    if (Math.abs(groupBalance) < 0.01) return;

    cards.push({ friendEmail, friend, friendExpenses, groupBalance });
  });

  if (cards.length === 0) {
    return (
      <div className="p-12 text-center opacity-40">
        <i className="fas fa-check-circle text-5xl mb-4 text-green-400"></i>
        <p>{t('allClear')}</p>
      </div>
    );
  }

  return (
    <div className="view-content space-y-3">
      {cards.map(({ friendEmail, friend, friendExpenses, groupBalance }) => (
        <ActivityCard
          key={friendEmail}
          friendEmail={friendEmail}
          friend={friend}
          friendExpenses={friendExpenses}
          groupBalance={groupBalance}
          onOpenFriendDetails={onOpenFriendDetails}
          onOpenSettle={onOpenSettle}
        />
      ))}
    </div>
  );
}

function ActivityCard({ friendEmail, friend, friendExpenses, groupBalance, onOpenFriendDetails, onOpenSettle }) {
  const { t } = useTranslation();

  const longPressHandlers = useLongPress(
    () => onOpenSettle(friendEmail, groupBalance),
    () => onOpenFriendDetails(friendEmail),
  );

  return (
    <div
      {...longPressHandlers}
      className="material-card flex items-center gap-4 p-4 cursor-pointer select-none"
    >
      <div className="w-12 h-12 rounded-full bg-[#49454f] flex items-center justify-center overflow-hidden border border-[#938f99]/20 shrink-0 pointer-events-none">
        {friend.photoURL ? (
          <img src={friend.photoURL} className="w-full h-full object-cover" />
        ) : (
          <i className="fas fa-user text-lg"></i>
        )}
      </div>
      <div className="flex-1 min-w-0 pointer-events-none">
        <h4 className="font-bold text-base text-[#e6e1e5] truncate">{friend.displayName}</h4>
        <p className="text-xs text-[#938f99]">
          {friendExpenses.length} {friendExpenses.length === 1 ? t('expenses_one') : t('expenses_other')}
        </p>
      </div>
      <div className="text-right shrink-0 pointer-events-none">
        <span className={`status-badge ${groupBalance >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
          {groupBalance >= 0 ? '+' : ''}{groupBalance.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}

