import firebase from 'firebase'
import 'firebase/firebase-analytics'
import 'firebase/firebase-auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyCT6UcJ1fSROa6XrtINMkdxatAgSt5LU_s",
  authDomain: "huong-min-hoho.firebaseapp.com",
  databaseURL: "https://huong-min-hoho-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "huong-min-hoho",
  storageBucket: "huong-min-hoho.appspot.com",
  messagingSenderId: "316009393400",
  appId: "1:316009393400:web:3f95e2e0595156060b5f0d",
  measurementId: "G-69J2PN8Y5Z"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();
require('firebase/app');

// if (window.location.hostname === 'localhost') {
//     auth.useEmulator('http://localhost:9099');
//     db.useEmulator('localhost', '8080');
// }


export {
    auth,
    db
};
export default firebase;
