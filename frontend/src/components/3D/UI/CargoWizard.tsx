import React, { useState, useEffect } from 'react';
import { Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { Cargo } from '../../../types/warehouse';
import { modernTheme } from './ModernTheme';

interface CargoWizardProps {
  isOpen: boolean;
  rack: Rack | null;
  selectedLevel?: number;
  selectedPosition?: number;
  editingCargo?: Cargo | null;
  onClose: () => void;
  onSaveCargo: (cargo: Omit<Cargo, 'id' | 'dateAdded'>) => void;
}

interface CargoFormData {
  name: string;
  description: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  status: Cargo['status'];
  priority: Cargo['priority'];
  category: string;
  tags: string[];
  level: number;
  position: number;
  rackId: string;
  dateExpiry?: string;
}

export const CargoWizard: React.FC<CargoWizardProps> = ({
  isOpen,
  rack,
  selectedLevel = 1,
  selectedPosition = 1,
  editingCargo,
  onClose,
  onSaveCargo
}) => {
  const [step, setStep] = useState(1);
  const [cargoData, setCargoData] = useState<CargoFormData>({
    name: '',
    description: '',
    weight: 0,
    dimensions: { width: 30, height: 20, depth: 30 },
    status: 'stored',
    priority: 'medium',
    category: 'Genel',
    tags: [],
    level: selectedLevel,
    position: selectedPosition,
    rackId: rack?.id || ''
  });

  const [availablePositions, setAvailablePositions] = useState<Array<{level: number, position: number, occupied: boolean}>>([]);

  // Kategori önerileri
  const categories = [
    'Elektronik', 'Giyim', 'Gıda', 'Kozmetik', 'Kitap', 
    'Mobilya', 'Oyuncak', 'Spor', 'Otomotiv', 'Genel'
  ];

  // Durum türleri
  const statusOptions = [
    { value: 'stored', label: '🏪 Depolandı', color: modernTheme.colors.success },
    { value: 'picking', label: '📦 Hazırlanıyor', color: modernTheme.colors.warning },
    { value: 'shipped', label: '🚚 Gönderildi', color: modernTheme.colors.text.secondary },
    { value: 'damaged', label: '⚠️ Hasarlı', color: modernTheme.colors.error }
  ];

  // Öncelik seviyeleri
  const priorityOptions = [
    { value: 'low', label: '🟢 Düşük', color: modernTheme.colors.text.secondary },
    { value: 'medium', label: '🟡 Orta', color: modernTheme.colors.warning },
    { value: 'high', label: '🟠 Yüksek', color: modernTheme.colors.error },
    { value: 'urgent', label: '🔴 Acil', color: modernTheme.colors.error }
  ];

  useEffect(() => {
    if (isOpen && rack) {
      // Mevcut kargolar için pozisyon haritası oluştur
      const positions = [];
      for (let level = 1; level <= rack.levels; level++) {
        for (let pos = 1; pos <= 4; pos++) {
          positions.push({
            level,
            position: pos,
            occupied: false // Bu bilgiyi parent'tan alacağız
          });
        }
      }
      setAvailablePositions(positions);

      // Edit modunda mevcut veriyi yükle
      if (editingCargo) {
        setCargoData({
          name: editingCargo.name,
          description: editingCargo.description || '',
          weight: editingCargo.weight,
          dimensions: editingCargo.dimensions,
          status: editingCargo.status,
          priority: editingCargo.priority,
          category: editingCargo.category,
          tags: editingCargo.tags || [],
          level: editingCargo.level,
          position: editingCargo.position,
          rackId: editingCargo.rackId,
          dateExpiry: editingCargo.dateExpiry
        });
        setStep(2); // Detaylar adımından başla
      } else {
        // Yeni kargo için varsayılan değerler
        setCargoData({
          name: '',
          description: '',
          weight: 0,
          dimensions: { width: 30, height: 20, depth: 30 },
          status: 'stored',
          priority: 'medium',
          category: 'Genel',
          tags: [],
          level: selectedLevel,
          position: selectedPosition,
          rackId: rack.id
        });
        setStep(1);
      }
    }
  }, [isOpen, rack, selectedLevel, selectedPosition, editingCargo]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    if (!cargoData.name || !cargoData.weight || !cargoData.rackId) {
      alert('⚠️ Lütfen zorunlu alanları doldurun!');
      return;
    }

    onSaveCargo({
      name: cargoData.name,
      description: cargoData.description,
      weight: cargoData.weight,
      dimensions: cargoData.dimensions,
      status: cargoData.status,
      priority: cargoData.priority,
      category: cargoData.category,
      tags: cargoData.tags,
      level: cargoData.level,
      position: cargoData.position,
      rackId: cargoData.rackId,
      dateExpiry: cargoData.dateExpiry
    });
  };

  const isValidDimensions = () => {
    if (!rack) return false;
    
    const maxWidth = (rack.dimensions.width / 2.2) * 100; // cm
    const maxDepth = (rack.dimensions.depth / 2.2) * 100; // cm
    const maxHeight = ((rack.dimensions.height / rack.levels) * 0.8) * 100; // cm
    
    return (
      cargoData.dimensions.width <= maxWidth &&
      cargoData.dimensions.depth <= maxDepth &&
      cargoData.dimensions.height <= maxHeight
    );
  };

  if (!isOpen || !rack) return null;

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  };

  const contentStyle: React.CSSProperties = {
    background: modernTheme.colors.background.main,
    border: `1px solid ${modernTheme.colors.border.light}`,
    borderRadius: modernTheme.borderRadius.xl,
    boxShadow: modernTheme.shadows.xl,
    padding: modernTheme.spacing.xl,
    minWidth: '500px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    zIndex: 2001
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: modernTheme.spacing.lg
        }}>
          <h2 style={{ 
            margin: 0, 
            color: modernTheme.colors.text.primary,
            fontSize: '20px',
            fontWeight: '700'
          }}>
            {editingCargo ? '✏️ Kargo Düzenle' : '📦 Yeni Kargo Ekle'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: modernTheme.colors.text.secondary
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          marginBottom: modernTheme.spacing.lg,
          gap: modernTheme.spacing.sm
        }}>
          {[1, 2, 3].map(num => (
            <div
              key={num}
              style={{
                flex: 1,
                height: '4px',
                background: step >= num ? modernTheme.colors.primary : modernTheme.colors.border.light,
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Step 1: Pozisyon Seçimi */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: modernTheme.spacing.md, color: modernTheme.colors.text.primary }}>
              1. Pozisyon Seçin
            </h3>
            
            <div style={{ marginBottom: modernTheme.spacing.md }}>
              <div style={{
                background: modernTheme.colors.background.secondary,
                padding: modernTheme.spacing.md,
                borderRadius: modernTheme.borderRadius.md,
                marginBottom: modernTheme.spacing.md
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  📦 {rack.type === 'pallet' ? 'Palet Rafı' : rack.type === 'shelf' ? 'Klasik Raf' : 'Konsol Raf'}
                </div>
                <div style={{ fontSize: '14px', color: modernTheme.colors.text.secondary }}>
                  📐 {rack.dimensions.width}×{rack.dimensions.depth}×{rack.dimensions.height}m • {rack.levels} seviye
                </div>
              </div>

              {/* Seviye Seçimi */}
              <div style={{ marginBottom: modernTheme.spacing.md }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  📊 Seviye:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Array.from({ length: rack.levels }, (_, i) => i + 1).map(level => (
                    <button
                      key={level}
                      onClick={() => setCargoData(prev => ({ ...prev, level }))}
                      style={{
                        padding: '8px 16px',
                        border: `2px solid ${cargoData.level === level ? modernTheme.colors.primary : modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.md,
                        background: cargoData.level === level ? `${modernTheme.colors.primary}15` : 'white',
                        color: cargoData.level === level ? modernTheme.colors.primary : modernTheme.colors.text.primary,
                        cursor: 'pointer',
                        fontWeight: cargoData.level === level ? '600' : '400'
                      }}
                    >
                      Seviye {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pozisyon Seçimi */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  📍 Pozisyon:
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px',
                  maxWidth: '200px'
                }}>
                  {[1, 2, 3, 4].map(pos => {
                    const positionLabel = ['Sol-Ön', 'Sağ-Ön', 'Sağ-Arka', 'Sol-Arka'][pos - 1];
                    const isOccupied = false; // TODO: Parent'tan gelen bilgiyle kontrol et
                    
                    return (
                      <button
                        key={pos}
                        onClick={() => !isOccupied && setCargoData(prev => ({ ...prev, position: pos }))}
                        disabled={isOccupied}
                        style={{
                          padding: '12px 8px',
                          border: `2px solid ${
                            isOccupied 
                              ? modernTheme.colors.error
                              : cargoData.position === pos 
                                ? modernTheme.colors.primary 
                                : modernTheme.colors.border.light
                          }`,
                          borderRadius: modernTheme.borderRadius.md,
                          background: isOccupied 
                            ? `${modernTheme.colors.error}10`
                            : cargoData.position === pos 
                              ? `${modernTheme.colors.primary}15` 
                              : 'white',
                          color: isOccupied 
                            ? modernTheme.colors.error
                            : cargoData.position === pos 
                              ? modernTheme.colors.primary 
                              : modernTheme.colors.text.primary,
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          fontWeight: cargoData.position === pos ? '600' : '400',
                          fontSize: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div>{pos}</div>
                        <div style={{ fontSize: '10px', marginTop: '2px' }}>
                          {isOccupied ? '❌ Dolu' : positionLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Kargo Bilgileri */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: modernTheme.spacing.md, color: modernTheme.colors.text.primary }}>
              2. Kargo Bilgileri
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: modernTheme.spacing.md }}>
              {/* Kargo Adı */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  📦 Kargo Adı *
                </label>
                <input
                  type="text"
                  value={cargoData.name}
                  onChange={(e) => setCargoData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Örn: Laptop Dell XPS"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.md,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Ağırlık */}
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  ⚖️ Ağırlık (kg) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={cargoData.weight || ''}
                  onChange={(e) => setCargoData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.md,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Kategori */}
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  🏷️ Kategori
                </label>
                <select
                  value={cargoData.category}
                  onChange={(e) => setCargoData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.md,
                    fontSize: '14px'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Boyutlar */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  📐 Boyutlar (cm)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={cargoData.dimensions.width}
                      onChange={(e) => setCargoData(prev => ({
                        ...prev,
                        dimensions: { 
                          ...prev.dimensions, 
                          width: parseInt(e.target.value) || 30 
                        }
                      }))}
                      placeholder="Genişlik"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: `1px solid ${modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.sm,
                        fontSize: '12px'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: modernTheme.colors.text.secondary, marginTop: '2px' }}>
                      Genişlik
                    </div>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={cargoData.dimensions.height}
                      onChange={(e) => setCargoData(prev => ({
                        ...prev,
                        dimensions: { 
                          ...prev.dimensions, 
                          height: parseInt(e.target.value) || 20 
                        }
                      }))}
                      placeholder="Yükseklik"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: `1px solid ${modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.sm,
                        fontSize: '12px'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: modernTheme.colors.text.secondary, marginTop: '2px' }}>
                      Yükseklik
                    </div>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={cargoData.dimensions.depth}
                      onChange={(e) => setCargoData(prev => ({
                        ...prev,
                        dimensions: { 
                          ...prev.dimensions, 
                          depth: parseInt(e.target.value) || 30 
                        }
                      }))}
                      placeholder="Derinlik"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: `1px solid ${modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.sm,
                        fontSize: '12px'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: modernTheme.colors.text.secondary, marginTop: '2px' }}>
                      Derinlik
                    </div>
                  </div>
                </div>
                
                {/* Boyut uyarısı */}
                {!isValidDimensions() && (
                  <div style={{
                    background: `${modernTheme.colors.error}15`,
                    border: `1px solid ${modernTheme.colors.error}`,
                    borderRadius: modernTheme.borderRadius.sm,
                    padding: '6px 8px',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: modernTheme.colors.error
                  }}>
                    ⚠️ Boyutlar çok büyük! Raf boyutlarına uygun olmalı.
                  </div>
                )}
              </div>

              {/* Açıklama */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  📝 Açıklama
                </label>
                <textarea
                  value={cargoData.description}
                  onChange={(e) => setCargoData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Kargo hakkında ek bilgiler..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.md,
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Durum ve Öncelik */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: modernTheme.spacing.md, color: modernTheme.colors.text.primary }}>
              3. Durum ve Öncelik
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: modernTheme.spacing.lg }}>
              {/* Durum */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  📊 Durum
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setCargoData(prev => ({ ...prev, status: option.value as Cargo['status'] }))}
                      style={{
                        padding: '10px 12px',
                        border: `2px solid ${cargoData.status === option.value ? option.color : modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.md,
                        background: cargoData.status === option.value ? `${option.color}15` : 'white',
                        color: cargoData.status === option.value ? option.color : modernTheme.colors.text.primary,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: cargoData.status === option.value ? '600' : '400'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Öncelik */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  🚨 Öncelik
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setCargoData(prev => ({ ...prev, priority: option.value as Cargo['priority'] }))}
                      style={{
                        padding: '10px 12px',
                        border: `2px solid ${cargoData.priority === option.value ? option.color : modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.md,
                        background: cargoData.priority === option.value ? `${option.color}15` : 'white',
                        color: cargoData.priority === option.value ? option.color : modernTheme.colors.text.primary,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: cargoData.priority === option.value ? '600' : '400'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Son Kullanma Tarihi */}
            <div style={{ marginTop: modernTheme.spacing.lg }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                📅 Son Kullanma Tarihi (İsteğe Bağlı)
              </label>
              <input
                type="date"
                value={cargoData.dateExpiry ? cargoData.dateExpiry.split('T')[0] : ''}
                onChange={(e) => setCargoData(prev => ({ 
                  ...prev, 
                  dateExpiry: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                }))}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${modernTheme.colors.border.light}`,
                  borderRadius: modernTheme.borderRadius.md,
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Özet */}
            <div style={{
              background: modernTheme.colors.background.secondary,
              padding: modernTheme.spacing.md,
              borderRadius: modernTheme.borderRadius.md,
              marginTop: modernTheme.spacing.lg
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: modernTheme.colors.text.primary }}>
                📋 Özet
              </h4>
              <div style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>
                📦 <strong>{cargoData.name}</strong> • ⚖️ {cargoData.weight}kg<br/>
                📍 Seviye {cargoData.level}, Pozisyon {cargoData.position}<br/>
                📐 {cargoData.dimensions.width}×{cargoData.dimensions.height}×{cargoData.dimensions.depth}cm<br/>
                🏷️ {cargoData.category} • 📊 {statusOptions.find(s => s.value === cargoData.status)?.label}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: modernTheme.spacing.lg,
          paddingTop: modernTheme.spacing.md,
          borderTop: `1px solid ${modernTheme.colors.border.light}`
        }}>
          <button
            onClick={step === 1 ? onClose : handlePrevious}
            style={{
              padding: '10px 20px',
              border: `1px solid ${modernTheme.colors.border.light}`,
              borderRadius: modernTheme.borderRadius.md,
              background: 'white',
              color: modernTheme.colors.text.primary,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {step === 1 ? '❌ İptal' : '⬅️ Geri'}
          </button>

          <button
            onClick={step === 3 ? handleSave : handleNext}
            disabled={step === 2 && !isValidDimensions()}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: modernTheme.borderRadius.md,
              background: (step === 2 && !isValidDimensions()) 
                ? modernTheme.colors.text.secondary 
                : modernTheme.colors.primary,
              color: 'white',
              cursor: (step === 2 && !isValidDimensions()) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: (step === 2 && !isValidDimensions()) ? 0.6 : 1
            }}
          >
            {step === 3 ? '💾 Kaydet' : '➡️ İleri'}
          </button>
        </div>
      </div>
    </div>
  );
};

export {};