import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDr95DqpKSDEZZhE1mTjLs5H2la2dkJL6A",
    authDomain: "habit-tracker-bf561.firebaseapp.com",
    projectId: "habit-tracker-bf561",
    storageBucket: "habit-tracker-bf561.firebasestorage.app",
    messagingSenderId: "810445703211",
    appId: "1:810445703211:web:eb6af996a3439fea48426e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
