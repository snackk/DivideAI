import { useTranslation } from 'react-i18next';
import { calculateFriendBalance } from '../../utils/balance';

export default function FriendsView({ friends, expenses, user, onOpenFriendDetails }) {
  const { t } = useTranslation();

  let totalToReceive = 0;
  let totalToPay = 0;
  friends.forEach((f) => {
    const bal = calculateFriendBalance(expenses, f.email, user.email);
    if (bal > 0) totalToReceive += bal;
    else totalToPay += Math.abs(bal);
  });

  return (
    <div className="view-content space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-3xl text-center">
          <p className="text-[10px] text-green-400 uppercase tracking-wider">{t('totalToReceive')}</p>
          <h3 className="text-xl font-bold text-green-400">{totalToReceive.toFixed(2)}€</h3>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-3xl text-center">
          <p className="text-[10px] text-orange-400 uppercase tracking-wider">{t('totalToPay')}</p>
          <h3 className="text-xl font-bold text-orange-400">{totalToPay.toFixed(2)}€</h3>
        </div>
      </div>

      <div className="space-y-2">
        {friends.length === 0 ? (
          <p className="text-center text-[#938f99] py-12 text-sm">{t('noFriends')}</p>
        ) : (
          friends.map((f) => {
            const bal = calculateFriendBalance(expenses, f.email, user.email);
            return (
              <div
                key={f.id}
                className="material-card p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => onOpenFriendDetails(f.email)}
              >
                <div className="w-12 h-12 rounded-full bg-[#49454f] overflow-hidden flex items-center justify-center shrink-0">
                  {f.photoURL ? (
                    <img src={f.photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <i className="fas fa-user text-lg"></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base text-[#e6e1e5] truncate">{f.displayName}</h4>
                  <p className="text-[10px] text-[#938f99] truncate">{f.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${bal > 0 ? 'text-green-400' : bal < 0 ? 'text-orange-400' : 'text-[#938f99]'}`}>
                    {bal > 0 ? `+${bal.toFixed(2)}€` : bal < 0 ? `${bal.toFixed(2)}€` : t('allPaid')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

