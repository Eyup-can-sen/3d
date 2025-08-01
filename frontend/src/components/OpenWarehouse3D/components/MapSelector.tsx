
import React, { useEffect, useRef, useState } from 'react';
import { AreaBounds } from '../types';

interface MapSelectorProps {
  onAreaSelect: (bounds: AreaBounds) => void;
  isSelecting: boolean;
}

declare global {
  interface Window {
    L: any;
  }
}

export const MapSelector: React.FC<MapSelectorProps> = ({ onAreaSelect, isSelecting }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState('Başlatılıyor...');

  useEffect(() => {
    loadLeafletWithRetry();
  }, []);

  const loadLeafletWithRetry = async () => {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        await loadLeaflet();
        break;
      } catch (err) {
        retryCount++;
        console.log(`Leaflet yükleme denemesi ${retryCount}/${maxRetries}`, err);
        if (retryCount === maxRetries) {
          setError('Harita yüklenemedi. İnternet bağlantınızı kontrol edin.');
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  };

  const loadLeaflet = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Zaten yüklüyse
      if (window.L && window.L.map) {
        setIsLoaded(true);
        setTimeout(() => initializeMap(), 100);
        resolve();
        return;
      }

      // Mevcut script/css'leri temizle
      const existingCSS = document.querySelector('link[href*="leaflet"]');
      const existingJS = document.querySelector('script[src*="leaflet"]');
      
      if (existingCSS) existingCSS.remove();
      if (existingJS) existingJS.remove();

      setLoadingStep('CSS yükleniyor...');
      
      // CSS yükle
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      
      cssLink.onload = () => {
        setLoadingStep('JavaScript yükleniyor...');
        
        // JS yükle
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => {
          setLoadingStep('Harita başlatılıyor...');
          
          // Leaflet'in tam yüklenmesini bekle
          setTimeout(() => {
            if (window.L && window.L.map) {
              setIsLoaded(true);
              initializeMap();
              resolve();
            } else {
              reject(new Error('Leaflet nesnesi bulunamadı'));
            }
          }, 500);
        };
        
        script.onerror = () => {
          reject(new Error('Leaflet JS yüklenemedi'));
        };
        
        document.head.appendChild(script);
      };
      
      cssLink.onerror = () => {
        reject(new Error('Leaflet CSS yüklenemedi'));
      };
      
      document.head.appendChild(cssLink);
    });
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.L) {
      setError('Harita elementi bulunamadı');
      return;
    }

    try {
      setLoadingStep('Harita çiziliyor...');

      // Önceki haritayı temizle
      if (map) {
        map.remove();
      }

      // Harita oluştur
      const mapInstance = window.L.map(mapRef.current, {
        center: [41.0082, 28.9784], // İstanbul
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true
      });

      // OpenStreetMap katmanı
      const osmLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      });

      // Uydu katmanı
      const satelliteLayer = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, Earthstar Geographics',
        maxZoom: 18
      });

      // Varsayılan katman
      osmLayer.addTo(mapInstance);

      // Katman kontrolü
      const baseLayers = {
        "Harita": osmLayer,
        "Uydu": satelliteLayer
      };

      window.L.control.layers(baseLayers).addTo(mapInstance);

      // Harita yüklenene kadar bekle
      mapInstance.on('load', () => {
        setLoadingStep('');
        setError('');
      });

      mapInstance.on('tileload', () => {
        setLoadingStep('');
      });

      setMap(mapInstance);

    } catch (err) {
      console.error('Harita başlatma hatası:', err);
      setError('Harita başlatılamadı: ' + (err as Error).message);
    }
  };

  // Alan seçimi
  useEffect(() => {
    if (!map || !window.L) return;

    if (isSelecting) {
      map.getContainer().style.cursor = 'crosshair';
      enableDrawing();
    } else {
      map.getContainer().style.cursor = '';
      disableDrawing();
    }

    return () => {
      disableDrawing();
    };
  }, [isSelecting, map]);

  const enableDrawing = () => {
    if (!map || !window.L) return;

    let isDrawing = false;
    let startLatLng: any = null;
    let rectangle: any = null;

    const onMouseDown = (e: any) => {
      startLatLng = e.latlng;
      isDrawing = true;
      
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
    };

    const onMouseMove = (e: any) => {
      if (!isDrawing || !startLatLng) return;

      if (rectangle) {
        map.removeLayer(rectangle);
      }

      const bounds = window.L.latLngBounds(startLatLng, e.latlng);
      rectangle = window.L.rectangle(bounds, {
        color: '#00ff00',
        fillColor: '#00ff00',
        fillOpacity: 0.2,
        weight: 2
      });
      
      rectangle.addTo(map);
    };

    const onMouseUp = (e: any) => {
      if (!isDrawing || !startLatLng) return;

      isDrawing = false;
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();

      if (rectangle) {
        const bounds = rectangle.getBounds();
        const area = calculateArea(bounds);
        
        if (area > 100) {
          const areaBounds: AreaBounds = {
            northeast: {
              lat: bounds.getNorthEast().lat,
              lng: bounds.getNorthEast().lng
            },
            southwest: {
              lat: bounds.getSouthWest().lat,
              lng: bounds.getSouthWest().lng
            }
          };

          onAreaSelect(areaBounds);

          // Dikdörtgeni kaldır
          setTimeout(() => {
            if (rectangle && map) {
              map.removeLayer(rectangle);
            }
          }, 2000);
        } else {
          map.removeLayer(rectangle);
          alert('Alan çok küçük! En az 100 m² seçin.');
        }
      }
    };

    map.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);

    map._drawingHandlers = { onMouseDown, onMouseMove, onMouseUp };
  };

  const disableDrawing = () => {
    if (!map || !map._drawingHandlers) return;

    const { onMouseDown, onMouseMove, onMouseUp } = map._drawingHandlers;
    
    map.off('mousedown', onMouseDown);
    map.off('mousemove', onMouseMove);
    map.off('mouseup', onMouseUp);
    
    delete map._drawingHandlers;
  };

  const calculateArea = (bounds: any) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    
    const R = 6371000; // Dünya yarıçapı (metre)
    const lat1 = sw.lat * Math.PI / 180;
    const lat2 = ne.lat * Math.PI / 180;
    const deltaLat = (ne.lat - sw.lat) * Math.PI / 180;
    const deltaLng = (ne.lng - sw.lng) * Math.PI / 180;

    const width = R * deltaLng * Math.cos((lat1 + lat2) / 2);
    const height = R * deltaLat;
    
    return Math.abs(width * height);
  };

  // Şehir konumları
  const cities = [
    { name: 'İstanbul', coords: [41.0082, 28.9784] },
    { name: 'Ankara', coords: [39.9334, 32.8597] },
    { name: 'İzmir', coords: [38.4192, 27.1287] },
    { name: 'Bursa', coords: [40.1826, 29.0665] },
    { name: 'Kocaeli', coords: [40.8533, 29.8815] }
  ];

  const goToCity = (coords: number[]) => {
    if (map) {
      map.setView(coords, 16);
    }
  };

  // Hata durumu
  if (error) {
    return (
      <div className="w-full h-80 rounded-lg border-2 border-red-300 bg-red-50 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Harita Yüklenemedi</h3>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setIsLoaded(false);
              loadLeafletWithRetry();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Yükleniyor durumu
  if (!isLoaded) {
    return (
      <div className="w-full h-80 rounded-lg border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">OpenStreetMap Yükleniyor</p>
          <p className="text-sm text-gray-500 mt-2">{loadingStep}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Şehir Seçimi */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-700">Şehir:</span>
        {cities.map(city => (
          <button
            key={city.name}
            onClick={() => goToCity(city.coords)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border border-blue-300 transition-colors"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Harita */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className={`w-full h-80 rounded-lg border-2 ${
            isSelecting ? 'border-green-400' : 'border-gray-300'
          }`}
          style={{ minHeight: '320px' }}
        />
        
        {isSelecting && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg z-[1000]">
            <p className="text-sm font-medium">📍 Alan seçmek için sürükleyin</p>
          </div>
        )}
      </div>

      {/* Bilgi */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>• <strong>OpenStreetMap</strong> kullanılıyor - tamamen ücretsiz!</div>
        <div>• Gerçek koordinatlar ve doğru m² hesaplaması</div>
        <div>• {isSelecting ? 'Farenizle sürükleyerek alan seçin (min 100 m²)' : 'Alan seçmek için "Yeni Alan Seç" butonuna tıklayın'}</div>
        <div>• Harita/Uydu görünümü değiştirilebilir</div>
      </div>
    </div>
  );
};
