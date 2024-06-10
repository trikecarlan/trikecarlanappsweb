"use client"

import React, { useState } from 'react';
import { auth } from '../../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const page = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset link has been sent to your email.');
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            <p>{message}</p>
        </div>
    );
};

export default page;
