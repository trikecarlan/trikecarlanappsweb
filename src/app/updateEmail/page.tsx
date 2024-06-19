"use client"

import React, { useEffect, useState } from 'react';
import { app, auth } from '../../../firebaseConfig';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import AuthLayout from '@/components/AuthLayout';
import { signIn } from '@/lib/auth';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GoEye, GoEyeClosed } from 'react-icons/go';

const Page = () => {
    const [oldEmail, setOldEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [togglePassword, settogglePassword] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignIn()
        try {
            const auth = await getAuth(app);
            const user: any = auth.currentUser;

            const credential = EmailAuthProvider.credential(oldEmail, password);
            await reauthenticateWithCredential(user, credential);

            await updateEmail(user, newEmail);

            alert("Email updated successfully!");
        } catch (error) {
            console.log(error);
            alert("Failed to update email. Please check your credentials and try again.");
        }
    };

    const handleSignIn = async () => {
        try {
            const loggedIn = await signIn(oldEmail, password);
            if (loggedIn) {
            }
        } catch (error) {
            alert("Failed to authenticate");
        }
    };

    return (
        <AuthLayout>
            <div className='grid w-full h-full items-center justify-center'>
                <div className='grid gap-2 justify-center p-10 border rounded-lg '>
                    <h2 className='text-xl text-center font-semibold'>Update Email</h2>
                    <form className='grid gap-2' onSubmit={onSubmit}>
                        <input
                            className='border rounded-lg p-2'
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter your new email"
                            required
                        />
                        <input
                            className='border rounded-lg p-2'
                            type="email"
                            value={oldEmail}
                            onChange={(e) => setOldEmail(e.target.value)}
                            placeholder="Enter your old email"
                            required
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
                                <GoEyeClosed onClick={() => settogglePassword(!togglePassword)} size={18} className="absolute right-2 top-2" />
                            ) : (
                                <GoEye onClick={() => settogglePassword(!togglePassword)} size={18} className="absolute right-2 top-2" />
                            )}
                        </div>

                        <button className='bg-orange-600 w-full rounded-lg py-2 text-white' type='submit'>Update Email</button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Page;
