import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { useFriends } from './hooks/useFriends';
import { useSearch } from './hooks/useSearch';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import ExpenseModal from './components/modals/ExpenseModal';
import FriendModal from './components/modals/FriendModal';
import SettleModal from './components/modals/SettleModal';
import ActivityView from './components/views/ActivityView';
import FriendsView from './components/views/FriendsView';
import FriendDetailsView from './components/views/FriendDetailsView';
import GroupsView from './components/views/GroupsView';
import AccountView from './components/views/AccountView';

export default function App() {
  const { t, i18n } = useTranslation();
  const { user, loading, login, logout } = useAuth();
  const { expenses, addExpense, updateExpense, removeExpense } = useExpenses(user);
  const { friends, addFriend } = useFriends(user);
  const { searchTerm, setSearchTerm, searchOpen, openSearch, closeSearch } = useSearch();

  const [currentView, setCurrentView] = useState('activity');
  const [selectedFriendEmail, setSelectedFriendEmail] = useState(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [settleData, setSettleData] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [prefillFriend, setPrefillFriend] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const switchView = useCallback((v) => {
    setCurrentView(v);
    if (v !== 'friend-details') setSelectedFriendEmail(null);
  }, []);

  const openFriendDetails = useCallback((email) => {
    setSelectedFriendEmail(email);
    setCurrentView('friend-details');
  }, []);

  const goBack = useCallback(() => {
    switchView('activity');
  }, [switchView]);

  const handleFabClick = useCallback(() => {
    if (currentView === 'friends') {
      setFriendModalOpen(true);
    } else if (currentView === 'friend-details' && selectedFriendEmail) {
      setPrefillFriend(selectedFriendEmail);
      setEditingExpense(null);
      setExpenseModalOpen(true);
    } else {
      setPrefillFriend(null);
      setEditingExpense(null);
      setExpenseModalOpen(true);
    }
  }, [currentView, selectedFriendEmail]);

  const handleEditExpense = useCallback((exp) => {
    setEditingExpense(exp);
    setPrefillFriend(null);
    setExpenseModalOpen(true);
  }, []);

  const handleOpenSettle = useCallback((email, balance) => {
    const friend = friends.find((f) => f.email === email) || { displayName: email.split('@')[0] };
    setSettleData({ email, balance, friendName: friend.displayName });
    setSettleModalOpen(true);
  }, [friends]);

  const handleConfirmSettle = useCallback(async () => {
    if (!settleData || !user) return;
    const { email, balance } = settleData;
    const data = {
      description: t('settleDescription'),
      amount: Math.abs(balance),
      date: new Date().toISOString().split('T')[0],
      creatorEmail: user.email,
      friendEmail: email,
      paidByEmail: balance < 0 ? user.email : email,
      splitType: 'full',
      timestamp: Date.now(),
      involvedUsers: [user.email, email],
    };
    await addExpense(data);
    setSettleModalOpen(false);
    setSettleData(null);
    showToast(t('settleToast'));
  }, [settleData, user, addExpense, showToast, t]);

  const handleExpenseSubmit = useCallback(async (formData) => {
    if (!user) return;
    const data = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      creatorEmail: user.email,
      friendEmail: formData.friendEmail,
      paidByEmail: formData.paidBy === 'me' ? user.email : formData.friendEmail,
      splitType: formData.splitType,
      timestamp: Date.now(),
      involvedUsers: [user.email, formData.friendEmail],
    };

    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
      showToast(t('toastUpdated'));
    } else {
      await addExpense(data);
      showToast(t('toastCreated'));
    }
    setExpenseModalOpen(false);
    setEditingExpense(null);
  }, [user, editingExpense, addExpense, updateExpense, showToast, t]);

  const handleAddFriend = useCallback(async (email, customName) => {
    if (!user) return;
    if (email === user.email) return;
    if (friends.some((f) => f.email === email)) {
      showToast(t('friendAlreadyExists'));
      return;
    }
    await addFriend(email, customName);
    setFriendModalOpen(false);
    showToast(t('friendAdded'));
  }, [user, friends, addFriend, showToast, t]);

  const handleDeleteExpense = useCallback(async (id) => {
    await removeExpense(id);
    showToast(t('toastDeleted'));
  }, [removeExpense, showToast, t]);

  const changeLanguage = useCallback((lang) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  if (loading) return null;
  if (!user) return <AuthScreen onLogin={login} />;

  const renderView = () => {
    switch (currentView) {
      case 'activity':
        return (
          <ActivityView
            expenses={expenses}
            friends={friends}
            user={user}
            searchTerm={searchTerm}
            onOpenFriendDetails={openFriendDetails}
            onOpenSettle={handleOpenSettle}
          />
        );
      case 'friends':
        return (
          <FriendsView
            friends={friends}
            expenses={expenses}
            user={user}
            onOpenFriendDetails={openFriendDetails}
          />
        );
      case 'friend-details':
        return (
          <FriendDetailsView
            expenses={expenses}
            friends={friends}
            user={user}
            selectedFriendEmail={selectedFriendEmail}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        );
      case 'groups':
        return <GroupsView />;
      case 'account':
        return (
          <AccountView
            user={user}
            currentLang={i18n.language}
            onChangeLanguage={changeLanguage}
            onLogout={logout}
          />
        );
      default:
        return <div className="p-12 text-center opacity-40 uppercase text-xs">{currentView} em breve</div>;
    }
  };

  return (
    <div className="hidden flex-col h-screen max-w-md mx-auto w-full relative" style={{ display: 'flex' }}>
      <Header
        currentView={currentView}
        selectedFriendEmail={selectedFriendEmail}
        friends={friends}
        user={user}
        searchOpen={searchOpen}
        searchTerm={searchTerm}
        onSearchOpen={openSearch}
        onSearchClose={closeSearch}
        onSearchChange={setSearchTerm}
        onBack={goBack}
        onAccountClick={() => switchView('account')}
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {renderView()}
      </main>

      <BottomNav
        currentView={currentView}
        onSwitchView={switchView}
        onFabClick={handleFabClick}
      />

      {expenseModalOpen && (
        <ExpenseModal
          friends={friends}
          editingExpense={editingExpense}
          prefillFriend={prefillFriend}
          onSubmit={handleExpenseSubmit}
          onClose={() => { setExpenseModalOpen(false); setEditingExpense(null); }}
        />
      )}

      {friendModalOpen && (
        <FriendModal
          onSubmit={handleAddFriend}
          onClose={() => setFriendModalOpen(false)}
        />
      )}

      {settleModalOpen && settleData && (
        <SettleModal
          settleData={settleData}
          user={user}
          onConfirm={handleConfirmSettle}
          onClose={() => { setSettleModalOpen(false); setSettleData(null); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}

