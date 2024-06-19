"use client"

import React, { useState } from 'react';
import { auth } from '../../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import AuthLayout from '@/components/AuthLayout';
import axios from "axios";


const page = () => {
    const [email, setEmail] = useState('');
    const emailData = {
        from: '"Trikecarlan Report System" <carlantrike@gmail.com>',
        to: email,
        subject: 'Hello from Node.js',
        text: 'Hello from Node.js using Nodemailer',
        html: '<h1>Hello from Node.js</h1>',
    }

    const headers = {
        'Content-Type': 'application/json',
    };

    const handleResetPassword = async () => {
        try {
            await axios.post(`/api/sendEmail`, emailData, { headers });
            await sendPasswordResetEmail(auth, email);
            alert("Chnage password link is sent to your email. Please check your inbox or span tab.")
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <AuthLayout>
            <h2>Email User</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button onClick={handleResetPassword}>Reset Password</button>
        </AuthLayout>
    );
};

export default page;
