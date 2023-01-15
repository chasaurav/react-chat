import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

export const app = initializeApp({
    apiKey: "AIzaSyDmm-R8cERXsKqOxMK8H0eh6sFgD2b5Mp8",
    authDomain: "react-chat-bc91e.firebaseapp.com",
    projectId: "react-chat-bc91e",
    storageBucket: "react-chat-bc91e.appspot.com",
    messagingSenderId: "284882496524",
    appId: "1:284882496524:web:73b5c0c233e2229a931229"
});

export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();