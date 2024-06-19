"use client"

import React, { useState } from 'react';
import { app, auth } from '../../../firebaseConfig';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import AuthLayout from '@/components/AuthLayout';
import axios from "axios";
import { signIn } from '@/lib/auth';
import { GoEye, GoEyeClosed } from 'react-icons/go';


const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [togglePassword, settogglePassword] = useState<boolean>(false);

    const handleResetPassword = async () => {
        await handleSignIn()
        try {
            const auth = await getAuth(app);
            await sendPasswordResetEmail(auth, email);
            alert("sent to you email")
        } catch (error: any) {
            console.log(`Error: ${error.message}`);
        }
    };

    const handleSignIn = async () => {
        try {
            await signIn(email, password);
        } catch (error) {
            alert("Failed to update email. Please check your credentials and try again.");
        }
    };


    return (
        <AuthLayout>
            <div className='grid justify-center items-center w-full h-full'>
                <div className='rounded-lg border p-10 grid gap-2 justify-center'>
                    <h2 className='text-xl font-semibold text-center'>Change Password</h2>
                    <input
                        className='border p-2 rounded-lg'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <div className="relative">
                        <input
                            className="border rounded-lg p-2"
                            onChange={(e) => setPassword(e.target.value)}
                            type={!togglePassword ? "password" : "text"}
                            placeholder="Password"
                            value={password}
                            required
                        />
                        {!togglePassword ? (
                            <GoEyeClosed onClick={() => settogglePassword(!togglePassword)} size={18} className="absolute right-2 top-3" />
                        ) : (
                            <GoEye onClick={() => settogglePassword(!togglePassword)} size={18} className="absolute right-2 top-3" />
                        )}
                    </div>
                    <button className='bg-orange-600 rounded-lg px-4 py-2' onClick={handleResetPassword}>Reset Password</button>
                </div>
            </div>

        </AuthLayout>
    );
};

export default page;
