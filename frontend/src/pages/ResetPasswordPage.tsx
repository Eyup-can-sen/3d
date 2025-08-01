import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function ResetPasswordPage() {
    const [params] = useSearchParams();
    const token = params.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage("Şifreler birbiriyle eşleşmiyor.");
            setSuccess(false);
            setLoading(false);
            return;
        }

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
            setTimeout(() => navigate("/"), 3000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Şifre güncellenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin veya tekrar deneyin.");
            setSuccess(false);
            console.error("Password reset error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans antialiased">
            <div className="w-full max-w-md bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700 animate-fade-in-right">
                <h2 className="text-4xl font-extrabold text-center mb-8 text-white leading-tight">
                    Yeni Şifre Belirle
                </h2>
                <p className="text-center text-slate-400 mb-8 text-lg max-w-sm mx-auto">
                    Hesabınıza tekrar erişmek için güçlü ve yeni bir şifre oluşturun.
                </p>

                <form onSubmit={handleReset} className="space-y-6">
                    {/* Yeni Şifre Inputu */}
                    <div className="relative">
                        <label htmlFor="new-password" className="block text-sm font-semibold text-slate-300 mb-1">
                            Yeni Şifre:
                        </label>
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all duration-200 ease-in-out pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5 text-slate-400 hover:text-white focus:outline-none mt-6"
                        >
                            {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Şifreyi Onayla Inputu */}
                    <div className="relative">
                        <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-300 mb-1">
                            Şifreyi Onayla:
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

                    {/* Submit Butonu */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-4 px-4 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                Şifre Güncelleniyor...
                            </>
                        ) : (
                            "Şifreyi Güncelle"
                        )}
                    </button>

                </form>

                {/* Mesaj Gösterimi (Başarı/Hata) */}
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

                {/* Giriş Sayfasına Dön Linki */}
                <div className="mt-8 text-center">
                    <Link to="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                        Giriş Sayfasına Geri Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}