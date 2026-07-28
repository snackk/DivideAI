import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ExpenseModal({ friends, editingExpense, prefillFriend, onSubmit, onClose }) {
  const { t } = useTranslation();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [friendEmail, setFriendEmail] = useState('');
  const [paidBy, setPaidBy] = useState('me');
  const [splitType, setSplitType] = useState('equal');

  useEffect(() => {
    if (editingExpense) {
      setDesc(editingExpense.description);
      setAmount(String(editingExpense.amount));
      setDate(editingExpense.date);
      setFriendEmail(editingExpense.friendId);
      setPaidBy(editingExpense.paidBy);
      setSplitType(editingExpense.splitType);
    } else if (prefillFriend) {
      setFriendEmail(prefillFriend);
    }
  }, [editingExpense, prefillFriend]);

  const getSplitInfo = () => {
    if (paidBy === 'me') return splitType === 'equal' ? t('splitInfoMeEqual') : t('splitInfoMeFull');
    return splitType === 'equal' ? t('splitInfoFriendEqual') : t('splitInfoFriendFull');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description: desc, amount, date, friendEmail, paidBy, splitType });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#1c1b1f] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 view-content border-t border-[#49454f]/40 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] sm:shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-[#49454f]/80 rounded-full mx-auto mb-6 sm:hidden"></div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{editingExpense ? t('modalEdit') : t('modalNew')}</h3>
          <button className="text-[#938f99] p-2 hover:text-[#e6e1e5]" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblDesc')}</label>
            <input type="text" required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="..."
              className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblAmount')}</label>
              <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblDate')}</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblFriend')}</label>
              <select required value={friendEmail} onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none">
                <option value="">...</option>
                {friends.map((f) => <option key={f.email} value={f.email}>{f.displayName}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblPaidBy')}</label>
              <select required value={paidBy} onChange={(e) => setPaidBy(e.target.value)}
                className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none">
                <option value="me">{t('me')}</option>
                <option value="friend">{t('friend')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblSplit')}</label>
              <select required value={splitType} onChange={(e) => setSplitType(e.target.value)}
                className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none">
                <option value="equal">{t('splitEqual')}</option>
                <option value="full">{t('splitFull')}</option>
              </select>
            </div>
          </div>

          <div className="bg-[#2b2930] border border-[#49454f]/30 p-4 rounded-2xl text-sm text-[#938f99] mt-4 italic">{getSplitInfo()}</div>

          <button type="submit" className="w-full bg-[#d0bcff] text-[#381e72] font-bold py-4 rounded-2xl mt-6 active:scale-[0.98] transition-transform">
            {editingExpense ? t('update') : t('save')}
          </button>
        </form>
      </div>
    </div>
  );
}

