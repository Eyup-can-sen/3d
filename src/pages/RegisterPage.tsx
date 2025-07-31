import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // İkonları içe aktarıyoruz

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
                navigate("/login"); // Kayıt sonrası giriş sayfasına yönlendir
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
            className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 lg:p-8 font-sans antialiased"
        >
            {/* Sol Bölüm: Tanıtım Metni (Kayıt sayfasına özgü hale getirildi) */}
            <div className="lg:w-1/2 w-full lg:pr-12 text-center lg:text-left mb-12 lg:mb-0">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-down">
                    Akyapı 3D Depo Yönetimi
                    <br />
                    Sistemi'ne Katılın
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-8 animate-fade-in-up">
                    Depo süreçlerinizi optimize etmek ve **3D görselleştirme ile stoklarınızı gerçek zamanlı takip etmek** için hemen aramıza katılın. İşletmenizin geleceğini dijitalleştirmeye bugün başlayın!
                    <br/><br/>
                    Kaydolarak **verimlilik artışı**, **kapsamlı raporlama** ve **kolay kullanım** özelliklerine erişim sağlayın.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-fade-in-up animate-fade-in-up-delay-200">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <div className="flex items-center mb-4">
                            <svg className="w-9 h-9 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10v11h18V10M3 10L12 3l9 7M6 10v4m6-4v4m6-4v4"></path></svg>
                            <h3 className="text-xl font-bold text-gray-900">Kolay Başlangıç</h3>
                        </div>
                        <p className="text-gray-600 text-base">
                            Hızlı kayıt ile dakikalar içinde sisteminize erişin ve depo yönetiminize hemen başlayın.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <div className="flex items-center mb-4">
                            <svg className="w-9 h-9 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h3 className="text-xl font-bold text-gray-900">Güvenli Veri</h3>
                        </div>
                        <p className="text-gray-600 text-base">
                            Tüm verileriniz yüksek güvenlik standartlarıyla korunur, işiniz güvende.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sağ Bölüm: Kayıt Formu */}
            <div className="lg:w-1/2 w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-right">
                <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 leading-tight">
                    Yeni Hesap Oluştur
                </h2>

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Kullanıcı Adı Girişi */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                            Kullanıcı Adı:
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Kullanıcı adınız"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out pr-10"
                        />
                    </div>

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

                    {/* Şifre Oluştur Girişi (İkonlu) */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Şifre Oluştur:
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none top-1/2 transform -translate-y-1/2 mt-3"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Şifreyi Tekrar Gir Girişi (İkonlu) */}
                    <div className="relative">
                        <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Şifreyi Tekrar Gir:
                        </label>
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none top-1/2 transform -translate-y-1/2 mt-3"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Kayıt Butonu */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? "Kaydolunuyor..." : "Kayıt Ol"}
                        </button>
                    </div>
                </form>

                {/* Mesaj Gösterimi */}
                {message && (
                    <div
                        className={`mt-6 p-3 rounded-md text-center text-sm font-medium ${success ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Giriş Sayfasına Dön Linki */}
                <div className="mt-8 text-center">
                    <p className="text-base text-gray-700">
                        Zaten hesabın var mı?{" "}
                        <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}