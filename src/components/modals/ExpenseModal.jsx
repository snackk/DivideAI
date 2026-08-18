import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ExpenseModal({ friends, editingExpense, prefillFriend, onSubmit, onClose }) {
  const { t } = useTranslation();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [friendDropdownOpen, setFriendDropdownOpen] = useState(false);
  const [paidBy, setPaidBy] = useState('me');
  const [splitType, setSplitType] = useState('equal');

  const getFirstLastName = (name) => {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 2) return parts.join(' ');
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };

  const findFriendByEmail = (email) => friends.find((f) => f.email === email);

  // Allows free typing of digits, dots and commas while the user is editing.
  const sanitizeAmountChars = (rawValue) => rawValue.replace(/\s/g, '').replace(/[^\d.,]/g, '');

  // Fully normalizes a value like "1.234,56" or "1,234.56" or "1234,5" into "1234.56",
  // correctly telling apart the decimal separator from thousands separators.
  const normalizeAmountValue = (rawValue) => {
    let cleaned = sanitizeAmountChars(rawValue);
    if (!cleaned) return '';

    const commaCount = (cleaned.match(/,/g) || []).length;
    const dotCount = (cleaned.match(/\./g) || []).length;
    let decimalSeparator = null;

    if (commaCount && dotCount) {
      // Whichever separator appears last is the decimal one; the other is thousands.
      decimalSeparator = cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.') ? ',' : '.';
    } else if (commaCount) {
      const decLen = cleaned.length - cleaned.lastIndexOf(',') - 1;
      decimalSeparator = commaCount === 1 && decLen <= 2 ? ',' : null;
    } else if (dotCount) {
      const decLen = cleaned.length - cleaned.lastIndexOf('.') - 1;
      decimalSeparator = dotCount === 1 && decLen <= 2 ? '.' : null;
    }

    if (decimalSeparator) {
      const thousandSeparator = decimalSeparator === ',' ? '.' : ',';
      const thousandRegex = thousandSeparator === '.' ? /\./g : /,/g;
      cleaned = cleaned.replace(thousandRegex, '');
      const lastSepIndex = cleaned.lastIndexOf(decimalSeparator);
      const intPart = cleaned.slice(0, lastSepIndex).replace(new RegExp(`\\${decimalSeparator}`, 'g'), '');
      const decPart = cleaned.slice(lastSepIndex + 1).replace(new RegExp(`\\${decimalSeparator}`, 'g'), '');
      cleaned = decPart ? `${intPart || '0'}.${decPart.slice(0, 2)}` : (intPart || '0');
    } else {
      // No clear decimal marker: treat every dot/comma as a thousands separator.
      cleaned = cleaned.replace(/[.,]/g, '');
    }

    return cleaned;
  };

  useEffect(() => {
    if (editingExpense) {
      setDesc(editingExpense.description);
      setAmount(String(editingExpense.amount));
      setDate(editingExpense.date);
      setFriendEmail(editingExpense.friendId);
      const editingFriend = findFriendByEmail(editingExpense.friendId);
      setFriendSearch(editingFriend ? editingFriend.displayName : editingExpense.friendId);
      setPaidBy(editingExpense.paidBy);
      setSplitType(editingExpense.splitType);
    } else if (prefillFriend) {
      setFriendEmail(prefillFriend);
      const selectedFriend = findFriendByEmail(prefillFriend);
      setFriendSearch(selectedFriend ? selectedFriend.displayName : prefillFriend);
    } else {
      setFriendEmail('');
      setFriendSearch('');
    }
  }, [editingExpense, prefillFriend]);

  useEffect(() => {
    if (!friendEmail) return;
    const selectedFriend = findFriendByEmail(friendEmail);
    if (selectedFriend && friendSearch !== selectedFriend.displayName) {
      setFriendSearch(selectedFriend.displayName);
    }
  }, [friendEmail, friendSearch, friends]);

  const getSplitInfo = () => {
    if (paidBy === 'me') return splitType === 'equal' ? t('splitInfoMeEqual') : t('splitInfoMeFull');
    return splitType === 'equal' ? t('splitInfoFriendEqual') : t('splitInfoFriendFull');
  };

  const filteredFriends = friends.filter((f) => {
    const term = friendSearch.trim().toLowerCase();
    if (!term) return true;
    return f.displayName.toLowerCase().includes(term) || f.email.toLowerCase().includes(term);
  });

  const selectFriend = (email) => {
    const selectedFriend = findFriendByEmail(email);
    setFriendEmail(email);
    setFriendSearch(selectedFriend ? selectedFriend.displayName : email);
    setFriendDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedAmount = normalizeAmountValue(amount);
    if (!normalizedAmount || Number.isNaN(parseFloat(normalizedAmount))) return;
    if (!friendEmail) return;
    onSubmit({ description: desc, amount: normalizedAmount, date, friendEmail, paidBy, splitType });
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
              <input type="text" inputMode="decimal" required value={amount}
                onChange={(e) => setAmount(sanitizeAmountChars(e.target.value))}
                onBlur={() => setAmount((prev) => normalizeAmountValue(prev))}
                placeholder="0.00"
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
              <div className="relative">
                <input
                  type="text"
                  value={friendSearch}
                  onChange={(e) => {
                    setFriendSearch(e.target.value);
                    setFriendEmail('');
                    setFriendDropdownOpen(true);
                  }}
                  onFocus={() => setFriendDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setFriendDropdownOpen(false), 120)}
                  placeholder={t('friendSearchPlaceholder')}
                  className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 pr-10 focus:border-[#d0bcff] outline-none"
                />
                <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-[#938f99]"></i>

                {friendDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-[#2b2930] border border-[#49454f] rounded-2xl max-h-56 overflow-y-auto shadow-xl divide-y divide-[#49454f]/30 dropdown-fade-in">
                    {friends.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-[#938f99]">
                        <i className="fas fa-user-friends text-lg mb-2 block text-[#49454f]"></i>
                        {t('noFriends')}
                      </div>
                    ) : filteredFriends.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-[#938f99]">
                        <i className="fas fa-search text-lg mb-2 block text-[#49454f]"></i>
                        {t('friendSearchNoResults')}
                      </div>
                    ) : (
                      filteredFriends.map((f) => {
                        const isSelected = f.email === friendEmail;
                        return (
                          <button
                            key={f.email}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectFriend(f.email)}
                            className={`w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors ${
                              isSelected ? 'bg-[#d0bcff]/10' : 'hover:bg-[#3a3742]'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-full bg-[#49454f] flex items-center justify-center overflow-hidden border border-[#938f99]/20 shrink-0">
                              {f.photoURL ? (
                                <img src={f.photoURL} alt={f.displayName} className="w-full h-full object-cover" />
                              ) : (
                                <i className="fas fa-user text-sm text-[#e6e1e5]"></i>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-[#e6e1e5] truncate">{getFirstLastName(f.displayName)}</p>
                              <p className="text-[11px] text-[#938f99] truncate">{f.email}</p>
                            </div>
                            {isSelected && <i className="fas fa-check text-[#d0bcff] text-sm shrink-0"></i>}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
                <input type="hidden" required value={friendEmail} readOnly />
              </div>
              {!friendEmail && friendSearch && <p className="text-[10px] text-orange-400 mt-1 ml-1">{t('friendSearchSelectHint')}</p>}
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

