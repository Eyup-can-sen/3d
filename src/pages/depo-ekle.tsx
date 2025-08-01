import { useNavigate } from "react-router-dom";
import ModernScene from "../components/3D/Scene/ModernScene"; // ModernScene'i import et

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Anasayfaya veya giriş sayfasına yönlendir
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Üst Kısım - Header ve Butonlar */}
      <header className="w-full bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center z-20"> {/* z-20 ile üstte kalmasını sağladım */}
        {/* Dashboard ve Çıkış Yap Butonları */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/home")}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Dashboard'a Git
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* ModernScene, header'dan sonra kalan tüm alanı kaplar */}
      <div className="flex-grow w-full">
        <ModernScene />
      </div>
    </div>
  );
}