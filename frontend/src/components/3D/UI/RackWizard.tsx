import React, { useState } from 'react';
import { RackType, Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { modernTheme } from './ModernTheme';

interface RackWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRack: (rack: Partial<Rack>) => void;
  position: { x: number; z: number };
}

interface RackConfig {
  type: RackType;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  levels: number;
  rotation: number;
  material: string;
  color: string;
}

export const RackWizard: React.FC<RackWizardProps> = ({
  isOpen,
  onClose,
  onCreateRack,
  position
}) => {
  const [step, setStep] = useState(1);
  const [rackConfig, setRackConfig] = useState<RackConfig>({
    type: 'pallet',
    dimensions: { width: 2.4, height: 2.5, depth: 1.2 },
    levels: 4,
    rotation: 0,
    material: 'steel',
    color: '#4a90e2'
  });

  // Raf tipi şablonları
  const rackTypes = [
    {
      type: 'pallet' as RackType,
      name: 'Palet Rafı',
      icon: '🟢',
      description: 'Ağır yükler için güçlü metal raf',
      dimensions: { width: 2.4, height: 2.5, depth: 1.2 },
      levels: 4,
      color: '#4a90e2',
      material: 'steel'
    },
    {
      type: 'shelf' as RackType,
      name: 'Klasik Raf',
      icon: '🔵',
      description: 'Genel amaçlı esnek raf sistemi',
      dimensions: { width: 2.0, height: 2.0, depth: 0.8 },
      levels: 5,
      color: '#7ed321',
      material: 'metal'
    },
    {
      type: 'cantilever' as RackType,
      name: 'Konsol Raf',
      icon: '🟡',
      description: 'Uzun malzemeler için konsol raf',
      dimensions: { width: 3.0, height: 2.5, depth: 1.0 },
      levels: 3,
      color: '#f5a623',
      material: 'steel'
    }
  ];

  const materials = [
    { value: 'steel', name: 'Çelik', color: '#6c757d' },
    { value: 'aluminum', name: 'Alüminyum', color: '#adb5bd' },
    { value: 'metal', name: 'Metal', color: '#495057' }
  ];

  const colors = [
    { value: '#4a90e2', name: 'Mavi' },
    { value: '#7ed321', name: 'Yeşil' },
    { value: '#f5a623', name: 'Turuncu' },
    { value: '#e74c3c', name: 'Kırmızı' },
    { value: '#9b59b6', name: 'Mor' },
    { value: '#34495e', name: 'Koyu Gri' }
  ];

  const handleRackTypeSelect = (rackType: typeof rackTypes[0]) => {
    setRackConfig({
      type: rackType.type,
      dimensions: rackType.dimensions,
      levels: rackType.levels,
      rotation: 0,
      material: rackType.material,
      color: rackType.color
    });
    setStep(2);
  };

  const handleCreateRack = () => {
    onCreateRack({
      type: rackConfig.type,
      dimensions: rackConfig.dimensions,
      levels: rackConfig.levels,
      rotation: rackConfig.rotation || 0,
      capacity: rackConfig.levels * 4,
      material: rackConfig.material || 'steel',
      color: rackConfig.color || '#4a90e2',
      position: { x: position.x, y: 0, z: position.z },
      id: `rack-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: [],
      notes: ''
    });
    onClose();
    setStep(1);
  };

  const calculateCapacity = () => {
    return rackConfig.levels * 4; // 4 position per level
  };

  const calculateVolume = () => {
    const { width, height, depth } = rackConfig.dimensions;
    return (width * height * depth).toFixed(2);
  };

  if (!isOpen) return null;

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
    overflow: 'auto'
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
            🏗️ Yeni Raf Oluştur
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

        {/* Progress */}
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

        {/* Step 1: Raf Tipi Seçimi */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: modernTheme.spacing.md, color: modernTheme.colors.text.primary }}>
              1. Raf Tipi Seçin
            </h3>
            
            <div style={{ display: 'grid', gap: modernTheme.spacing.md }}>
              {rackTypes.map(rackType => (
                <div
                  key={rackType.type}
                  onClick={() => handleRackTypeSelect(rackType)}
                  style={{
                    border: `2px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.lg,
                    padding: modernTheme.spacing.md,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = rackType.color;
                    e.currentTarget.style.background = `${rackType.color}05`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = modernTheme.colors.border.light;
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{rackType.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: modernTheme.colors.text.primary }}>
                        {rackType.name}
                      </div>
                      <div style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>
                        {rackType.description}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '11px', color: modernTheme.colors.text.secondary }}>
                    📐 {rackType.dimensions.width}×{rackType.dimensions.height}×{rackType.dimensions.depth}m • 
                    📊 {rackType.levels} seviye • 
                    📦 {rackType.levels * 4} pozisyon
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Boyutlar ve Seviyeler */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: modernTheme.spacing.md, color: modernTheme.colors.text.primary }}>
              2. Boyutlar ve Seviyeler
            </h3>

            {/* Dimensions */}
            <div style={{ marginBottom: modernTheme.spacing.lg }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                📐 Boyutlar (metre)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={rackConfig.dimensions.width}
                    onChange={(e) => setRackConfig(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) || 2 }
                    }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${modernTheme.colors.border.light}`,
                      borderRadius: modernTheme.borderRadius.md,
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: modernTheme.colors.text.secondary, marginTop: '4px' }}>
                    Genişlik
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rackConfig.dimensions.height}
                    onChange={(e) => setRackConfig(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) || 2 }
                    }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${modernTheme.colors.border.light}`,
                      borderRadius: modernTheme.borderRadius.md,
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: modernTheme.colors.text.secondary, marginTop: '4px' }}>
                    Yükseklik
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={rackConfig.dimensions.depth}
                    onChange={(e) => setRackConfig(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, depth: parseFloat(e.target.value) || 1 }
                    }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${modernTheme.colors.border.light}`,
                      borderRadius: modernTheme.borderRadius.md,
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: modernTheme.colors.text.secondary, marginTop: '4px' }}>
                    Derinlik
                  </div>
                </div>
              </div>
            </div>

            {/* Levels */}
            <div style={{ marginBottom: modernTheme.spacing.lg }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                📊 Seviye Sayısı: {rackConfig.levels}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={rackConfig.levels}
                onChange={(e) => setRackConfig(prev => ({ ...prev, levels: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  marginBottom: '8px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: modernTheme.colors.text.secondary }}>
                <span>2 seviye</span>
                <span>8 seviye</span>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                🔄 Döndürme: {rackConfig.rotation}°
              </label>
              <input
                type="range"
                min="0"
                max="180"
                step="45"
                value={rackConfig.rotation}
                onChange={(e) => setRackConfig(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  marginBottom: '8px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: modernTheme.colors.text.secondary }}>
                <span>0°</span>
                <span>45°</span>
                <span>90°</span>
                <span>135°</span>
                <span>180°</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Malzeme ve Renk */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: modernTheme.spacing.md, color: modernTheme.colors.text.primary }}>
              3. Malzeme ve Renk
            </h3>

            {/* Material */}
            <div style={{ marginBottom: modernTheme.spacing.lg }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                🔩 Malzeme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {materials.map(material => (
                  <button
                    key={material.value}
                    onClick={() => setRackConfig(prev => ({ ...prev, material: material.value }))}
                    style={{
                      padding: '12px 8px',
                      border: `2px solid ${rackConfig.material === material.value ? material.color : modernTheme.colors.border.light}`,
                      borderRadius: modernTheme.borderRadius.md,
                      background: rackConfig.material === material.value ? `${material.color}15` : 'white',
                      color: rackConfig.material === material.value ? material.color : modernTheme.colors.text.primary,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: rackConfig.material === material.value ? '600' : '400'
                    }}
                  >
                    {material.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div style={{ marginBottom: modernTheme.spacing.lg }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                🎨 Renk
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {colors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setRackConfig(prev => ({ ...prev, color: color.value }))}
                    style={{
                      padding: '12px',
                      border: `3px solid ${rackConfig.color === color.value ? color.value : modernTheme.colors.border.light}`,
                      borderRadius: modernTheme.borderRadius.md,
                      background: `${color.value}20`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: rackConfig.color === color.value ? '600' : '400',
                      color: color.value
                    }}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{
              background: modernTheme.colors.background.secondary,
              padding: modernTheme.spacing.md,
              borderRadius: modernTheme.borderRadius.md
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: modernTheme.colors.text.primary }}>
                📋 Raf Özeti
              </h4>
              <div style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>
                🏷️ <strong>{rackTypes.find(r => r.type === rackConfig.type)?.name}</strong><br/>
                📐 {rackConfig.dimensions.width}×{rackConfig.dimensions.height}×{rackConfig.dimensions.depth}m<br/>
                📊 {rackConfig.levels} seviye • 📦 {calculateCapacity()} pozisyon<br/>
                📏 {calculateVolume()} m³ hacim • 🔄 {rackConfig.rotation}°<br/>
                🔩 {materials.find(m => m.value === rackConfig.material)?.name} • 
                🎨 {colors.find(c => c.value === rackConfig.color)?.name}
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
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
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

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: modernTheme.borderRadius.md,
                background: modernTheme.colors.primary,
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ➡️ İleri
            </button>
          ) : (
            <button
              onClick={handleCreateRack}
              style={{
                padding: '8px 24px',
                border: 'none',
                borderRadius: modernTheme.borderRadius.md,
                background: modernTheme.colors.success,
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ✅ Raf Oluştur
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export {};