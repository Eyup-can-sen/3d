import React from 'react';
import { Link } from "react-router-dom";

// Heroicons'tan modern ikonları içe aktarıyoruz
import {
  ArrowTrendingUpIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  CubeIcon,
  ChartPieIcon,
  ArrowRightIcon,
  PlusIcon,
  CalendarDaysIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  TruckIcon 
} from '@heroicons/react/24/solid';

export const Dashboard = () => {
  // Simülasyon verisi (Gerçek bir projede API'den gelecektir)
  const dashboardData = {
    totalWarehouses: 5,
    totalProducts: 250,
    lowStockItems: 12,
    expiringItems: 8
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 md:p-12 text-white font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
        <div className="mb-8 md:mb-0">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Hoş Geldiniz!</h1>
          <p className="mt-3 text-lg text-slate-400">Depo yönetim sisteminize genel bakış.</p>
        </div>

        <div className="flex flex-wrap gap-4 md:space-x-4">
          <Link
            to="/depolarim"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <BuildingOffice2Icon className="h-5 w-5" />
            <span>Depolarım</span>
          </Link>
          <Link
            to="/depo-ekle"
            className="px-6 py-3 bg-slate-700 text-slate-200 font-semibold border-2 border-slate-600 rounded-full shadow-lg shadow-slate-950/50 hover:bg-slate-600 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Depo Ekle</span>
          </Link>
          <Link
            to="/acik-depo-ekle"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full shadow-lg shadow-green-500/20 hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <ArrowTrendingUpIcon className="h-5 w-5" />
            <span>Açık Depo Yönetimi</span>
          </Link>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sistem Tanıtım Kartı (Güncellendi) */}
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-4">Depo Yönetim Sistemine Giriş</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Akyapı 3D Depo Yönetimi, depo süreçlerinizi basitleştirerek ve optimize ederek işletmenizin verimliliğini artırmak için tasarlandı. Anlık stok takibi, detaylı raporlama ve 3 boyutlu görselleştirme gibi özelliklerle iş akışınızı dijitalleştirin. Bu modern ve güçlü araçla operasyonel verimliliğinizi en üst düzeye çıkarın.
          </p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-slate-400">
              <CheckCircleIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Anlık</span> stok takibi ve envanter yönetimi sayesinde, ürünlerinizin giriş-çıkış hareketlerini anında izleyebilir, her an güncel bilgilere ulaşabilirsiniz.
              </div>
            </li>
            <li className="flex items-center text-slate-400">
              <CameraIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">3D</span> depo görselleştirme özelliği ile depolarınızı sanal ortamda gezebilir, ürün yerleşimini en verimli şekilde planlayabilirsiniz.
              </div>
            </li>
            <li className="flex items-center text-slate-400">
              <CubeIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Kolayca</span> depo ve ürün ekleme imkanı, operasyonel yükünüzü hafifleterek yeni ürünleri veya depoları sisteme hızlıca entegre etmenizi sağlar.
              </div>
            </li>
            <li className="flex items-center text-slate-400">
              <MagnifyingGlassIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Hızlı</span> arama ve filtreleme özellikleri ile binlerce ürün arasından aradığınızı saniyeler içinde bulabilir, zamandan tasarruf edebilirsiniz.
              </div>
            </li>
            <li className="flex items-center text-slate-400">
              <ChartPieIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Detaylı</span> raporlama ve analizler sayesinde depo performansınızı ölçebilir, geleceğe yönelik stratejik kararlar alabilirsiniz.
              </div>
            </li>
            <li className="flex items-center text-slate-400">
              <TruckIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Sevkiyat</span> ve sipariş yönetimi entegrasyonları ile tedarik zincirinizin tüm aşamalarını tek bir platformdan yönetin.
              </div>
            </li>
          </ul>

          <Link
            to="/hakkimizda"
            className="inline-flex items-center justify-center py-3 px-8 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <span className="mr-3">Sistemin Özelliklerini Keşfet</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        {/* Depo İstatistikleri (Dinamik) - Güncellendi */}
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 border border-slate-700">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Genel Durum</h2>

            {/* Toplam Depo Sayısı */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <BuildingOffice2Icon className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Toplam Depo Sayısı</p>
                <p className="text-4xl font-bold text-indigo-400">{dashboardData.totalWarehouses}</p>
              </div>
            </div>

            {/* Toplam Ürün Çeşitliliği */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <ArchiveBoxIcon className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Toplam Ürün Çeşitliliği</p>
                <p className="text-4xl font-bold text-green-400">{dashboardData.totalProducts}</p>
              </div>
            </div>

            {/* Düşük Stoklu Ürünler */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <ExclamationCircleIcon className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Düşük Stoklu Ürünler</p>
                <p className="text-4xl font-bold text-red-400">{dashboardData.lowStockItems}</p>
              </div>
            </div>

            {/* Teslim Tarihi Yaklaşan Ürünler (Yeni) */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <CalendarDaysIcon className="h-7 w-7 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Tarihi Yaklaşan Ürünler</p>
                <p className="text-4xl font-bold text-yellow-400">{dashboardData.expiringItems}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link
              to="/raporlar"
              className="w-full text-center block px-6 py-4 bg-slate-700 text-slate-200 font-semibold rounded-full hover:bg-slate-600 transition-colors duration-300 shadow-md"
            >
              Detaylı Raporlara Git
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;