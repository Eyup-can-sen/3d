
import { WarehouseDB, Warehouse, AreaBounds } from '../types';

class WarehouseAPI {
  private baseURL = '/api/depo';
  private useMockData = true; // API hazır değilse true yap

  // Mock data
  private mockWarehouses: WarehouseDB[] = [
    {
      id: '1',
      ad: 'İstanbul Merkez Depo',
      konum: 'İstanbul, Avrupa Yakası',
      alan_verisi_3d: JSON.stringify({
        northeast: { lat: 41.0092, lng: 28.9794 },
        southwest: { lat: 41.0072, lng: 28.9774 }
      }),
      aciklama: 'Ana lojistik merkezi. Yüksek kapasiteli konteyner depolama alanı.',
      tipi: 'acik_depo',
      kapasite: 5000,
      yukseklik: 8,
      en: 200,
      boy: 125,
      taban_alani: 25000,
      ref_sayisi: 10,
      aktif: true,
      created_at: '2024-01-15T00:00:00Z',
      user_id: '1'
    },
    {
      id: '2',
      ad: 'Ankara Lojistik Merkezi',
      konum: 'Ankara, Sincan',
      alan_verisi_3d: JSON.stringify({
        northeast: { lat: 39.9344, lng: 32.8607 },
        southwest: { lat: 39.9324, lng: 32.8587 }
      }),
      aciklama: 'Orta Anadolu bölge dağıtım merkezi. Modern depolama sistemi.',
      tipi: 'acik_depo',
      kapasite: 3500,
      yukseklik: 6,
      en: 150,
      boy: 120,
      taban_alani: 18000,
      ref_sayisi: 8,
      aktif: true,
      created_at: '2024-02-03T00:00:00Z',
      user_id: '1'
    },
    {
      id: '3',
      ad: 'İzmir Liman Deposu',
      konum: 'İzmir, Alsancak',
      alan_verisi_3d: JSON.stringify({
        northeast: { lat: 38.4202, lng: 27.1297 },
        southwest: { lat: 38.4182, lng: 27.1277 }
      }),
      aciklama: 'Liman bağlantılı depo alanı. İhracat-ithalat operasyonları.',
      tipi: 'liman_depo',
      kapasite: 2800,
      yukseklik: 7,
      en: 120,
      boy: 125,
      taban_alani: 15000,
      ref_sayisi: 6,
      aktif: false,
      created_at: '2024-01-28T00:00:00Z',
      user_id: '1'
    }
  ];

  // Veritabanından depoları çek
  async getWarehouses(): Promise<Warehouse[]> {
    if (this.useMockData) {
      // Mock data kullan
      await this.delay(800); // Gerçekçi loading simülasyonu
      return this.mockWarehouses.map(this.transformToDisplay);
    }

    try {
      const response = await fetch(`${this.baseURL}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // HTML dönerse (404, 500 vb.) mock data kullan
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('API JSON dönmedi, mock data kullanılıyor');
        return this.mockWarehouses.map(this.transformToDisplay);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WarehouseDB[] = await response.json();
      return data.map(this.transformToDisplay);
    } catch (error) {
      console.warn('API hatası, mock data kullanılıyor:', error);
      return this.mockWarehouses.map(this.transformToDisplay);
    }
  }

  // Yeni depo kaydet
  async createWarehouse(warehouseData: any): Promise<Warehouse> {
    if (this.useMockData) {
      // Mock data'ya ekle
      await this.delay(1000);
      
      const newWarehouse: WarehouseDB = {
        id: Date.now().toString(),
        ad: warehouseData.ad,
        konum: warehouseData.konum,
        aciklama: warehouseData.aciklama,
        tipi: warehouseData.tipi,
        kapasite: warehouseData.kapasite,
        yukseklik: warehouseData.yukseklik,
        en: warehouseData.en,
        boy: warehouseData.boy,
        taban_alani: warehouseData.taban_alani,
        alan_verisi_3d: warehouseData.alan_verisi_3d,
        ref_sayisi: warehouseData.ref_sayisi,
        aktif: warehouseData.aktif,
        created_at: new Date().toISOString(),
        user_id: '1'
      };

      this.mockWarehouses.push(newWarehouse);
      return this.transformToDisplay(newWarehouse);
    }

    try {
      const response = await fetch(`${this.baseURL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouseData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return this.transformToDisplay(result);
    } catch (error) {
      console.error('API Error - createWarehouse:', error);
      throw error;
    }
  }

  // Depo güncelle
  async updateWarehouse(id: string, updates: Partial<WarehouseDB>): Promise<Warehouse> {
    if (this.useMockData) {
      await this.delay(500);
      
      const index = this.mockWarehouses.findIndex(w => w.id === id);
      if (index !== -1) {
        this.mockWarehouses[index] = { ...this.mockWarehouses[index], ...updates };
        return this.transformToDisplay(this.mockWarehouses[index]);
      }
      throw new Error('Depo bulunamadı');
    }

    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return this.transformToDisplay(result);
    } catch (error) {
      console.error('API Error - updateWarehouse:', error);
      throw error;
    }
  }

  // Depo sil
  async deleteWarehouse(id: string): Promise<void> {
    if (this.useMockData) {
      await this.delay(500);
      
      const index = this.mockWarehouses.findIndex(w => w.id === id);
      if (index !== -1) {
        this.mockWarehouses.splice(index, 1);
        return;
      }
      throw new Error('Depo bulunamadı');
    }

    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API Error - deleteWarehouse:', error);
      throw error;
    }
  }

  // DB formatından Display formatına çevir
  private transformToDisplay(dbWarehouse: WarehouseDB): Warehouse {
    let coordinates: AreaBounds;
    
    try {
      coordinates = JSON.parse(dbWarehouse.alan_verisi_3d);
    } catch (e) {
      // Default koordinat
      coordinates = {
        northeast: { lat: 41.0082, lng: 28.9784 },
        southwest: { lat: 41.0072, lng: 28.9774 }
      };
    }

    return {
      id: dbWarehouse.id,
      name: dbWarehouse.ad,
      location: dbWarehouse.konum,
      description: dbWarehouse.aciklama,
      area: dbWarehouse.taban_alani,
      coordinates: coordinates,
      createdAt: dbWarehouse.created_at,
      status: dbWarehouse.aktif ? 'active' : 'inactive',
      type: dbWarehouse.tipi,
      capacity: dbWarehouse.kapasite,
      height: dbWarehouse.yukseklik,
      width: dbWarehouse.en,
      length: dbWarehouse.boy,
      refCount: dbWarehouse.ref_sayisi
    };
  }

  // Delay yardımcı fonksiyonu
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock data'yı gerçek API ile değiştir
  public switchToRealAPI() {
    this.useMockData = false;
  }

  // Mock data'ya geri dön
  public switchToMockData() {
    this.useMockData = true;
  }
}

export const warehouseAPI = new WarehouseAPI();
