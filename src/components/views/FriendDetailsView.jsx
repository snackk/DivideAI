import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSwipe } from '../../utils/gestures';
import { formatCurrency } from '../../utils/formatCurrency';

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
  const { i18n } = useTranslation();
  const swipeHandlers = useSwipe();
  const panelRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const hasMountedRef = useRef(false);
  // Set synchronously, immediately before a click/keydown handler triggers a
  // confirming-state flip that swaps which button is rendered (and so
  // unmounts the currently-focused one). Consumed synchronously by
  // handleActionsBlur in the same task, before any render/commit happens —
  // this does not depend on the relative timing of React's effects vs. any
  // timer, it's plain synchronous JS ordering within one event handler.
  const suppressNextBlurCloseRef = useRef(false);
  const [confirming, setConfirming] = useState(false);
  const iPaid = exp.paidByEmail === user.email;
  const displayAmount = exp.splitType === 'equal' ? exp.amount / 2 : exp.amount;
  const isSettle = exp.description === 'Liquidação de Contas' || exp.description === 'Settlement' || exp.description === 'Règlement de comptes';

  // useSwipe drives the open/closed position by writing the same inline
  // transform directly on the swipe-panel element (see src/utils/gestures.js:
  // 'translateX(-80px)' open, 'translateX(0)' closed). Keyboard focus entering
  // the delete/confirm/cancel buttons underneath needs to produce that same
  // visual state, since those buttons are otherwise fully covered by this panel.
  const setPanelOpen = (open) => {
    const el = panelRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.2s ease-out';
    el.style.transform = open ? 'translateX(-80px)' : 'translateX(0)';
  };

  // Delete -> confirming (and cancel/Escape -> delete) swap which button is
  // rendered, so move focus onto whichever button takes the unmounted one's
  // place. This keeps the keyboard flow inside the group (no lost Tab
  // position) once the DOM has actually updated; it's a UX nicety and is not
  // what the blur handler relies on to decide whether to close the panel.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (confirming) {
      confirmButtonRef.current?.focus();
    } else {
      deleteButtonRef.current?.focus();
    }
  }, [confirming]);

  const handleActionsFocus = () => {
    // Defensive reset: any stale suppress flag from an earlier click that
    // never actually focused its button (see handleButtonClick below) must
    // never carry over into a later, unrelated focus/blur cycle on this row.
    suppressNextBlurCloseRef.current = false;
    setPanelOpen(true);
  };

  // Only worth suppressing the next blur's close-on-unmount logic when the
  // clicked button was actually the focused element: in Safari-style UAs, a
  // mouse click on a <button> does not focus it by default, so unmounting
  // it fires no blur at all — setting the flag in that case would leave it
  // stuck "true" with nothing left to consume it, and a later *real*
  // focus-out on this row would then be wrongly swallowed.
  const handleButtonClick = (e, run) => {
    if (document.activeElement === e.currentTarget) {
      suppressNextBlurCloseRef.current = true;
    }
    run();
  };

  const handleActionsBlur = (e) => {
    // Delete <-> confirming swaps unmount the focused button, which makes
    // the browser fire a native blur/focusout with relatedTarget === null —
    // indistinguishable, by relatedTarget alone, from a real focus-out. The
    // suppress flag is set synchronously by the handlers below, in the same
    // event-handler call stack that triggers the swap, so it is always
    // already true here for that case (ordinary JS execution order, no
    // scheduler timing involved) and we just consume it and skip closing.
    if (suppressNextBlurCloseRef.current) {
      suppressNextBlurCloseRef.current = false;
      return;
    }
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setPanelOpen(false);
    }
  };

  const handleActionsKeyDown = (e) => {
    if (e.key === 'Escape' && confirming) {
      suppressNextBlurCloseRef.current = true;
      setConfirming(false);
    }
  };

  const handleDeleteClick = (e) => handleButtonClick(e, () => setConfirming(true));

  const handleCancelClick = (e) => handleButtonClick(e, () => setConfirming(false));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-red-600 mb-2">
      <div
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center text-white select-none"
        onFocus={handleActionsFocus}
        onBlur={handleActionsBlur}
        onKeyDown={handleActionsKeyDown}
      >
        {confirming ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold uppercase tracking-tight leading-[1.1] text-center px-1">
              {t('confirmDelete')}
            </span>
            <div className="flex gap-1">
              <button
                ref={confirmButtonRef}
                type="button"
                aria-label={t('confirm')}
                onClick={(e) =>
                  handleButtonClick(e, () => {
                    setConfirming(false);
                    onDelete(exp.id);
                  })
                }
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors focus:outline focus:outline-2 focus:outline-white"
              >
                <i className="fas fa-check text-xs"></i>
              </button>
              <button
                type="button"
                aria-label={t('cancel')}
                onClick={handleCancelClick}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors focus:outline focus:outline-2 focus:outline-white"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        ) : (
          <button
            ref={deleteButtonRef}
            type="button"
            aria-label={t('delete')}
            onClick={handleDeleteClick}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer active:bg-red-700 transition-colors focus:outline focus:outline-2 focus:outline-white"
          >
            <i className="fas fa-trash mb-1 text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-wider">{t('delete')}</span>
          </button>
        )}
      </div>

      <div
        ref={panelRef}
        className="swipe-panel material-card p-4 flex items-center gap-4 relative transition-transform duration-200 z-10 w-full select-none"
        {...swipeHandlers}
      >
        <div className="w-10 h-10 rounded-full bg-[#2b2930] flex items-center justify-center shrink-0 border border-[#49454f]/50">
          {isSettle ? (
            <i className="fas fa-handshake text-[#938f99]"></i>
          ) : (
            <i className={`fas ${iPaid ? 'fa-arrow-up text-green-400' : 'fa-arrow-down text-orange-400'}`}></i>
          )}
        </div>

        <div className="flex-1 min-w-0 select-text">
          <h5 className={`text-sm font-medium ${isSettle ? 'text-[#d0bcff]' : 'text-[#e6e1e5]'} truncate`}>{exp.description}</h5>
          <p className="text-[10px] text-[#938f99]">{new Date(exp.date).toLocaleDateString()}</p>
        </div>

        <div className="text-right shrink-0 pr-6 select-text">
          <p className="text-[#e6e1e5] font-bold text-sm">{formatCurrency(exp.amount, i18n.language)}</p>
          <p className={`text-[10px] ${iPaid ? 'text-green-400' : 'text-orange-400'} font-medium`}>
            {iPaid ? t('youReceive') : t('youOwe')}{formatCurrency(displayAmount, i18n.language)}
          </p>
        </div>

        {exp.creatorEmail === user.email && !isSettle && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(exp); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#938f99] hover:text-[#d0bcff] active:scale-90 transition-transform select-none"
          >
            <i className="fas fa-pen text-sm"></i>
          </button>
        )}
      </div>
    </div>
  );
}

