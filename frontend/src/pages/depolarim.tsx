import React from 'react';
// Değişiklik burada
import { FaBoxes, FaMapMarkerAlt, FaWarehouse } from 'react-icons/fa';

// Örnek statik depo verileri
const sampleDepoData = [
  {
    id: 1,
    ad: "Ankara Merkez Depo",
    konum: "Sincan, Ankara",
    urunSayisi: 124,
    sonGuncelleme: "2025-08-01",
  },
  {
    id: 2,
    ad: "İstanbul Bölge Depo",
    konum: "Tuzla, İstanbul",
    urunSayisi: 87,
    sonGuncelleme: "2025-07-30",
  },
  {
    id: 3,
    ad: "İzmir Lojistik Merkezi",
    konum: "Bornova, İzmir",
    urunSayisi: 210,
    sonGuncelleme: "2025-08-01",
  },
  {
    id: 4,
    ad: "Bursa Şube Depo",
    konum: "Nilüfer, Bursa",
    urunSayisi: 55,
    sonGuncelleme: "2025-07-29",
  },
];

const DepolarimPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaWarehouse className="mr-3 text-indigo-600" />
            Depolarım
          </h1>
          <a
            href="/depo-ekle"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Depo Ekle
          </a>
        </header>

        {/* Depo Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleDepoData.map((depo) => (
            <div
              key={depo.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {depo.ad}
              </h2>
              <div className="border-t border-gray-200 my-4"></div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <FaMapMarkerAlt className="mr-3 text-indigo-500" />
                <span className="text-lg">{depo.konum}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <FaBoxes className="mr-3 text-indigo-500" />
                <span className="text-lg">
                  <span className="font-bold text-gray-800">{depo.urunSayisi}</span> Ürün
                </span>
              </div>

              <div className="text-sm text-gray-500 mt-auto">
                Son Güncelleme: {depo.sonGuncelleme}
              </div>
            </div>
          ))}
        </div>

        {/* Eğer hiç depo yoksa gösterilecek kısım */}
        {sampleDepoData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-lg">
            <FaWarehouse className="h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Henüz hiçbir deponuz yok.</h2>
            <p className="text-gray-500 mb-6">Hemen ilk deponuzu ekleyerek yönetmeye başlayın.</p>
            <a
              href="/depo-ekle"
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Yeni Depo Ekle
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepolarimPage;