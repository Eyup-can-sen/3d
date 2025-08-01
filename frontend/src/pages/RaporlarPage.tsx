import React from 'react';
import { Link } from "react-router-dom";

// Heroicons'tan modern ikonları içe aktarıyoruz
import {
    ArrowUturnLeftIcon,
    ArchiveBoxIcon,
    ExclamationCircleIcon,
    BuildingOffice2Icon,
    DocumentChartBarIcon,
    ClockIcon,
    ArrowPathIcon,
    ArrowUpOnSquareStackIcon,
    CalendarDaysIcon, // Tarihi yaklaşan ürünler için yeni ikon
} from '@heroicons/react/24/solid';

// Veri simülasyonu (Gerçek bir projede API'den gelecektir)
const reportsData = {
    totalWarehouses: 5,
    totalProducts: 250,
    lowStockItems: 12,
    lastUpdate: '2025-08-01 10:30',
    warehouseDistribution: [
        { name: 'Merkez Depo', count: 120, status: 'Normal' },
        { name: 'Şube Depo A', count: 65, status: 'Normal' },
        { name: 'Şube Depo B', count: 40, status: 'Normal' },
        { name: 'Geçici Depo', count: 18, status: 'Düşük Stok' },
        { name: 'İade Deposu', count: 7, status: 'Normal' },
    ],
    lowStockProducts: [
        { id: 'SKU-001', name: 'M8 Somun', location: 'Merkez Depo / Raf A1', quantity: 5 },
        { id: 'SKU-015', name: '100mm Çelik Vida', location: 'Şube Depo B / Raf C3', quantity: 8 },
        { id: 'SKU-022', name: 'Kablo Makarası', location: 'Geçici Depo / Zemin 5', quantity: 2 },
    ],
    expiringProducts: [
        { id: 'EXP-123', name: 'Koruyucu Sprey (300ml)', location: 'Merkez Depo / Raf B2', expiryDate: '2025-09-15' },
        { id: 'EXP-456', name: 'Özel Yapıştırıcı', location: 'Şube Depo A / Raf D4', expiryDate: '2025-10-01' },
        { id: 'EXP-789', name: 'Temizleme Solüsyonu (1L)', location: 'Merkez Depo / Raf F7', expiryDate: '2025-10-10' },
    ]
};

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-slate-900 p-8 md:p-12 text-white font-sans">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
                <div className="mb-8 md:mb-0">
                    <h1 className="text-5xl font-extrabold text-white tracking-tight">Raporlar</h1>
                    <p className="mt-3 text-lg text-slate-400">Depo ve envanterinize dair detaylı raporlar ve analizler.</p>
                </div>
                
                <div className="flex flex-wrap gap-4 md:space-x-4">
                    {/* Geri Dön Butonu */}
                    <Link
                        to="/home"
                        className="px-6 py-3 bg-slate-700 text-slate-200 font-semibold border-2 border-slate-600 rounded-full shadow-lg shadow-slate-950/50 hover:bg-slate-600 transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>Panele Geri Dön</span>
                    </Link>
                    {/* Rapor İndir Butonu */}
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                        <ArrowUpOnSquareStackIcon className="h-5 w-5" />
                        <span>Raporu İndir</span>
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Genel Durum Kartı */}
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 border border-slate-700 lg:col-span-1">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Genel Durum</h2>
                        
                        {/* Toplam Depo Sayısı */}
                        <div className="mb-6 flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <BuildingOffice2Icon className="h-7 w-7 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Toplam Depo Sayısı</p>
                                <p className="text-4xl font-bold text-indigo-400">{reportsData.totalWarehouses}</p>
                            </div>
                        </div>
                        
                        {/* Toplam Ürün Çeşitliliği */}
                        <div className="mb-6 flex items-center space-x-4">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <ArchiveBoxIcon className="h-7 w-7 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Toplam Ürün Çeşitliliği</p>
                                <p className="text-4xl font-bold text-green-400">{reportsData.totalProducts}</p>
                            </div>
                        </div>
                        
                        {/* Düşük Stoklu Ürünler */}
                        <div className="mb-6 flex items-center space-x-4">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <ExclamationCircleIcon className="h-7 w-7 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Düşük Stoklu Ürünler</p>
                                <p className="text-4xl font-bold text-red-400">{reportsData.lowStockItems}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center text-sm text-slate-500">
                        <ClockIcon className="h-5 w-5 mr-2" />
                        <span>Son Güncelleme: {reportsData.lastUpdate}</span>
                        <button className="ml-auto flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                           <ArrowPathIcon className="h-4 w-4 mr-1" />
                           Yenile
                        </button>
                    </div>
                </div>

                {/* Depo Bazlı Ürün Dağılımı Tablosu */}
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 border border-slate-700 lg:col-span-2">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                        <DocumentChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
                        Depo Bazlı Ürün Dağılımı
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Depo Adı
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Toplam Ürün Sayısı
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Durum
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                {reportsData.warehouseDistribution.map((warehouse, index) => (
                                    <tr key={index} className="hover:bg-slate-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{warehouse.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{warehouse.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${warehouse.status === 'Düşük Stok' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {warehouse.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Düşük Stoklu Ürünler Tablosu */}
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 border border-slate-700 lg:col-span-3">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                        <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                        Düşük Stoklu Ürünler
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Ürün Kodu
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Ürün Adı
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Konum
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Miktar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                {reportsData.lowStockProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-slate-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{product.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400">
                                                {product.quantity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Tarihi Yaklaşan Ürünler Tablosu (Yeni) */}
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 border border-slate-700 lg:col-span-3">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                        <CalendarDaysIcon className="h-8 w-8 text-yellow-500 mr-3" />
                        Tarihi Yaklaşan Ürünler
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Ürün Kodu
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Ürün Adı
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Konum
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Son Kullanma Tarihi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                {reportsData.expiringProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-slate-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{product.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                                                {product.expiryDate}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}