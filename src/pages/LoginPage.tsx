import React, { useState, useEffect } from "react"; // useEffect'i import etmeyi unutmayın
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Font Awesome veya başka bir ikon kütüphanesi kullanmıyorsanız
// basit bir SVG ikonu veya Unicode karakter kullanabiliriz.
// Şimdilik basit bir unicode karakter kullanacağım.
// Gerçek bir projede, React Icons (react-icons) veya Font Awesome (react-fontawesome) önerilir.

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı state'i
  const [isLoading, setIsLoading] = useState(false); // Yüklenme state'i
  const [showPassword, setShowPassword] = useState(false); // Yeni state: Şifreyi göster/gizle
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
      console.error("Login error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
        
        <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-8 leading-tight">
          Hesabına Giriş Yap
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
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

          {/* Password Input with Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şifre
            </label>
            <div className="relative"> {/* Göz ikonu için relative kapsayıcı */}
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pr-10" // Sağda boşluk bırakmak için pr-10
              />
              <button
                type="button" // Formu submit etmemesi için type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400 focus:outline-none"
              >
                {/* Göz ikonu */}
                {showPassword ? (
                  // Göz açık ikonu (şifre görünür)
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // Göz kapalı ikonu (şifre gizli)
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .98-3.144 3.737-5.59 7-6.915" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a9.962 9.962 0 011.531.185M17.85 11.23a9.962 9.962 0 011.025 2.152M16 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-5l-1-1m0 0l-4-4m4 4l-4-4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.825 8.125a10.05 10.05 0 01-1.897-4.437M12 18V6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                Şifremi Hatırla
              </label>
            </div>
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
              Şifremi unuttum?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:-translate-y-0.5"
            disabled={isLoading} // Yüklenirken butonu devre dışı bırak
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Hesabın yok mu?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            Hemen Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
}