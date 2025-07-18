import { Outlet } from "react-router-dom";
import SideBar from "../components/Administrateur/SideBar";


function AdminLayout(){
    return (
        <div className='flex h-screen w-full bg-gradient-to-br from-[#0f172a] 
        via-[#1e293b] to-[#0f172a] text-white overflow-hidden'>

            <SideBar />

            <main className='flex-1 p-8 overflow-y-auto relative z-10'>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout