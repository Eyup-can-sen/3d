
import { AreaBounds } from '../types';

// Alan hesaplama (Haversine formülü)
export const calculateArea = (coordinates: AreaBounds): number => {
  const R = 6371000; // Dünya yarıçapı (metre)
  const lat1 = coordinates.southwest.lat * Math.PI / 180;
  const lat2 = coordinates.northeast.lat * Math.PI / 180;
  const deltaLat = (coordinates.northeast.lat - coordinates.southwest.lat) * Math.PI / 180;
  const deltaLng = (coordinates.northeast.lng - coordinates.southwest.lng) * Math.PI / 180;

  const width = R * deltaLng * Math.cos((lat1 + lat2) / 2);
  const height = R * deltaLat;
  
  return Math.abs(width * height);
};

// Alan formatı
export const formatArea = (area: number): string => {
  if (area >= 1000) {
    return `${(area / 1000).toFixed(1)}K m²`;
  }
  return `${area.toLocaleString()} m²`;
};

// Durum rengi
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Durum metni
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active': return 'Aktif';
    case 'inactive': return 'Pasif';
    default: return 'Bilinmiyor';
  }
};

// Depo tipi metni
export const getTypeText = (type: string): string => {
  switch (type) {
    case 'acik_depo': return 'Açık Depo';
    case 'kapali_depo': return 'Kapalı Depo';
    case 'soguk_depo': return 'Soğuk Depo';
    case 'liman_depo': return 'Liman Deposu';
    default: return 'Bilinmiyor';
  }
};

// Koordinattan boyut çıkarma
export const calculateDimensions = (coordinates: AreaBounds): { width: number; length: number } => {
  const area = calculateArea(coordinates);
  const aspectRatio = Math.abs(coordinates.northeast.lng - coordinates.southwest.lng) / 
                     Math.abs(coordinates.northeast.lat - coordinates.southwest.lat);
  
  const width = Math.sqrt(area * aspectRatio);
  const length = area / width;
  
  return {
    width: Math.round(width),
    length: Math.round(length)
  };
};

// Tarih formatı
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR');
};

// Depo için API payload oluştur
export const createWarehousePayload = (formData: any, selectedArea: AreaBounds): any => {
  const area = calculateArea(selectedArea);
  const dimensions = calculateDimensions(selectedArea);
  
  return {
    ad: formData.ad.trim(),
    konum: formData.konum.trim() || 'Belirtilmemiş',
    aciklama: formData.aciklama.trim() || 'Açıklama eklenmemiş',
    tipi: formData.tipi,
    kapasite: formData.kapasite || Math.floor(area / 10),
    yukseklik: formData.yukseklik || 5,
    en: dimensions.width,
    boy: dimensions.length,
    taban_alani: Math.round(area),
    alan_verisi_3d: JSON.stringify(selectedArea),
    ref_sayisi: 0,
    aktif: true,
  };
};
