export interface Cargo {
  id: string;
  rackId: string;
  level: number; // Hangi seviye (1, 2, 3, 4...)
  position: number; // Seviyede hangi pozisyon (1, 2, 3...)
  
  // Kargo bilgileri
  name: string;
  description?: string;
  weight: number; // kg
  dimensions: {
    width: number;  // cm
    height: number; // cm  
    depth: number;  // cm
  };
  
  // Durum bilgileri
  status: 'stored' | 'picking' | 'shipped' | 'damaged';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Tarih bilgileri
  dateAdded: string;
  dateExpiry?: string;
  dateLastAccessed?: string;
  
  // Kategori ve etiketler
  category: string;
  tags: string[];
  
  // Barkod/QR bilgileri
  barcode?: string;
  qrCode?: string;
  
  // Müşteri bilgileri
  customerInfo?: {
    name: string;
    company?: string;
    phone?: string;
    email?: string;
  };
  
  // Ek bilgiler
  notes?: string;
  images?: string[];
  documents?: string[];
}

export interface CargoFilter {
  status?: Cargo['status'];
  priority?: Cargo['priority'];
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface CargoStats {
  total: number;
  byStatus: Record<Cargo['status'], number>;
  byPriority: Record<Cargo['priority'], number>;
  byCategory: Record<string, number>;
  totalWeight: number;
  totalVolume: number;
}