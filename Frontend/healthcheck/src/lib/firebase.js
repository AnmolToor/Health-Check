import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCOtUmY92DW4yrLRE_e1HuiTIZJVXEIfM8",
    authDomain: "health-check-d92ed.firebaseapp.com",
    projectId: "health-check-d92ed",
    storageBucket: "health-check-d92ed.appspot.com",
    messagingSenderId: "836655853190",
    appId: "1:836655853190:web:549e65450f19c0d82aab07"
};

const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;
const storage = getStorage(firebase)

export { firebase, FieldValue, storage };
