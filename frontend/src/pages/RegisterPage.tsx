import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon, UserIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid'; // Modern ikonları içe aktarıyoruz
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Şifreler uyuşmuyor.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/register", { username, email, password });
      setMessage("Kayıt başarıyla tamamlandı! Şimdi giriş yapabilirsiniz.");
      setSuccess(true);
      setTimeout(() => {
        navigate("/"); // Kayıt sonrası giriş sayfasına yönlendir
      }, 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Kayıt başarısız oldu. Lütfen tekrar deneyin.");
      setSuccess(false);
      console.error("Kayıt hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-slate-900 p-4 md:p-12 font-sans antialiased"
    >
      {/* Sol Bölüm: Tanıtım Metni */}
      <div className="lg:w-1/2 w-full lg:pr-12 text-center lg:text-left mb-12 lg:mb-0">
        <h1 className="text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in-down">
          Akyapı 3D Depo Yönetimi
          <br />
          Sistemi'ne Katılın
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed mb-8 animate-fade-in-up">
          Depo süreçlerinizi optimize etmek ve **3D görselleştirme ile stoklarınızı gerçek zamanlı takip etmek** için hemen aramıza katılın. İşletmenizin geleceğini dijitalleştirmeye bugün başlayın!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
            <div className="flex items-center mb-4">
              <UserIcon className="w-9 h-9 text-indigo-400 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">Kolay Başlangıç</h3>
            </div>
            <p className="text-slate-400 text-base">
              Hızlı kayıt ile dakikalar içinde sisteminize erişin ve depo yönetiminize hemen başlayın.
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/20">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="w-9 h-9 text-green-400 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">Güvenli Veri</h3>
            </div>
            <p className="text-slate-400 text-base">
              Tüm verileriniz yüksek güvenlik standartlarıyla korunur, işiniz güvende.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Bölüm: Kayıt Formu */}
      <div className="lg:w-1/2 w-full max-w-md bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700 animate-fade-in-right">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-white leading-tight">
          Yeni Hesap Oluştur
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Kullanıcı Adı Girişi */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-300 mb-1">
              Kullanıcı Adı:
            </label>
            <input
              id="username"
              type="text"
              placeholder="Kullanıcı adınız"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all duration-200 ease-in-out"
            />
          </div>

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

          {/* Şifre Oluştur Girişi */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-1">
              Şifre Oluştur:
            </label>
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
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5 text-slate-400 hover:text-white focus:outline-none mt-6"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Şifreyi Tekrar Gir Girişi */}
          <div className="relative">
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-300 mb-1">
              Şifreyi Tekrar Gir:
            </label>
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all duration-200 ease-in-out pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5 text-slate-400 hover:text-white focus:outline-none mt-6"
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Kayıt Butonu */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Kaydolunuyor...
                </>
              ) : (
                "Kayıt Ol"
              )}
            </button>
          </div>
        </form>

        {/* Mesaj Gösterimi */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg border-2 text-center text-sm font-medium flex items-center ${success ? 'bg-green-500/20 text-green-400 border-green-400' : 'bg-red-500/20 text-red-400 border-red-400'}`}
          >
            {success ? (
              <CheckCircleIcon className="h-6 w-6 mr-3" />
            ) : (
              <ExclamationCircleIcon className="h-6 w-6 mr-3" />
            )}
            <span className="block w-full">{message}</span>
          </div>
        )}

        {/* Giriş Sayfasına Dön Linki */}
        <div className="mt-8 text-center">
          <p className="text-base text-slate-400">
            Zaten hesabın var mı?{" "}
            <Link to="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}