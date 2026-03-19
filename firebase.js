// 🔥 Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuyKPFIBfnf5TxHz26QaUtsmkY0IOQoec",
  authDomain: "recipes-app-c205b.firebaseapp.com",
  projectId: "recipes-app-c205b",
  storageBucket: "recipes-app-c205b.firebasestorage.app",
  messagingSenderId: "474674933062",
  appId: "1:474674933062:web:a39343df08dc3445c24947",
  measurementId: "G-QQTPRYGKZH"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);