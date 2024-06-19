"use client"

import React, { useState } from 'react';
import { auth } from '../../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import AuthLayout from '@/components/AuthLayout';
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from 'next/link';

const page = () => {
    const [email, setEmail] = useState('');
    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("sent to you email")
        } catch (error: any) {
            console.log(`Error: ${error.message}`);
        }
    };

    return (
        <AuthLayout>
            <div className='grid justify-center relative items-center w-full h-full'>
                <Link href="/" className='absolute top-10 left-20'>
                    <FaArrowLeftLong size={20} className='text-orange-600'/>
                </Link>
                <div className='w-3/4 grid gap-4 justify-center'>
                    <h2 className='text-xl font-semibold'>Forgot Password</h2>
                    <p className=''>Please enter your email adress to recieve a verification code</p>
                    <input
                        className='border p-2 rounded-lg'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <button className='bg-orange-600 rounded-lg text-white px-4 py-2' onClick={handleResetPassword}>Reset Password</button>
                </div>
            </div>

        </AuthLayout>
    );
};

export default page;
