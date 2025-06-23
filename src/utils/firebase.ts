import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD9g8XByguwKX_2rChfKTbTc7EG5hoyo4k",
  authDomain: "firstproject-10795.firebaseapp.com",
  databaseURL: "https://firstproject-10795-default-rtdb.firebaseio.com",
  projectId: "firstproject-10795",
  storageBucket: "firstproject-10795.firebasestorage.app",
  messagingSenderId: "117017175443",
  appId: "1:117017175443:web:0a7f334c08a02659f0f466"
  ,

};

   export const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);