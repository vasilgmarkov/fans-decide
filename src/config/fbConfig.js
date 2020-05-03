import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzgPaigHjn46lRKr6za5TAExf-SFj2BCI",
  authDomain: "fans-decide.firebaseapp.com",
  databaseURL: "https://fans-decide.firebaseio.com",
  projectId: "fans-decide",
  storageBucket: "fans-decide.appspot.com",
  messagingSenderId: "219234268556",
  appId: "1:219234268556:web:fc8282d9a093b2d5e912a9"
};

//Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
  firebase.auth();
  firebase.storage();
  console.log("Firebase Initialized");
} catch (err) {
  console.log("Error Initializing Firebase");
}

export default firebase;
