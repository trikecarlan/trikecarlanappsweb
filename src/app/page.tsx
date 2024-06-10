"use client";

import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";
import AuthLayout from "@/components/AuthLayout";
import { app, auth } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [togglePassword, settogglePassword] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const dbRef = ref(getDatabase(app));
  const router = useRouter()

  useEffect(() => {
    // Check if user data is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log(storedUser)
      setUser(JSON.parse(storedUser));
      router.push("/main")
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const snapshot = await get(child(dbRef, `/users/${userCredential.user.uid}`));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));  // Persist user data in localStorage
        router.push("/main")
      }
    } catch (error) {
      alert("Failed to login. Please check your email or password")
      // console.error("Login error:", error);
    }
  };

  return (
    <main>
      <AuthLayout>
        <div className="grid w-full h-full justify-center items-center">
          <form onSubmit={handleSignIn} className="grid gap-4 justify-center">
            <h2 className="font-semibold text-xl">Admin Login</h2>
            <div className="relative">
              <IoPersonSharp size={18} className="absolute left-2 top-2" />
              <input
                className="border-2 py-1 border-gray-400 rounded-lg bg-white px-8"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
                value={email}
              />
            </div>
            <div className="relative">
              <RiLockPasswordLine size={18} className="absolute left-2 top-2" />
              <input
                className="border-2 py-1 border-gray-400 rounded-lg bg-white px-8"
                onChange={(e) => setPassword(e.target.value)}
                type={!togglePassword ? "password" : "text"}
                placeholder="Password"
                value={password}
                required
              />
              {!togglePassword ? (
                <GoEyeClosed onClick={() => settogglePassword(!togglePassword)} size={18} className="absolute right-2 top-2" />
              ) : (
                <GoEye onClick={() => settogglePassword(!togglePassword)} size={18} className="absolute right-2 top-2" />
              )}
            </div>
            <div className="w-full flex justify-end">
              <button type="button">Forgot password?</button>
            </div>
            <button type="submit" className="bg-orange-600 text-center text-white rounded-lg py-1">Login</button>
          </form>
        </div>
      </AuthLayout>
    </main>
  );
}
