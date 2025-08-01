import React from 'react';
import { Warehouse } from '../types';
import { formatArea, getStatusColor, getStatusText, getTypeText, formatDate } from '../utils';

// Heroicons'tan modern ikonları içe aktarıyoruz
import { PlusIcon, ArrowPathIcon, BuildingOffice2Icon, CubeTransparentIcon, CheckCircleIcon, ChartBarSquareIcon } from '@heroicons/react/24/solid';

interface WarehouseListProps {
  warehouses: Warehouse[];
  loading: boolean;
  error: string;
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onAddWarehouse: () => void;
  onRefresh: () => void;
}

export const WarehouseList: React.FC<WarehouseListProps> = ({
  warehouses,
  loading,
  error,
  onWarehouseSelect,
  onAddWarehouse,
  onRefresh
}) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
          <p className="text-2xl font-semibold text-gray-300">Depolar yükleniyor...</p>
          <p className="text-md text-gray-400 mt-2">Veritabanından veriler çekiliyor.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md p-10 bg-slate-800 rounded-3xl shadow-2xl shadow-red-500/20">
          <div className="text-red-500 text-8xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Bir Hata Oluştu</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-red-600 text-white px-10 py-4 rounded-full hover:bg-red-700 transition-all transform hover:scale-110 font-bold tracking-wide"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div className="bg-slate-900 shadow-xl shadow-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white">Depo Yönetimi</h1>
            <p className="text-slate-400 mt-3 text-lg">Veritabanından çekilen depolarınızı kolayca yönetin.</p>
          </div>
          
          <div className="flex space-x-4 mt-6 md:mt-0">
            <button
              onClick={onRefresh}
              className="bg-slate-700 text-slate-200 px-6 py-3 rounded-full hover:bg-slate-600 transition-all transform hover:-translate-y-1 flex items-center space-x-2 font-medium shadow-lg shadow-slate-900/50"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Yenile</span>
            </button>
            
            <button
              onClick={onAddWarehouse}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2 font-bold shadow-lg shadow-blue-500/20"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Depo Ekle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 flex items-center transition-all transform hover:scale-105 hover:shadow-blue-500/20">
            <div className="p-4 bg-blue-500/10 rounded-2xl">
              <BuildingOffice2Icon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-6">
              <p className="text-md font-medium text-slate-400">Toplam Depo</p>
              <p className="text-4xl font-extrabold text-white mt-1">{warehouses.length}</p>
            </div>
          </div>
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 flex items-center transition-all transform hover:scale-105 hover:shadow-green-500/20">
            <div className="p-4 bg-green-500/10 rounded-2xl">
              <CubeTransparentIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-6">
              <p className="text-md font-medium text-slate-400">Toplam Kapasite</p>
              <p className="text-4xl font-extrabold text-white mt-1">
                {warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 flex items-center transition-all transform hover:scale-105 hover:shadow-yellow-500/20">
            <div className="p-4 bg-yellow-500/10 rounded-2xl">
              <CheckCircleIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-6">
              <p className="text-md font-medium text-slate-400">Aktif Depo</p>
              <p className="text-4xl font-extrabold text-white mt-1">
                {warehouses.filter(w => w.status === 'active').length}
              </p>
            </div>
          </div>
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 flex items-center transition-all transform hover:scale-105 hover:shadow-purple-500/20">
            <div className="p-4 bg-purple-500/10 rounded-2xl">
              <ChartBarSquareIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-6">
              <p className="text-md font-medium text-slate-400">Toplam Alan</p>
              <p className="text-4xl font-extrabold text-white mt-1">
                {formatArea(warehouses.reduce((sum, w) => sum + w.area, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Depo Listesi */}
        {warehouses.length === 0 ? (
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-20 text-center">
            <div className="mb-6 text-slate-600">
              <BuildingOffice2Icon className="h-28 w-28 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Henüz depo bulunmuyor</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Veritabanında kayıtlı depo bulunamadı. İlk deponuzu ekleyerek yönetmeye başlayın.</p>
            <button
              onClick={onAddWarehouse}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-bold shadow-lg shadow-blue-500/20"
            >
              İlk Depoyu Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="bg-slate-800 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col" // flexbox ekledik
              >
                <div className="p-8 flex-grow"> {/* flex-grow ile içeriğin olabildiğince yer kaplamasını sağladık */}
                  {/* Başlık ve Durum */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {warehouse.name}
                      </h3>
                      <p className="text-md text-slate-400">📍 {warehouse.location}</p>
                    </div>
                    <span className={`px-4 py-1 text-sm font-semibold rounded-full border ${getStatusColor(warehouse.status)}`}>
                      {getStatusText(warehouse.status)}
                    </span>
                  </div>

                  {/* Açıklama */}
                  <p className="text-slate-400 mb-6 line-clamp-2 min-h-[3rem]"> {/* min-h ekledik */}
                    {warehouse.description}
                  </p>

                  {/* İstatistikler */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">{formatArea(warehouse.area)}</div>
                      <div className="text-xs text-slate-400 mt-1">Alan</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">{warehouse.capacity.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">Kapasite</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">{warehouse.height}m</div>
                      <div className="text-xs text-slate-400 mt-1">Yükseklik</div>
                    </div>
                  </div>

                  {/* Tarih ve Tip */}
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-6">
                    <span>Oluşturulma: {formatDate(warehouse.createdAt)}</span>
                    <span className="font-semibold text-indigo-400">{getTypeText(warehouse.type)}</span>
                  </div>
                </div>

                {/* Buton - P-8 div'inin dışında, flexbox'ın en altında */}
                <div className="p-8 pt-0"> {/* padding-top'u sıfırladık */}
                  <button
                    onClick={() => onWarehouseSelect(warehouse)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all text-lg font-bold shadow-lg shadow-blue-500/20 transform hover:scale-105"
                  >
                    Yönet & 3D Görünüm
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};