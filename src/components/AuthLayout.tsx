import Image from "next/image"
import { useRouter } from "next/router";


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">
            <div className="w-3/5">
                {children}
            </div>
            <div className="w-2/5 grid justify-center items-center bg-[#F2722B]">
                <Image height={200} width={200} src="/icon.png" alt="logo" />
            </div>
        </div>
    )
}
export default AuthLayout