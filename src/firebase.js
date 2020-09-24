import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA5UC9Qd-sQbXcz3Ilxhp5wdJ524DbfKI8",
    authDomain: "instagram-clone-db07e.firebaseapp.com",
    databaseURL: "https://instagram-clone-db07e.firebaseio.com",
    projectId: "instagram-clone-db07e",
    storageBucket: "instagram-clone-db07e.appspot.com",
    messagingSenderId: "660955001595",
    appId: "1:660955001595:web:43f40f57a3fd782586b65e",
    measurementId: "G-CH9QGLB5KS"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };