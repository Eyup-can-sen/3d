import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Göz ikonlarını içe aktarıyoruz

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token"); // URL'den token'ı alıyoruz
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // Yeni şifre için göster/gizle state'i
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Onay şifresi için göster/gizle state'i

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Önceki mesajı temizle
    setLoading(true); // Yükleniyor durumunu başlat

    if (newPassword !== confirmPassword) {
      setMessage("Şifreler birbiriyle eşleşmiyor.");
      setSuccess(false);
      setLoading(false); // Hata durumunda yüklenmeyi durdur
      return;
    }

    // Token kontrolü: Eğer token yoksa uyarı ver
    if (!token) {
      setMessage("Geçersiz veya eksik şifre sıfırlama bağlantısı. Lütfen doğru bağlantı üzerinden geldiğinizden emin olun.");
      setSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.message || "Şifreniz başarıyla güncellendi!");
      setSuccess(true);
      // Başarılı olursa kullanıcıya bilgi verip giriş sayfasına yönlendir
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Şifre güncellenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin veya tekrar deneyin.");
      setSuccess(false);
      console.error("Password reset error:", err);
    } finally {
      setLoading(false); // Yükleniyor durumunu sonlandır
    }
  };

  return (
    // Arka planı Giriş sayfasına benzer şekilde açık tonlarda degrade yapıyoruz
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 font-sans antialiased">
      {/* Arka Plan Gradienleri ve Şekiller bu açık temada kullanılmadığı için kaldırıldı */}

      {/* Form Container: Giriş sayfasındaki form kartı stiliyle aynı */}
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-right">

        {/* Header: Giriş sayfasındaki başlık stiliyle aynı */}
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 leading-tight">
          Yeni Şifre Belirle
        </h2>
        <p className="text-center text-gray-700 mb-8 text-md max-w-sm mx-auto">
          Hesabınıza tekrar erişmek için güçlü ve yeni bir şifre oluşturun.
        </p>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-6">
          {/* Yeni Şifre Inputu (İkonlu) - Giriş sayfasındaki input ve ikon stiliyle aynı */}
          <div className="relative">
            <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-1">
              Yeni Şifre:
            </label>
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out pr-10" // Sağda ikon için boşluk
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none top-1/2 transform -translate-y-1/2 mt-3"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Şifreyi Onayla Inputu (İkonlu) - Giriş sayfasındaki input ve ikon stiliyle aynı */}
          <div className="relative">
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1">
              Şifreyi Onayla:
            </label>
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out pr-10" // Sağda ikon için boşluk
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              // Buradaki 'pt-7' kaldırıldı ve 'text-sm leading-5' eklendi
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Butonu - Giriş sayfasındaki buton stiliyle aynı */}
          <button
            type="submit"
            disabled={loading} // Yüklenirken butonu devre dışı bırak
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Şifre Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>

        {/* Mesaj Gösterimi (Başarı/Hata) */}
        {message && (
          <p className={`text-center text-sm mt-6 p-3 rounded-lg ${success ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`}>
            {message}
          </p>
        )}

        {/* Giriş Sayfasına Dön Linki - Giriş sayfasındaki link stiliyle aynı */}
        <div className="mt-8 text-center">
          <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
            Giriş Sayfasına Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
}