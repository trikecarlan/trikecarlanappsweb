"use client"

import Layout from "@/components/Layout";
import { getDatabase, onValue, ref, set } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { app, auth } from "../../../firebaseConfig";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { createUserWithEmailAndPassword } from "firebase/auth";
import admin from 'firebase-admin';

interface User {
    address: string;
    birthDay?: string;
    email: string;
    firstName: string;
    gender?: string;
    lastName: string;
    phoneNumber: string;
    profile?: {
        url: string;
    };
    role: 'user' | 'driver' | 'superadmin' | 'admin';
    sideCartNumber?: string;
    toda?: string;
    joined?: string;
}

const Reports = () => {
    const database = getDatabase(app);
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [openModal, setopenModal] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLname] = useState('');
    const [address, setAddress] = useState('');
    const [sideCartNumber, setSideCartNumber] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setbirthDay] = useState('');
    const [gender, setgender] = useState('');
    const [toda, setToda] = useState('');

    const userRef = ref(database, 'users/');
    useEffect(() => {
        const fetchUsers = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data);
        });

        return () => {
            fetchUsers();
        };
    }, []);

    const [selectedTab, setSelectedTab] = useState<'Users' | 'Drivers' | 'AdminUsers'>('Users');
    const tabs = {
        Users: Object.entries(users).filter(([key, user]) => user.role === 'user'),
        Drivers: Object.entries(users).filter(([key, user]) => user.role === 'driver'),
        AdminUsers: Object.entries(users).filter(([key, user]) => user.role === 'superadmin' || user.role === 'admin') // Modified filter logic
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                try {
                    await set(ref(database, 'users/' + user.uid), {
                        email: email,
                        firstName: fName,
                        lastName: lName,
                        phoneNumber: phoneNumber,
                        sideCartNumber: sideCartNumber,
                        birthDay: birthday,
                        gender: gender,
                        address: address,
                        role: 'driver',
                        toda: toda
                    });
                } catch (err) {
                    alert("Failed to add user.")
                }
            }

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Layout title="Users">
            <div className="p-4 w-[100%]">
                {openModal &&
                    <div className="absolute top-20 left-0 w-full flex justify-center">
                        <div className="w-1/2 relative bg-gray-200 rounded-lg">
                            <button className="rounded-full absolute -right-2 -top-2 p-1 bg-orange-600" onClick={() => setopenModal(!openModal)}>
                                <IoClose className=" text-white" />
                            </button>
                            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 m-10">
                                <h2 className="text-xl font-semibold">Add User</h2>
                                <input
                                    className="w-3/4 px-2 py-1 border rounded-lg"
                                    placeholder="Side Cart No."
                                    required
                                />
                                <input
                                    className="w-3/4 px-2 py-1 border rounded-lg"
                                    placeholder="Email"
                                    type="email"
                                    required
                                />
                                <button type="submit" className="bg-orange-600 w-3/4 px-4 rounded-lg py-2">Submit</button>
                            </form>
                        </div>
                    </div>
                }
                <div className="flex justify-between">
                    <nav className="flex gap-6">
                        {Object.keys(tabs).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab as 'Users' | 'Drivers' | 'AdminUsers')}
                                className={`${selectedTab === tab ? 'text-orange-600' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                    {selectedTab === 'Drivers' &&
                        <button onClick={() => setopenModal(!openModal)}
                            className="bg-orange-600 flex gap-2 items-center py-1 px-4 rounded-lg text-white">
                            Add
                            <FaPlus />
                        </button>}
                </div>
                {selectedTab === 'AdminUsers' ?
                    <div>
                        {tabs[selectedTab].map(([key, item], index) => (
                            <div className="flex justify-between">
                                <div className="grid justify-center items-center">
                                    <div className="rounded-full overflow-hidden h-20 w-20 object-cover" >
                                        <img className="w-full h-full" src="/1.png" alt={`${index}`} />
                                    </div>
                                </div>
                                <div>
                                    <div>{item.firstName} {item.lastName}</div>
                                    <div>Address: {item.address}</div>
                                    <div>Contact: {item.phoneNumber}</div>
                                    <div className="text-gray-500">joined last {item.joined}</div>
                                </div>
                                <div className="grid justify-center items-center">
                                    <button className="bg-gray-900 px-2 h-max rounded-lg text-white py-1">Edit Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <table className="w-full my-4">
                        <thead>
                            <tr className="bg-gray-200">
                                {selectedTab === 'Drivers' && <th className="border-2 border-gray-300">Cart No.</th>}
                                {selectedTab === 'Users' && <th className="border-2 border-gray-300">ID</th>}
                                <th className="border-2 border-gray-300">Name</th>
                                {selectedTab === 'Drivers' && <th className="border-2 border-gray-300">TODO</th>}
                                <th className="border-2 border-gray-300">Number</th>
                                <th className="border-2 border-gray-300">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabs[selectedTab].map(([key, item], index) => (
                                <tr key={index} className={index % 2 === 1 ? "bg-gray-300" : ""}>
                                    {selectedTab === 'Drivers' && <td className="border-2 text-center">{item.sideCartNumber}</td>}
                                    {selectedTab === 'Users' && <td className="border-2 text-center">{key.slice(20)}</td>}
                                    <td className="border-2 text-center">{item.firstName + ' ' + item.lastName}</td>
                                    {selectedTab === 'Drivers' && <td className="border-2 text-center">{item.toda}</td>}
                                    <td className="border-2 text-center">{item.phoneNumber}</td>
                                    <td className="border-2 text-center">{item.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
            </div>
        </Layout>
    );
}

export default Reports;
