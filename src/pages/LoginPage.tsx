import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // 'react-router-dom' kullanılıyor
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Şifre göster/gizle state'i
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Yeni girişte hata mesajını temizle
    setIsLoading(true); // Yüklenme durumunu başlat

    try {
      // API çağrısını yap
      const res = await axios.post("http://localhost:5000/api/login", { email, password });

      // "Beni Hatırla" işlevi
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Token'ı kaydet ve ana sayfaya yönlendir
      localStorage.setItem("token", res.data.token);
      navigate("/home"); // Başarılı giriş sonrası yönlendirme
    } catch (error) {
      console.error("Giriş hatası:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Axios hatası ve sunucudan gelen mesaj varsa
        setErrorMessage(error.response.data.message || "Giriş başarısız. Bilgilerinizi kontrol edin.");
      } else {
        // Diğer türde hatalar için genel mesaj
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false); // Yüklenme durumunu bitir
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde "Beni Hatırla" bilgisini kontrol et
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 lg:p-8 font-sans antialiased"
    >
      {/* Sol Bölüm: Tanıtım ve Özellikler */}
      <div className="lg:w-1/2 w-full lg:pr-12 text-center lg:text-left mb-12 lg:mb-0">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-down">
          Akyapı 3D Depo Yönetimi
          <br />
          Sistemi'ne Hoş Geldiniz
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8 animate-fade-in-up">
          Akyapı 3D Depo Yönetimi Sistemi ile depo süreçlerinizi baştan sona optimize edin.
          Ürünlerinizi **3 boyutlu olarak sanal bir ortamda yönetin**, envanter hassasiyetini artırın ve operasyonel verimliliği maksimize edin.
          İşletmenizin geleceğini dijitalleştirmeye başlayın!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-fade-in-up animate-fade-in-up-delay-200">
          {/* Özellik Kartı 1: 3D Depo Görselleştirme */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="flex items-center mb-4">
              {/* SVG İkonu */}
              <svg className="w-9 h-9 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10v11h18V10M3 10L12 3l9 7M6 10v4m6-4v4m6-4v4"></path></svg>
              <h3 className="text-xl font-bold text-gray-900">3D Depo Görselleştirme</h3>
            </div>
            <p className="text-gray-600 text-base">
              Deponuzu sanal ortamda **gerçekçi 3 boyutlu modellerle** görüntüleyin, ürün yerleşimlerini optimize edin ve olası hataları en aza indirin.
            </p>
          </div>

          {/* Özellik Kartı 2: Gerçek Zamanlı Takip */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="flex items-center mb-4">
              {/* SVG İkonu */}
              <svg className="w-9 h-9 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-xl font-bold text-gray-900">Gerçek Zamanlı Takip</h3>
            </div>
            <p className="text-gray-600 text-base">
              Tüm stok seviyelerini, inbound/outbound sevkiyatları ve depo içindeki her hareketi **anlık olarak takip edin**, veri odaklı kararlar alın.
            </p>
          </div>

          {/* Özellik Kartı 3: Operasyonel Verimlilik */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="flex items-center mb-4">
              {/* SVG İkonu */}
              <svg className="w-9 h-9 text-purple-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
              <h3 className="text-xl font-bold text-gray-900">Operasyonel Verimlilik</h3>
            </div>
            <p className="text-gray-600 text-base">
              Otomatik rota optimizasyonu, akıllı depolama önerileri ve **yapay zeka destekli analizlerle** operasyonel verimliliğinizi maksimuma çıkarın.
            </p>
          </div>

          {/* Özellik Kartı 4: Kapsamlı Raporlama ve Analiz */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="flex items-center mb-4">
              {/* SVG İkonu */}
              <svg className="w-9 h-9 text-orange-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.333-1.333 2.667-1.333 4 0C17.333 9.333 17.333 10.667 16 12s-2.667 1.333-4 0c-1.333-1.333-1.333-2.667 0-4zm-4 4a4 4 0 100-8 4 4 0 000 8z"></path></svg>
              <h3 className="text-xl font-bold text-gray-900">Kapsamlı Raporlama ve Analiz</h3>
            </div>
            <p className="text-gray-600 text-base">
              İşletmenizin performansını artırmak için detaylı, özelleştirilebilir raporlar ve **gelişmiş analiz araçlarıyla** veriye dayalı stratejiler geliştirin.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Bölüm: Giriş Formu */}
      <div className="lg:w-1/2 w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-right">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 leading-tight">
          Giriş Yap
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* E-posta Adresi Girişi */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              E-posta Adresi:
            </label>
            <input
              id="email"
              type="email"
              placeholder="örnek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
            />
          </div>

          {/* Şifre Girişi */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out pr-10" // Sağda ikon için boşluk
              />
              <button
                type="button" // Formu göndermemesi için
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {/* Şifre Göster/Gizle İkonları */}
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .98-3.144 3.737-5.59 7-6.915" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a9.962 9.962 0 011.531.185M17.85 11.23a9.962 9.962 0 011.025 2.152M16 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-5l-1-1m0 0l-4-4m4 4l-4-4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.825 8.125a10.05 10.05 0 01-1.897-4.437M12 18V6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Hata Mesajı Gösterimi */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm" role="alert">
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 select-none cursor-pointer">
                  Beni Hatırla
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                  Şifremi Unuttum?
                </Link>
              </div>
            </div>
          </div>

          {/* Giriş Butonu */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading} // Yüklenirken butonu devre dışı bırak
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </form>

        {/* Kayıt Ol Linki */}
        <div className="mt-8 text-center">
          <p className="text-base text-gray-700">
            Hesabınız yok mu?{" "}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
              Hemen Kaydolun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}