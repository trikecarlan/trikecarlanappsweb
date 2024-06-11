import { useEffect, useState } from "react";
import { User as FirebaseUser, signOut as firebaseSignOut, browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app, auth } from "../../firebaseConfig";
import { child, get, getDatabase, ref } from "firebase/database";

export async function signIn(email: string, password: string, rememberMe: boolean = false) {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
    return firebaseSignOut(auth);
}
