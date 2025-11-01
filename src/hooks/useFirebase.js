import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FINAL_CONFIG, INITIAL_AUTH_TOKEN } from '../config/firebase-config';

export function useFirebase() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!FINAL_CONFIG.apiKey) {
      console.error("Firebase API key is missing. Cannot initialize Firebase.");
      setIsReady(true);
      return;
    }

    try {
      const app = initializeApp(FINAL_CONFIG);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);

      setDb(firestore);
      setAuth(authInstance);

      const authenticate = async () => {
        try {
          if (INITIAL_AUTH_TOKEN) {
            await signInWithCustomToken(authInstance, INITIAL_AUTH_TOKEN);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (error) {
          console.error("Firebase authentication failed:", error);
          await signInAnonymously(authInstance);
        }
      };

      authenticate();

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(crypto.randomUUID());
        }
        setIsReady(true);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error initializing Firebase:", e);
      setIsReady(true);
    }
  }, []);

  return { db, auth, userId, isReady };
}