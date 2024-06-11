"use client"
import { child, get, getDatabase, onValue, ref } from "firebase/database";
import Link from "next/link"
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosNotificationsOutline } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { app, auth } from "../../firebaseConfig";

interface ILayout {
    children: React.ReactNode;
    title: string;
}

const Layout = ({ children, title }: ILayout) => {
    const pathName = usePathname()
    const dbRef = ref(getDatabase(app));
    const router = useRouter()
    const [user, setUser] = useState<any>()

    const seeIfLogedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            getOnce(user.uid)
        } else {
            router.push("/")
        }
    });

    useEffect(() => {
        seeIfLogedIn()
    }, [])

    const getOnce = (uid: string) => get(child(dbRef, `users/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            setUser(snapshot.val())
        }
    }).catch((error) => {
        console.log(error);
    });


    return (
        <>
            <div className="flex h-screen">
                <div className="bg-[#F2722B] w-1/6 flex flex-col gap-4 items-center justify-start">
                    <div className="h-28 w-full flex items-center mt-4 justify-center">
                        <Image className="rounded-full" height={100} width={100} src={"/favicon.ico"} alt="logo" />
                    </div>
                    <div className="grid justify-start gap-4">
                        <Link className={`${pathName === "/main" ? "border-b-2 border-b-gray-50 w-max" : ""} text-xl text-gray-50`} href="/main">
                            Dashboard
                        </Link>
                        <Link className={`${pathName === "/reports" ? "border-b-2 border-b-gray-50 w-max" : ""} text-xl text-gray-50`} href="/reports">
                            Reports
                        </Link>
                        <Link className={`${pathName === "/users" ? "border-b-2 border-b-gray-50 w-max" : ""} text-xl text-gray-50`} href="/users">
                            Users
                        </Link>
                        <Link className={`${pathName === "/analytics" ? "border-b-2 border-b-gray-50 w-max" : ""} text-xl text-gray-50`} href="/analytics">
                            Analytics
                        </Link>
                        <button className={`text-xl text-start text-gray-50`} onClick={signOut}>
                            Logout
                        </button>
                    </div>
                </div>
                <div className="w-5/6 flex flex-col">
                    <nav className="flex border-b-2 p-4 w-[100%] border-b-gray-300 justify-between">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <div className="flex gap-8">
                            <IoIosNotificationsOutline size={25} />
                            {user && <p className="text-nowrap">{user?.firstName} {user?.lastName} &#40;{user?.role}&#41;</p>}
                        </div>
                    </nav>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;
