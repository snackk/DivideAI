import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithCustomToken, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, APP_ID } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await saveProfile(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveProfile = async (u) => {
    if (!u || !u.email) return;
    try {
      const profileRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'profiles', u.email.replace(/\./g, '_'));
      await setDoc(profileRef, {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (err) {
      console.error('Profile sync error:', err);
    }
  };

  const login = async () => {
    try {
      if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
        await signInWithCustomToken(auth, window.__initial_auth_token);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return { user, loading, login, logout };
}

