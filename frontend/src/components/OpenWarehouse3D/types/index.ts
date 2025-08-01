
export interface AreaBounds {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

// Veritabanı formatı
export interface WarehouseDB {
  id: string;
  ad: string;
  konum: string;
  alan_verisi_3d: string; // JSON string
  aciklama: string;
  tipi: string;
  kapasite: number;
  yukseklik: number;
  en: number;
  boy: number;
  taban_alani: number;
  ref_sayisi: number;
  aktif: boolean;
  created_at: string;
  user_id: string;
}

// Display formatı
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  description: string;
  area: number;
  coordinates: AreaBounds;
  createdAt: string;
  status: 'active' | 'inactive';
  type: string;
  capacity: number;
  height: number;
  width: number;
  length: number;
  refCount: number;
}

export interface NewWarehouseData {
  ad: string;
  konum: string;
  aciklama: string;
  tipi: string;
  kapasite: number;
  yukseklik: number;
}

export type ViewType = 'list' | 'add-warehouse' | 'warehouse-detail';
