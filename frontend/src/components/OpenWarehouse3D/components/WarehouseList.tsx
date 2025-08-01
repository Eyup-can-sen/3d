
import React from 'react';
import { Warehouse } from '../types';
import { formatArea, getStatusColor, getStatusText, getTypeText, formatDate } from '../utils';

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
  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Depolar yükleniyor...</p>
          <p className="text-sm text-gray-500 mt-2">Veritabanından veriler çekiliyor</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Açık Depo Yönetimi</h1>
              <p className="text-gray-600 mt-2">Veritabanından çekilen depolarınızı yönetin</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onRefresh}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Yenile</span>
              </button>
              
              <button
                onClick={onAddWarehouse}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
              >
                <span>+</span>
                <span>Depo Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏭</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Depo</p>
                <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kapasite</p>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Depo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouses.filter(w => w.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📏</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Alan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatArea(warehouses.reduce((sum, w) => sum + w.area, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Depo Listesi */}
        {warehouses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🏭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz depo bulunmuyor</h3>
            <p className="text-gray-600 mb-6">Veritabanında kayıtlı depo bulunamadı. İlk deponuzu ekleyin.</p>
            <button
              onClick={onAddWarehouse}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Depoyu Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  {/* Başlık ve Durum */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {warehouse.name}
                      </h3>
                      <p className="text-sm text-gray-600">📍 {warehouse.location}</p>
                      <p className="text-xs text-blue-600 mt-1">{getTypeText(warehouse.type)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(warehouse.status)}`}>
                      {getStatusText(warehouse.status)}
                    </span>
                  </div>

                  {/* Açıklama */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {warehouse.description}
                  </p>

                  {/* İstatistikler */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{formatArea(warehouse.area)}</div>
                      <div className="text-xs text-gray-600">Alan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{warehouse.capacity.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Kapasite</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-600">{warehouse.height}m</div>
                      <div className="text-xs text-gray-600">Yükseklik</div>
                    </div>
                  </div>

                  {/* Tarih */}
                  <div className="text-xs text-gray-500 mb-4">
                    Oluşturulma: {formatDate(warehouse.createdAt)}
                  </div>

                  {/* Butonlar */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onWarehouseSelect(warehouse)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Yönet & 3D Görünüm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
