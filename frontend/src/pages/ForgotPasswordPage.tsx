import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
            setMessage(res.data.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
            setSuccess(true);
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Arka planı Giriş sayfasına benzer şekilde açık tonlarda degrade yapıyoruz
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 font-sans antialiased">
            {/* Form Container: Giriş sayfasındaki form kartı stiliyle aynı */}
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-right">

                {/* Başlık: Giriş sayfasındaki başlık stiliyle aynı */}
                <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 leading-tight">
                    Şifremi Unuttum
                </h2>
                <p className="text-center text-gray-700 mb-8 text-md max-w-sm mx-auto">
                    Hesabınıza tekrar erişmek için **e-posta adresinizi girin.** Size şifre sıfırlama bağlantısı göndereceğiz.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* E-posta Adresi Inputu: Giriş sayfasındaki input stiliyle aynı */}
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

                    {/* Gönder Butonu: Giriş sayfasındaki buton stiliyle aynı */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                    </button>
                </form>

                {/* Mesaj Gösterimi */}
                {message && (
                    <p className={`text-center text-sm mt-6 p-3 rounded-lg ${success ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`}>
                        {message}
                    </p>
                )}

                {/* Giriş Sayfasına Geri Dön Linki: Giriş sayfasındaki link stiliyle aynı */}
                <div className="mt-8 text-center">
                    <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                        Giriş Sayfasına Geri Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}