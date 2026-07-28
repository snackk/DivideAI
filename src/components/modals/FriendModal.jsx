import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FriendModal({ onSubmit, onClose }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email.trim().toLowerCase(), name.trim());
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#1c1b1f] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 view-content border-t border-[#49454f]/40 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] sm:shadow-2xl">
        <div className="w-12 h-1.5 bg-[#49454f]/80 rounded-full mx-auto mb-6 sm:hidden"></div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{t('modalAddFriend')}</h3>
          <button className="text-[#938f99] p-2 hover:text-[#e6e1e5]" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblFriendEmail')}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@gmail.com"
              className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#d0bcff] mb-1 ml-1">{t('lblFriendName')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como o identificas?"
              className="w-full bg-[#2b2930] border border-[#49454f] rounded-2xl p-3 focus:border-[#d0bcff] outline-none" />
          </div>
          <button type="submit" className="w-full bg-[#d0bcff] text-[#381e72] font-bold py-4 rounded-2xl mt-6 uppercase tracking-wider text-xs active:scale-[0.98] transition-transform">
            {t('addToList')}
          </button>
        </form>
      </div>
    </div>
  );
}

