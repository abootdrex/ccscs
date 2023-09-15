import { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPasswordFirebase(auth,email, password);
      const currentUser = userCredential.user;
      setUser(currentUser);
      setError(null);
      console.log('User signed in with email and password:', currentUser,error);
    } catch (error) {
      console.error('Sign-in error:', error.message);
      setError(error.message);
    }
  };


  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
  };

  const logOut = () => {
      signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('User', currentUser)
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, signInWithEmailAndPassword,logOut, user,error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
