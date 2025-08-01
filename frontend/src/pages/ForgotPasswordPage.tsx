import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 md:p-12 font-sans antialiased">
            <div className="w-full max-w-md bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700 animate-fade-in-right">
                <h2 className="text-4xl font-extrabold text-center mb-8 text-white leading-tight">
                    Şifremi Unuttum
                </h2>
                <p className="text-center text-slate-400 mb-8 text-lg max-w-sm mx-auto">
                    Hesabınıza tekrar erişmek için **e-posta adresinizi girin.** Size şifre sıfırlama bağlantısı göndereceğiz.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-4 px-4 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                Gönderiliyor...
                            </>
                        ) : (
                            "Sıfırlama Bağlantısı Gönder"
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`flex items-center text-center text-sm mt-6 p-4 rounded-lg border-2 ${success ? "bg-green-500/20 text-green-400 border-green-400" : "bg-red-500/20 text-red-400 border-red-400"}`}>
                        {success ? (
                            <CheckCircleIcon className="h-6 w-6 mr-3" />
                        ) : (
                            <ExclamationCircleIcon className="h-6 w-6 mr-3" />
                        )}
                        <span className="block w-full">{message}</span>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link to="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                        Giriş Sayfasına Geri Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}