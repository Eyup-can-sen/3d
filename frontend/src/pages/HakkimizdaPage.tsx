import React from 'react';
import { TruckIcon, CubeTransparentIcon, UserGroupIcon } from '@heroicons/react/24/solid';

export default function Hakkımızda() {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 lg:p-12 font-sans antialiased">
            <div className="max-w-6xl mx-auto py-16">

                {/* Sayfa Başlığı ve Açıklaması */}
                <header className="text-center mb-16 animate-fade-in-down">
                    <h1 className="text-6xl font-extrabold text-white leading-tight mb-4">
                        Hakkımızda
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Akyapı 3D Depo Yönetimi olarak, depo süreçlerinizi dijitalleştirerek işletmenize yeni bir soluk getiriyoruz.
                    </p>
                </header>

                {/* Ana Tanıtım Bölümü */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="lg:pr-8 animate-fade-in-left">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Geleceğin Depo Yönetimi Bugün Başlıyor.
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-6">
                            Geleneksel depo yönetim sistemlerinin karmaşıklığını geride bırakarak, kullanımı kolay ve sezgisel bir platform sunuyoruz. En büyük farkımız, depolarınızın karmaşık yapısını **3D görselleştirme** ile haritalandırarak, stoklarınızı gerçek zamanlı olarak takip etmenizi sağlamaktır. Bu sayede, ürünlerinizin fiziksel konumunu sanal ortamda anında görebilir, envanter yönetiminizi stratejik bir seviyeye taşıyabilirsiniz.
                        </p>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Akyapı 3D ile kağıt bazlı süreçlere, envanter hatalarına ve operasyonel gecikmelere son veriyoruz.
                        </p>
                    </div>
                    {/* Görsel Alanı (Yer Tutucu) */}
                    <div className="w-full h-80 bg-slate-800 rounded-3xl shadow-2xl flex items-center justify-center animate-fade-in-right">
                        <CubeTransparentIcon className="h-32 w-32 text-indigo-500 opacity-20" />
                    </div>
                </section>

                {/* Değerler ve Vizyon Bölümü */}
                <section className="mb-24">
                    <h2 className="text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
                        Vizyonumuz ve Değerlerimiz
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Vizyon Kartı */}
                        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20 animate-fade-in-up">
                            <div className="flex items-center mb-6">
                                <TruckIcon className="w-12 h-12 text-indigo-400 mr-4" />
                                <h3 className="text-2xl font-bold text-white">Vizyonumuz</h3>
                            </div>
                            <p className="text-slate-400">
                                Her ölçekten işletmenin depo ve lojistik süreçlerini basitleştirmek, optimize etmek ve geleceğe hazırlamaktır.
                            </p>
                        </div>

                        {/* Misyon Kartı */}
                        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 animate-fade-in-up animate-fade-in-up-delay-200">
                            <div className="flex items-center mb-6">
                                <CubeTransparentIcon className="w-12 h-12 text-blue-400 mr-4" />
                                <h3 className="text-2xl font-bold text-white">Teknoloji Odaklılık</h3>
                            </div>
                            <p className="text-slate-400">
                                En son yazılım ve görselleştirme teknolojilerini kullanarak sürekli gelişen bir platform sunuyoruz.
                            </p>
                        </div>

                        {/* Güvenilirlik Kartı */}
                        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/20 animate-fade-in-up animate-fade-in-up-delay-400">
                            <div className="flex items-center mb-6">
                                <UserGroupIcon className="w-12 h-12 text-green-400 mr-4" />
                                <h3 className="text-2xl font-bold text-white">Güvenilirlik</h3>
                            </div>
                            <p className="text-slate-400">
                                İşletmenizin en değerli varlığı olan verilerinizi, en yüksek güvenlik standartlarıyla korumak misyonumuzdur.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="text-center bg-slate-800 p-12 rounded-3xl shadow-2xl border border-slate-700 animate-fade-in-up animate-fade-in-up-delay-600">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Deponuza Geri Dönün
                    </h2>
                    <p className="text-xl text-slate-400 mb-8">
                        Hazır mısınız? Depo süreçlerinizi yönetmeye devam etmek için ana sayfaya dönebilirsiniz.
                    </p>
                    <a
                        href="/home"
                        className="inline-block py-4 px-12 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        Ana Sayfaya Git
                    </a>
                </section>

            </div>
        </div>
    );
}