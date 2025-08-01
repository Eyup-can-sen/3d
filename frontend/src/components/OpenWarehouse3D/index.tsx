
import React, { useState, useEffect } from 'react';
import { WarehouseList } from './components/WarehouseList';
import { AddWarehouse } from './components/AddWarehouse';
import { WarehouseDetail } from './components/WarehouseDetail';
import { warehouseAPI } from './services/api';
import { Warehouse, ViewType } from './types';

const OpenWarehouse3D: React.FC = () => {
  // State management
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  // Component mount
  useEffect(() => {
    loadWarehouses();
  }, []);

  // Depoları yükle
  const loadWarehouses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await warehouseAPI.getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error('Depo yükleme hatası:', err);
      setError('Depolar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

  // Yeni depo kaydet
  const handleSaveWarehouse = async (warehouseData: any) => {
    setSaving(true);
    
    try {
      const newWarehouse = await warehouseAPI.createWarehouse(warehouseData);
      
      // Listeye ekle
      setWarehouses(prev => [...prev, newWarehouse]);
      
      // Başarı mesajı
      alert(`✅ "${warehouseData.ad}" deposu başarıyla kaydedildi!`);
      
      // Ana listeye dön
      setCurrentView('list');
      
    } catch (error) {
      console.error('Depo kaydetme hatası:', error);
      alert('❌ Depo kaydedilirken bir hata oluştu! Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  // Depo seç ve detaya git
  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setCurrentView('warehouse-detail');
  };

  // Navigation fonksiyonları
  const goToAddWarehouse = () => setCurrentView('add-warehouse');
  const goToList = () => {
    setCurrentView('list');
    setSelectedWarehouse(null);
  };

  // View rendering
  switch (currentView) {
    case 'list':
      return (
        <WarehouseList
          warehouses={warehouses}
          loading={loading}
          error={error}
          onWarehouseSelect={handleWarehouseSelect}
          onAddWarehouse={goToAddWarehouse}
          onRefresh={loadWarehouses}
        />
      );

    case 'add-warehouse':
      return (
        <AddWarehouse
          onBack={goToList}
          onSave={handleSaveWarehouse}
          saving={saving}
        />
      );

    case 'warehouse-detail':
      if (!selectedWarehouse) {
        setCurrentView('list');
        return null;
      }
      return (
        <WarehouseDetail
          warehouse={selectedWarehouse}
          onBack={goToList}
          onUpdate={(updated) => {
            setSelectedWarehouse(updated);
            setWarehouses(prev => 
              prev.map(w => w.id === updated.id ? updated : w)
            );
          }}
        />
      );

    default:
      return null;
  }
};

export default OpenWarehouse3D;
export { OpenWarehouse3D };
