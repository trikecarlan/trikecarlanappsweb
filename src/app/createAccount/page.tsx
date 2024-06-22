"use client"

import React, { useState } from 'react';
import { app, auth } from '../../../firebaseConfig';
import { UserCredential, createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AuthLayout from '@/components/AuthLayout';
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { getFormattedDate } from '@/lib/getDateNow';

const page = () => {
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLname] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setbirthDay] = useState('');
    const [gender, setgender] = useState('');

    const database = getDatabase(app);
    const router = useRouter();

    async function signUp() {
        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await set(ref(database, 'users/' + uid), {
                email: email,
                firstName: fName,
                lastName: lName,
                phoneNumber: phoneNumber,
                birthDay: birthday,
                gender: gender,
                address: address,
                role: 'admin',
                uid: uid,
                joined: getFormattedDate()
            });
            const testUserCredential = await signInWithEmailAndPassword(auth, email, password);
            if (testUserCredential) {
                router.push("/main");
            }
        } catch (error) {
            alert('Email is already in use. Please use a different email.');
        }
    }

    return (
        <AuthLayout>
            <div className="flex justify-center items-center w-full h-full p-6">
                <div className="w-full grid justify-center max-w-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
                    <form className='grid justify-center gap-4' onSubmit={(e) => { e.preventDefault(); signUp(); }}>



                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            placeholder='phone number'
                        />

                        <input
                            type="text"
                            value={fName}
                            onChange={(e) => setFName(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            placeholder='First Name'
                        />

                        <input
                            type="text"
                            value={lName}
                            onChange={(e) => setLname(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            placeholder='Last Name'
                        />


                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            placeholder='Address'
                        />


                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setbirthDay(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            placeholder='Date'
                        />


                        <select
                            value={gender}
                            onChange={(e) => setgender(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            required
                            placeholder='Email'
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                            required
                            placeholder='Password'
                        />

                        <button
                            type="submit"
                            className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-700"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default page;
