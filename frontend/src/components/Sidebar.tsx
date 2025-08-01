// src/components/Sidebar.tsx

import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import {
    HomeIcon,
    BuildingOffice2Icon,
    ChartPieIcon,
    CubeIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    ArchiveBoxIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';

const Sidebar = () => {
    const navigate = useNavigate();

    const user = {
        name: "Ramazan Karatut",
        role: "Sistem Yöneticisi"
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // NavLink için stil belirleme fonksiyonu
    // 'isActive' parametresinin tipini açıkça boolean olarak belirtiyoruz.
    const activeLink = ({ isActive }: { isActive: boolean }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`;

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-800 p-6 flex flex-col justify-start border-r border-slate-700 shadow-xl overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10">
                <ArchiveBoxIcon className="h-9 w-9 text-indigo-400" />
                <span className="text-2xl font-bold text-white">Akyapı Depo</span>
            </div>
            
            {/* Kullanıcı Profili */}
            <div className="flex items-center space-x-3 p-4 mb-8 bg-slate-700 rounded-xl shadow-inner">
                <UserCircleIcon className="h-10 w-10 text-slate-400" />
                <div>
                    <h3 className="font-bold text-sm text-white">{user.name}</h3>
                    <p className="text-xs text-slate-400">{user.role}</p>
                </div>
            </div>

            {/* Navigasyon Linkleri */}
            <nav className="space-y-2">
                <NavLink to="/home" className={activeLink}>
                    <HomeIcon className="h-5 w-5" />
                    <span className="font-semibold">Anasayfa</span>
                </NavLink>
                <NavLink to="/depolarim" className={activeLink}>
                    <BuildingOffice2Icon className="h-5 w-5" />
                    <span className="font-semibold">Depolarım</span>
                </NavLink>
                <NavLink to="/raporlar" className={activeLink}>
                    <ChartPieIcon className="h-5 w-5" />
                    <span className="font-semibold">Raporlar</span>
                </NavLink>
                <NavLink to="/acik-depo-ekle" className={activeLink}>
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                    <span className="font-semibold">Açık Depo</span>
                </NavLink>
                
                {/* Çıkış Butonu */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-50 transition-colors duration-200 mt-8"
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span className="font-semibold">Çıkış Yap</span>
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;