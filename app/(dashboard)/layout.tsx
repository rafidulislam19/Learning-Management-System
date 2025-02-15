import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return ( 
        <div className="h-full">
            <div className="h-[75px] fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="pt-[75px] h-full">
              {children}
            </main>
            
        </div>
     );
}
 
export default DashboardLayout;