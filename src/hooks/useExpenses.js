import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, APP_ID } from '../firebase';

export function useExpenses(user) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!user) return;
    const globalExpensesCol = collection(db, 'artifacts', APP_ID, 'shared_expenses');
    const q = query(globalExpensesCol, where('involvedUsers', 'array-contains', user.email));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          paidBy: raw.paidByEmail === user.email ? 'me' : 'friend',
          friendId: raw.creatorEmail === user.email ? raw.friendEmail : raw.creatorEmail,
        };
      });
      data.sort((a, b) => b.timestamp - a.timestamp);
      setExpenses(data);
    }, (error) => console.error(error));

    return unsub;
  }, [user]);

  const addExpense = async (data) => {
    const col = collection(db, 'artifacts', APP_ID, 'shared_expenses');
    await addDoc(col, data);
  };

  const updateExpense = async (id, data) => {
    await updateDoc(doc(db, 'artifacts', APP_ID, 'shared_expenses', id), data);
  };

  const removeExpense = async (id) => {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'shared_expenses', id));
  };

  return { expenses, addExpense, updateExpense, removeExpense };
}

