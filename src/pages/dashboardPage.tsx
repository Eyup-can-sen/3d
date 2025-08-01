import React from 'react';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Hoş Geldiniz!</h1>
        <div className="flex space-x-4">
          <a
            href="/depolarim"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Depolarım
          </a>
          <a
            href="/depo-ekle"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold border border-indigo-600 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
          >
            Depo Ekle
          </a>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sistem Tanıtım Kartı */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Depo Yönetim Sistemine Giriş</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bu sistem, depolarınızı, envanterinizi ve ürün hareketlerinizi kolayca yönetmeniz için tasarlandı. Anlık stok takibinden raporlamaya kadar tüm süreçlerinizi dijitalleştirin ve verimliliğinizi artırın.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Anlık stok takibi ve envanter yönetimi</li>
            <li>Kolayca depo ve ürün ekleme</li>
            <li>Detaylı raporlama ve analiz imkanları</li>
          </ul>
          <a
            href="/hakkimizda" // Bu linki sistemin tanıtım sayfanız olarak değiştirebilirsiniz
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sistemin Özelliklerini Keşfet
          </a>
        </div>

        {/* Depo İstatistikleri (Dinamik) */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Genel Durum</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Toplam Depo Sayısı</p>
              <p className="text-4xl font-bold text-indigo-600">5</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Toplam Ürün Çeşitliliği</p>
              <p className="text-4xl font-bold text-green-500">250</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Düşük Stoklu Ürünler</p>
              <p className="text-4xl font-bold text-red-500">12</p>
            </div>
          </div>
          <div className="mt-6">
            <a
              href="/raporlar"
              className="w-full text-center block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Detaylı Raporlara Git
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;