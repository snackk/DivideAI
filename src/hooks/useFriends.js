import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, APP_ID } from '../firebase';

export function useFriends(user) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!user) return;
    const friendsCol = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'friends');
    const unsub = onSnapshot(friendsCol, (snap) => {
      setFriends(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (error) => console.error(error));
    return unsub;
  }, [user]);

  const addFriend = async (email, customName) => {
    if (!user) return;
    const profileRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'profiles', email.replace(/\./g, '_'));
    const snap = await getDoc(profileRef);

    let friendData = {
      email,
      displayName: customName || email.split('@')[0],
      photoURL: null,
      isGuest: true,
    };

    if (snap.exists()) {
      const data = snap.data();
      friendData.displayName = customName || data.displayName;
      friendData.photoURL = data.photoURL;
      friendData.isGuest = false;
    }

    const myFriendsCol = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'friends');
    await addDoc(myFriendsCol, { ...friendData, addedAt: Date.now() });
  };

  return { friends, addFriend };
}

