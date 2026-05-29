import { useTranslation } from 'react-i18next';

export default function SettleModal({ settleData, user, onConfirm, onClose }) {
  const { t } = useTranslation();
  const { balance, friendName } = settleData;
  const absBal = Math.abs(balance).toFixed(2);

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#2b2930] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 view-content">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{t('settleTitle')}</h3>
          <button className="text-[#938f99] p-2" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="text-center mb-6 text-[#e6e1e5] p-4 bg-[#1c1b1f] rounded-xl border border-[#49454f]">
          {balance < 0 ? (
            <span>
              {t('settleYouPay')} <strong className="text-[#d0bcff] text-xl block my-2">{absBal}€</strong> {t('settleTo')} <strong>{friendName}</strong>?
            </span>
          ) : (
            <span>
              {t('settleFriendPays')} <strong>{friendName}</strong> {t('settlePaidYou')} <strong className="text-[#d0bcff] text-xl block my-2">{absBal}€</strong>?
            </span>
          )}
        </div>

        <button
          onClick={onConfirm}
          className="w-full bg-[#d0bcff] text-[#381e72] font-bold py-4 rounded-full transition-transform active:scale-[0.98]"
        >
          {t('settleConfirm')}
        </button>
      </div>
    </div>
  );
}

