import firebase from 'firebase/app';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyABhXJlEEoLcl9DBmeIUt5n4ILMWlInThM",
    authDomain: "todolist-3b34a.firebaseapp.com",
    databaseURL: "https://todolist-3b34a.firebaseio.com",
    projectId: "todolist-3b34a",
    storageBucket: "todolist-3b34a.appspot.com",
    messagingSenderId: "642063926834",
    appId: "1:642063926834:web:6aa0b8bbe5d7574df09e2b"
};

firebase.initializeApp(firebaseConfig);

export function loginWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
        .then(snap => snap.user)
}


export function signOutGoogle(){
    firebase.auth().signOut();
}