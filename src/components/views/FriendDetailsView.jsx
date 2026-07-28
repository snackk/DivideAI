import { useTranslation } from 'react-i18next';
import { useSwipe } from '../../utils/gestures';

export default function FriendDetailsView({ expenses, friends, user, selectedFriendEmail, onDelete, onEdit }) {
  const { t, i18n } = useTranslation();

  let friendExpenses = expenses.filter((e) => e.involvedUsers && e.involvedUsers.includes(selectedFriendEmail));
  friendExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (friendExpenses.length === 0) {
    return (
      <div className="p-12 text-center opacity-40">
        <i className="fas fa-receipt text-5xl mb-4 text-[#d0bcff]"></i>
        <p>{t('noExpenses')}</p>
      </div>
    );
  }

  const groupedByMonth = {};
  friendExpenses.forEach((exp) => {
    const d = new Date(exp.date);
    const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    const monthName = d.toLocaleDateString(locale, { month: 'long' });
    const groupKey = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${d.getFullYear()}`;
    if (!groupedByMonth[groupKey]) groupedByMonth[groupKey] = [];
    groupedByMonth[groupKey].push(exp);
  });

  return (
    <div className="view-content space-y-8 pb-10">
      {Object.keys(groupedByMonth).map((monthKey) => (
        <div key={monthKey} className="space-y-3">
          <h3 className="text-xs font-bold text-[#d0bcff] uppercase tracking-wider pl-2 sticky top-0 bg-[#1c1b1f]/90 py-1 z-20 backdrop-blur-sm shadow-[0_10px_10px_-10px_rgba(28,27,31,1)]">
            {monthKey}
          </h3>
          <div className="space-y-2">
            {groupedByMonth[monthKey].map((exp) => (
              <ExpenseCard key={exp.id} exp={exp} user={user} onDelete={onDelete} onEdit={onEdit} t={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpenseCard({ exp, user, onDelete, onEdit, t }) {
  const swipeHandlers = useSwipe();
  const iPaid = exp.paidByEmail === user.email;
  const displayAmount = exp.splitType === 'equal' ? exp.amount / 2 : exp.amount;
  const isSettle = exp.description === 'Liquidação de Contas' || exp.description === 'Settlement' || exp.description === 'Règlement de comptes';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-red-600 mb-2">
      <div
        className="absolute inset-y-0 right-0 w-20 flex flex-col items-center justify-center text-white cursor-pointer active:bg-red-700 transition-colors"
        onClick={() => onDelete(exp.id)}
      >
        <i className="fas fa-trash mb-1 text-lg"></i>
        <span className="text-[9px] font-bold uppercase tracking-wider">{t('delete')}</span>
      </div>

      <div
        className="swipe-panel material-card p-4 flex items-center gap-4 relative transition-transform duration-200 z-10 w-full"
        {...swipeHandlers}
      >
        <div className="w-10 h-10 rounded-full bg-[#2b2930] flex items-center justify-center shrink-0 border border-[#49454f]/50">
          {isSettle ? (
            <i className="fas fa-handshake text-[#938f99]"></i>
          ) : (
            <i className={`fas ${iPaid ? 'fa-arrow-up text-green-400' : 'fa-arrow-down text-orange-400'}`}></i>
          )}
        </div>

        <div className="flex-1 min-w-0 pointer-events-none">
          <h5 className={`text-sm font-medium ${isSettle ? 'text-[#d0bcff]' : 'text-[#e6e1e5]'} truncate`}>{exp.description}</h5>
          <p className="text-[10px] text-[#938f99]">{new Date(exp.date).toLocaleDateString()}</p>
        </div>

        <div className="text-right shrink-0 pr-6 pointer-events-none">
          <p className="text-[#e6e1e5] font-bold text-sm">{exp.amount.toFixed(2)}€</p>
          <p className={`text-[10px] ${iPaid ? 'text-green-400' : 'text-orange-400'} font-medium`}>
            {iPaid ? t('youReceive') : t('youOwe')}{displayAmount.toFixed(2)}€
          </p>
        </div>

        {exp.creatorEmail === user.email && !isSettle && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(exp); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#938f99] hover:text-[#d0bcff] active:scale-90 transition-transform"
          >
            <i className="fas fa-pen text-sm"></i>
          </button>
        )}
      </div>
    </div>
  );
}

