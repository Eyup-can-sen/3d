import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon, ChartBarIcon, CubeTransparentIcon, GlobeAltIcon, RocketLaunchIcon } from '@heroicons/react/24/solid'; // Modern ikonlar için Heroicons

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Giriş hatası:", error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Giriş başarısız. Bilgilerinizi kontrol edin.");
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-slate-900 p-4 md:p-12 font-sans antialiased">
      {/* Sol Bölüm: Tanıtım ve Özellikler */}
      <div className="lg:w-1/2 w-full lg:pr-12 text-center lg:text-left mb-12 lg:mb-0">
        <h1 className="text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in-down">
          Akyapı 3D Depo Yönetimi
          <br />
          Sistemi'ne Hoş Geldiniz
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed mb-8 animate-fade-in-up">
          Akyapı 3D Depo Yönetimi Sistemi ile depo süreçlerinizi baştan sona optimize edin.
          Ürünlerinizi **3 boyutlu olarak sanal bir ortamda yönetin**, envanter hassasiyetini artırın ve operasyonel verimliliği maksimize edin.
          İşletmenizin geleceğini dijitalleştirmeye başlayın!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Özellik Kartı 1: 3D Depo Görselleştirme */}
          <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
            <div className="flex items-center mb-4">
              <CubeTransparentIcon className="w-9 h-9 text-indigo-400 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">3D Depo Görselleştirme</h3>
            </div>
            <p className="text-slate-400 text-base">
              Deponuzu sanal ortamda **gerçekçi 3 boyutlu modellerle** görüntüleyin, ürün yerleşimlerini optimize edin ve olası hataları en aza indirin.
            </p>
          </div>

          {/* Özellik Kartı 2: Gerçek Zamanlı Takip */}
          <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/20">
            <div className="flex items-center mb-4">
              <RocketLaunchIcon className="w-9 h-9 text-green-400 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">Gerçek Zamanlı Takip</h3>
            </div>
            <p className="text-slate-400 text-base">
              Tüm stok seviyelerini, inbound/outbound sevkiyatları ve depo içindeki her hareketi **anlık olarak takip edin**, veri odaklı kararlar alın.
            </p>
          </div>

          {/* Özellik Kartı 3: Operasyonel Verimlilik */}
          <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20">
            <div className="flex items-center mb-4">
              <GlobeAltIcon className="w-9 h-9 text-purple-400 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">Operasyonel Verimlilik</h3>
            </div>
            <p className="text-slate-400 text-base">
              Otomatik rota optimizasyonu, akıllı depolama önerileri ve **yapay zeka destekli analizlerle** operasyonel verimliliğinizi maksimuma çıkarın.
            </p>
          </div>

          {/* Özellik Kartı 4: Kapsamlı Raporlama ve Analiz */}
          <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/20">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-9 h-9 text-orange-400 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">Kapsamlı Raporlama ve Analiz</h3>
            </div>
            <p className="text-slate-400 text-base">
              İşletmenizin performansını artırmak için detaylı, özelleştirilebilir raporlar ve **gelişmiş analiz araçlarıyla** veriye dayalı stratejiler geliştirin.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Bölüm: Giriş Formu */}
      <div className="lg:w-1/2 w-full max-w-md bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700 animate-fade-in-right">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-white leading-tight">
          Giriş Yap
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* E-posta Adresi Girişi */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-1">
              E-posta Adresi:
            </label>
            <input
              id="email"
              type="email"
              placeholder="örnek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all duration-200 ease-in-out"
            />
          </div>

          {/* Şifre Girişi */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-1">
              Şifre:
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all duration-200 ease-in-out pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5 text-slate-400 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Hata Mesajı Gösterimi */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-400 text-red-400 px-4 py-3 rounded-lg relative text-center text-sm" role="alert">
              <span className="block">{errorMessage}</span>
            </div>
          )}

          {/* Beni Hatırla ve Şifremi Unuttum */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-600 rounded cursor-pointer bg-slate-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 select-none cursor-pointer">
                  Beni Hatırla
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                  Şifremi Unuttum?
                </Link>
              </div>
            </div>
          </div>

          {/* Giriş Butonu */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </form>

        {/* Kayıt Ol Linki */}
        <div className="mt-8 text-center">
          <p className="text-base text-slate-400">
            Hesabınız yok mu?{" "}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
              Hemen Kaydolun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}