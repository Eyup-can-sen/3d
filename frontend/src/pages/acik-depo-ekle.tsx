import OpenWarehouse3D from "../components/OpenWarehouse3D"; // OpenWarehouse3D'yi import et

export default function AcikDepoEklePage() {
    return (
        <div className="flex flex-col h-full w-full">
            
            {/* Sayfa Başlığı */}
            <h1 className="text-3xl font-bold text-white tracking-wide mb-6">Açık Depo Yönetimi</h1>
            
            {/* OpenWarehouse3D, kalan tüm alanı kaplar */}
            <div className="flex-grow w-full">
                <OpenWarehouse3D />
            </div>
        
        </div>
    );
}