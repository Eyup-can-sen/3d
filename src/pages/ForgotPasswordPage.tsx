import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Link bileşenini kullanmak için ekliyoruz

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Yüklenme durumu için state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Yükleniyor durumunu başlat
    setMessage(""); // Önceki mesajı temizle

    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMessage(res.data.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
      setSuccess(true);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      setSuccess(false);
    } finally {
      setLoading(false); // Yükleniyor durumunu sonlandır
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Container for the form */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-6 leading-tight">
          Şifremi Unuttum
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-md">
          Hesabınıza tekrar erişmek için e-posta adresinizi girin.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              placeholder="örnek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Yüklenirken butonu devre dışı bırak
            className={`w-full py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5
              ${loading 
                ? "bg-blue-400 cursor-not-allowed" // Yüklenirken daha soluk ve pasif
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              }`}
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p className={`text-center text-sm mt-6 p-3 rounded-lg ${success ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"}`}>
            {message}
          </p>
        )}

        {/* Back to Login Link */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            Giriş Sayfasına Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
}