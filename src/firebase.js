import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import "firebase/database";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAilauIj9O597BY4S6BI8bfP5z3LC4Pu90",
  authDomain: "frendzit-a0ec6.firebaseapp.com",
  databaseURL: "https://frendzit-a0ec6.firebaseio.com",
  projectId: "frendzit-a0ec6",
  storageBucket: "frendzit-a0ec6.appspot.com",
  messagingSenderId: "645527780923",
  appId: "1:645527780923:web:a38d5d455533bf55b2661e",
  measurementId: "G-M4SMH95PJZ",
});
const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebase.database();

export { db, auth, database, storage, provider };
