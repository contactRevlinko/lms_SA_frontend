import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

const SuperAdminLayout = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const token = localStorage.getItem("superAdminToken");

    if (!token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="h-screen w-full overflow-hidden bg-slate-50 flex">

        
            {showSideBar && (
                <div
                    onClick={() => setShowSideBar(false)}
                    className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden"
                />
            )}

          
            <SuperAdminSidebar
                showSideBar={showSideBar}
                handleSideBar={() => setShowSideBar((p) => !p)}
            />

         
            <div className="flex flex-col flex-1 h-screen overflow-hidden lg:ml-72">

           
                <SuperAdminTopbar handleSideBar={() => setShowSideBar((p) => !p)} />

              
                <main className="flex-1 overflow-y-auto pt-24 px-5 pb-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default SuperAdminLayout;