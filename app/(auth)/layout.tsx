import { ArrowLeft } from "lucide-react";
import Link from "next/link"

const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (   
        <div className="h-full flex flex-col md:flex md:flex-row items-center md:items-center justify-center md:justify-evenly">
            <Link href="/" className="flex items-center text-lg hover:opacity-75 transition mb-6">
            <ArrowLeft className="h-6 w-6 mr-2" />
               Back to home
            </Link>
            {children}
        </div>
     );
}
 
export default AuthLayout;