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
    <div className="min-h-screen bg-slate-900 text-white p-8 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-6 sm:mb-0 flex items-center">
            <FaWarehouse className="mr-4 text-blue-500" />
            Depolarım
          </h1>
          <a
            href="/depo-ekle"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            Depo Ekle
          </a>
        </header>

        {/* Depo Kartları */}
        {sampleDepoData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sampleDepoData.map((depo) => (
              <div
                key={depo.id}
                className="bg-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col justify-between transform hover:scale-105 transition-all duration-300 hover:shadow-blue-500/20"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {depo.ad}
                  </h2>
                  <p className="text-sm text-slate-400 mb-4">Depo ID: {depo.id}</p>
                </div>
                
                <div className="border-t border-slate-700 my-4"></div>
                
                <div className="flex items-center text-slate-400 mb-2">
                  <FaMapMarkerAlt className="mr-3 text-indigo-400 h-5 w-5" />
                  <span className="text-lg">{depo.konum}</span>
                </div>
                
                <div className="flex items-center text-slate-400 mb-2">
                  <FaBoxes className="mr-3 text-green-400 h-5 w-5" />
                  <span className="text-lg">
                    <span className="font-bold text-white">{depo.urunSayisi}</span> Ürün
                  </span>
                </div>

                <div className="text-sm text-slate-500 mt-auto pt-4">
                  Son Güncelleme: {depo.sonGuncelleme}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Eğer hiç depo yoksa gösterilecek kısım */
          <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-3xl shadow-2xl">
            <FaWarehouse className="h-28 w-28 text-slate-600 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">Henüz hiçbir deponuz yok.</h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">Hemen ilk deponuzu ekleyerek yönetmeye başlayın.</p>
            <a
              href="/depo-ekle"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
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