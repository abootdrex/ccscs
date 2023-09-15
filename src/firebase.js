
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signOut, updateProfile} from "firebase/auth";
import { useState, useEffect } from "react";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDBnfbzUnUNk2FUYqnVWBVWDOuJ-IUUMZY",
  authDomain: "evolution-x-a2881.firebaseapp.com",
  projectId: "evolution-x-a2881",
  storageBucket: "gs://evolution-x-a2881.appspot.com",
  messagingSenderId: "254193344202",
  appId: "1:254193344202:web:9f755acca4d36e9e9fde33",
  measurementId: "G-4MXXL1P67S"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const  database  = getFirestore(app);
export const storage = getStorage(app);

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}

export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + '.png');

  setLoading(true);
  
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, {photoURL});
  
  setLoading(false);
  alert("Profile picture updtated plese reload page");
}