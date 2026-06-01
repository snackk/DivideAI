export function calculateFriendBalance(expenses, friendEmail, currentUserEmail) {
  let bal = 0;
  expenses.forEach((e) => {
    if (e.involvedUsers && e.involvedUsers.includes(friendEmail)) {
      const share = e.splitType === 'equal' ? e.amount / 2 : e.amount;
      if (e.paidByEmail === currentUserEmail) {
        bal += share;
      } else {
        bal -= share;
      }
    }
  });
  return bal;
}

