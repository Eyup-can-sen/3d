// src/components/MainLayout.tsx

import React from 'react';
import Sidebar from './Sidebar'; 
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;