
import React from 'react';
import { Warehouse } from '../types';
import { formatArea, getStatusColor, getStatusText, getTypeText, formatDate } from '../utils';

interface WarehouseDetailProps {
  warehouse: Warehouse;
  onBack: () => void;
  onUpdate: (updated: Warehouse) => void;
}

export const WarehouseDetail: React.FC<WarehouseDetailProps> = ({
  warehouse,
  onBack,
  onUpdate
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Geri
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{warehouse.name}</h1>
              <p className="text-gray-600">3D Depo Yönetimi ve Konteyner Operasyonları</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Depo Bilgileri Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Genel Bilgiler */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">ℹ️</span>
              Genel Bilgiler
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tip:</span>
                <span className="font-medium">{getTypeText(warehouse.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Konum:</span>
                <span className="font-medium text-sm">{warehouse.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(warehouse.status)}`}>
                  {getStatusText(warehouse.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturulma:</span>
                <span className="font-medium text-sm">{formatDate(warehouse.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Teknik Özellikler */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📐</span>
              Teknik Özellikler
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Alan:</span>
                <span className="font-medium">{formatArea(warehouse.area)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Boyutlar:</span>
                <span className="font-medium">{warehouse.width} × {warehouse.length} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yükseklik:</span>
                <span className="font-medium">{warehouse.height} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kapasite:</span>
                <span className="font-medium">{warehouse.capacity.toLocaleString()} birim</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referans Sayısı:</span>
                <span className="font-medium">{warehouse.refCount}</span>
              </div>
            </div>
          </div>

          {/* Hızlı Eylemler */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              Hızlı Eylemler
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <span className="mr-2">📦</span>
                Konteyner Ekle
              </button>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <span className="mr-2">🚛</span>
                Araç Operasyonu
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <span className="mr-2">📊</span>
                Rapor Görüntüle
              </button>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center">
                <span className="mr-2">⚙️</span>
                Depo Ayarları
              </button>
            </div>
          </div>
        </div>

        {/* Açıklama */}
        {warehouse.description && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">📝</span>
              Açıklama
            </h3>
            <p className="text-gray-700 leading-relaxed">{warehouse.description}</p>
          </div>
        )}

        {/* 3D Görünüm */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🏗️</span>
            3D Depo Görünümü
          </h3>
          
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">3D Görünüm Geliştirme Aşamasında</h4>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Bu bölümde Three.js ile 3D depo modeli, konteyner yerleştirme ve araç simülasyonu olacak.
              Gerçek zamanlı depo operasyonlarını takip edebileceksiniz.
            </p>
            
            {/* Özellik Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm font-medium text-gray-900">Konteyner Yönetimi</div>
                <div className="text-xs text-gray-600 mt-1">Yerleştirme & Takip</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl mb-2">🚛</div>
                <div className="text-sm font-medium text-gray-900">Araç Operasyonları</div>
                <div className="text-xs text-gray-600 mt-1">Giriş & Çıkış Takibi</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-sm font-medium text-gray-900">Alan Optimizasyonu</div>
                <div className="text-xs text-gray-600 mt-1">Verimlilik Analizi</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Performans İzleme</div>
                <div className="text-xs text-gray-600 mt-1">Gerçek Zamanlı</div>
              </div>
            </div>

            {/* Geliştirme Durumu */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-2">
                <div className="animate-pulse text-blue-600 mr-2">⏳</div>
                <span className="text-sm font-medium text-blue-900">Geliştirme Durumu</span>
              </div>
              <div className="text-xs text-blue-700">
                3D modül aktif olarak geliştirilmektedir. Yakında bu alanda interaktif depo yönetimi yapabileceksiniz.
              </div>
            </div>
          </div>
        </div>

        {/* Koordinat Bilgileri */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📍</span>
            Konum Bilgileri
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Kuzeydoğu Koordinatı</div>
              <div className="text-xs text-gray-600">
                Enlem: {warehouse.coordinates.northeast.lat.toFixed(6)}
              </div>
              <div className="text-xs text-gray-600">
                Boylam: {warehouse.coordinates.northeast.lng.toFixed(6)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Güneybatı Koordinatı</div>
              <div className="text-xs text-gray-600">
                Enlem: {warehouse.coordinates.southwest.lat.toFixed(6)}
              </div>
              <div className="text-xs text-gray-600">
                Boylam: {warehouse.coordinates.southwest.lng.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
