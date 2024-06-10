// firebaseConfig.ts
import { getApps, initializeApp, FirebaseApp, getApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu28mO7ELCQyaHcpbs7WuYbwAmGrn8u2c",
  authDomain: "trikecarlanapps.firebaseapp.com",
  projectId: "trikecarlanapps",
  messagingSenderId: "306794740191",
  appId: "1:306794740191:web:234a605793d88a8919ec6a",
  databaseURL: "https://trikecarlanapps-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "gs://trikecarlanapps.appspot.com"
};

// Initialize Firebase
let app: FirebaseApp, auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app);
} else {
  app = getApp();
  auth = getAuth(app);
}

export { app, auth };
