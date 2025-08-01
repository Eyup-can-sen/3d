import React, { useState } from 'react';
import { FaArrowLeft, FaPlus, FaSave } from 'react-icons/fa';
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
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8 md:p-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all transform hover:-translate-x-1"
            disabled={saving}
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold text-white">Yeni Depo Ekle</h1>
            <p className="text-slate-400 mt-2 text-lg">Haritadan alan seçin ve depo bilgilerini girin</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol: Harita */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 transition-all duration-300 hover:shadow-indigo-500/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Alan Seçimi
                {selectedArea && (
                  <span className="ml-4 text-sm text-green-400 font-semibold">
                    ✅ {formatArea(calculateArea(selectedArea))} seçildi
                  </span>
                )}
              </h3>
              
              <div className="w-full h-80 bg-slate-700 rounded-2xl overflow-hidden">
                <MapSelector
                  onAreaSelect={handleAreaSelect}
                  isSelecting={isAddingArea}
                />
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={() => setIsAddingArea(!isAddingArea)}
                  disabled={saving}
                  className={`flex-1 py-3 px-4 rounded-full font-bold transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 ${
                    isAddingArea
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20 hover:bg-red-700'
                      : 'bg-green-600 text-white shadow-lg shadow-green-500/20 hover:bg-green-700'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaPlus className="w-4 h-4" />
                  <span>{isAddingArea ? 'Seçimi İptal Et' : 'Yeni Alan Seç'}</span>
                </button>
                
                {selectedArea && (
                  <button
                    onClick={() => setSelectedArea(null)}
                    disabled={saving}
                    className="flex-1 py-3 px-4 bg-slate-700 text-slate-200 font-semibold rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    Seçimi Temizle
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sağ: Form */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 transition-all duration-300 hover:shadow-indigo-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Depo Bilgileri</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Depo Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => handleInputChange('ad', e.target.value)}
                    placeholder="Örn: İstanbul Merkez Depo"
                    disabled={saving}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    value={formData.konum}
                    onChange={(e) => handleInputChange('konum', e.target.value)}
                    placeholder="Örn: İstanbul, Avrupa Yakası"
                    disabled={saving}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Depo Tipi
                  </label>
                  <select
                    value={formData.tipi}
                    onChange={(e) => handleInputChange('tipi', e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                  >
                    <option value="acik_depo">Açık Depo</option>
                    <option value="kapali_depo">Kapalı Depo</option>
                    <option value="soguk_depo">Soğuk Depo</option>
                    <option value="liman_depo">Liman Deposu</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Kapasite (birim)
                    </label>
                    <input
                      type="number"
                      value={formData.kapasite}
                      onChange={(e) => handleInputChange('kapasite', parseInt(e.target.value) || 0)}
                      placeholder="Otomatik hesaplanacak"
                      disabled={saving}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Yükseklik (m)
                    </label>
                    <input
                      type="number"
                      value={formData.yukseklik}
                      onChange={(e) => handleInputChange('yukseklik', parseInt(e.target.value) || 0)}
                      placeholder="5"
                      disabled={saving}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => handleInputChange('aciklama', e.target.value)}
                    placeholder="Depo hakkında detaylı bilgi..."
                    rows={3}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                </div>

                {selectedArea && (
                  <div className="bg-indigo-500/20 border border-indigo-400 rounded-xl p-4">
                    <h4 className="font-bold text-indigo-300 mb-2">Seçilen Alan Bilgileri</h4>
                    <div className="text-sm text-indigo-400 space-y-1">
                      <div>📏 Alan: {formatArea(calculateArea(selectedArea))}</div>
                      <div>📍 Koordinat: {selectedArea.northeast.lat.toFixed(6)}, {selectedArea.northeast.lng.toFixed(6)}</div>
                      <div>📍 Koordinat: {selectedArea.southwest.lat.toFixed(6)}, {selectedArea.southwest.lng.toFixed(6)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSave}
                  disabled={!selectedArea || !formData.ad.trim() || saving}
                  className={`w-full py-4 px-6 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3 ${
                    selectedArea && formData.ad.trim() && !saving
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-5 h-5" />
                      <span>Depoyu Kaydet</span>
                    </>
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