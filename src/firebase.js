import { initializeApp } from "firebase/app";
import { getFirestore , collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDClLmteVwm9TKNEzWrUPTPP0S455J0GUY",
  authDomain: "react-notes-7c116.firebaseapp.com",
  projectId: "react-notes-7c116",
  storageBucket: "react-notes-7c116.appspot.com",
  messagingSenderId: "772894796307",
  appId: "1:772894796307:web:6bc5d7b8f494b3a5a5ade6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")