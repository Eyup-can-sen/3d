
import React, { useState } from 'react';
import { MapSelector } from './MapSelector';
import { AreaBounds, NewWarehouseData } from '../types';
import { calculateArea, formatArea, createWarehousePayload } from '../utils';

interface AddWarehouseProps {
  onBack: () => void;
  onSave: (warehouseData: any) => Promise<void>;
  saving: boolean;
}

export const AddWarehouse: React.FC<AddWarehouseProps> = ({
  onBack,
  onSave,
  saving
}) => {
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaBounds | null>(null);
  const [formData, setFormData] = useState<NewWarehouseData>({
    ad: '',
    konum: '',
    aciklama: '',
    tipi: 'acik_depo',
    kapasite: 0,
    yukseklik: 0
  });

  const handleAreaSelect = (bounds: AreaBounds) => {
    setSelectedArea(bounds);
    setIsAddingArea(false);
    
    // Otomatik kapasite hesapla
    const area = calculateArea(bounds);
    if (!formData.kapasite) {
      setFormData(prev => ({ ...prev, kapasite: Math.floor(area / 10) }));
    }
    if (!formData.yukseklik) {
      setFormData(prev => ({ ...prev, yukseklik: 5 }));
    }
  };

  const handleSave = async () => {
    if (!selectedArea || !formData.ad.trim()) {
      alert('Lütfen depo adını girin ve haritadan alan seçin!');
      return;
    }

    const payload = createWarehousePayload(formData, selectedArea);
    await onSave(payload);
  };

  const handleInputChange = (field: keyof NewWarehouseData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={saving}
            >
              ← Geri
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yeni Depo Ekle</h1>
              <p className="text-gray-600">Haritadan alan seçin ve depo bilgilerini girin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol: Harita */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alan Seçimi
                {selectedArea && (
                  <span className="ml-2 text-sm text-green-600">
                    ✅ {formatArea(calculateArea(selectedArea))} seçildi
                  </span>
                )}
              </h3>
              
              <MapSelector
                onAreaSelect={handleAreaSelect}
                isSelecting={isAddingArea}
              />
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsAddingArea(!isAddingArea)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isAddingArea
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAddingArea ? 'Seçimi İptal Et' : 'Yeni Alan Seç'}
                </button>
                
                {selectedArea && (
                  <button
                    onClick={() => setSelectedArea(null)}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Seçimi Temizle
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sağ: Form */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Depo Bilgileri</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Depo Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => handleInputChange('ad', e.target.value)}
                    placeholder="Örn: İstanbul Merkez Depo"
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    value={formData.konum}
                    onChange={(e) => handleInputChange('konum', e.target.value)}
                    placeholder="Örn: İstanbul, Avrupa Yakası"
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Depo Tipi
                  </label>
                  <select
                    value={formData.tipi}
                    onChange={(e) => handleInputChange('tipi', e.target.value)}
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="acik_depo">Açık Depo</option>
                    <option value="kapali_depo">Kapalı Depo</option>
                    <option value="soguk_depo">Soğuk Depo</option>
                    <option value="liman_depo">Liman Deposu</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapasite (birim)
                    </label>
                    <input
                      type="number"
                      value={formData.kapasite}
                      onChange={(e) => handleInputChange('kapasite', parseInt(e.target.value) || 0)}
                      placeholder="Otomatik hesaplanacak"
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yükseklik (m)
                    </label>
                    <input
                      type="number"
                      value={formData.yukseklik}
                      onChange={(e) => handleInputChange('yukseklik', parseInt(e.target.value) || 0)}
                      placeholder="5"
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => handleInputChange('aciklama', e.target.value)}
                    placeholder="Depo hakkında detaylı bilgi..."
                    rows={3}
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {selectedArea && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Seçilen Alan Bilgileri</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>📏 Alan: {formatArea(calculateArea(selectedArea))}</div>
                      <div>📍 Koordinat: {selectedArea.northeast.lat.toFixed(6)}, {selectedArea.northeast.lng.toFixed(6)}</div>
                      <div>📍 Koordinat: {selectedArea.southwest.lat.toFixed(6)}, {selectedArea.southwest.lng.toFixed(6)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={!selectedArea || !formData.ad.trim() || saving}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    selectedArea && formData.ad.trim() && !saving
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Depoyu Kaydet'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
