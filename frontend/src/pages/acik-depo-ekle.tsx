import { useNavigate } from "react-router-dom";
import OpenWarehouse3D from "../components/OpenWarehouse3D"; // OpenWarehouse3D'yi import et
import { ArrowLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'; // Modern ikonlar

export default function AcikDepoEklePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Anasayfaya veya giriş sayfasına yönlendir
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white font-sans">
      
      {/* Üst Kısım - Header ve Butonlar */}
      <header className="fixed top-0 left-0 w-full z-10 bg-slate-900 p-4 shadow-xl shadow-slate-950/50 flex justify-between items-center">
        
        {/* Başlık */}
        <h1 className="text-2xl font-bold text-white tracking-wide">Açık Depo Yönetimi</h1>

        {/* Dashboard ve Çıkış Yap Butonları */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center space-x-2 py-2 px-6 bg-slate-700 text-slate-200 font-semibold rounded-full shadow-lg shadow-slate-950/50 hover:bg-slate-600 transition-all transform hover:-translate-y-0.5"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 py-2 px-6 bg-red-600 text-white font-semibold rounded-full shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </header>

      {/* Header'ın kapladığı alanı telafi etmek için boş bir div */}
      <div className="h-[76px] w-full"></div> {/* Header yüksekliğine göre ayarlandı */}

      {/* OpenWarehouse3D, header'dan sonra kalan tüm alanı kaplar */}
      <div className="flex-grow w-full">
        <OpenWarehouse3D />
      </div>
    
    </div>
  );
}