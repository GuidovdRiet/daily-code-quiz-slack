// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  initializeFirestore,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MID,
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// https://firebase.google.com/docs/web/setup
async function getQuestions(db: Firestore) {
  const questionsCol = collection(db, "questions");
  const questionsSnapshot = await getDocs(questionsCol);
  const quesetionsList = questionsSnapshot.docs.map((doc) => doc.data());
  return quesetionsList;
}

export interface Question {
  answers: string[];
  description: string;
  correctAnswer: string;
  syntax: string;
  title: string;
}

async function createQuestion(db: Firestore, question: Question) {
  const questionsCol = collection(db, "questions");
  const questionSnapshot = await addDoc(questionsCol, question);
  return questionSnapshot;
}

export { db, getQuestions, createQuestion };
