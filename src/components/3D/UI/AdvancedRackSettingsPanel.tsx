import React, { useState } from 'react';
import { Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { modernTheme } from './ModernTheme';

interface AdvancedRackSettingsPanelProps {
  isOpen: boolean;
  currentSettings: Partial<Rack>;
  onSettingsChange: (settings: Partial<Rack>) => void;
  onConfirmPlacement: () => void;
  onCancel: () => void;
}

export const AdvancedRackSettingsPanel: React.FC<AdvancedRackSettingsPanelProps> = ({
  isOpen,
  currentSettings,
  onSettingsChange,
  onConfirmPlacement,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'dimensions' | 'position'>('type');

  if (!isOpen) return null;

  const rackTypes = [
    {
      type: 'pallet' as const,
      name: 'Palet Rafı',
      icon: '📦',
      description: 'Ağır yükler için palet rafı',
      defaultDimensions: { width: 2.7, height: 6, depth: 1.1 },
      defaultLevels: 4
    },
    {
      type: 'shelf' as const,
      name: 'Klasik Raf',
      icon: '📚',
      description: 'Orta ağırlıkta ürünler için',
      defaultDimensions: { width: 2.0, height: 2.5, depth: 0.6 },
      defaultLevels: 5
    },
    {
      type: 'cantilever' as const,
      name: 'Konsol Raf',
      icon: '🏗️',
      description: 'Uzun ürünler için konsol raf',
      defaultDimensions: { width: 3.0, height: 4, depth: 1.5 },
      defaultLevels: 3
    }
  ];

  const handleTypeSelect = (rackType: typeof rackTypes[0]) => {
    onSettingsChange({
      type: rackType.type,
      dimensions: rackType.defaultDimensions,
      levels: rackType.defaultLevels
    });
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    width: '350px',
    maxHeight: '80vh',
    background: modernTheme.colors.background.panel,
    backdropFilter: 'blur(15px)',
    border: `2px solid ${modernTheme.colors.primary}`,
    borderRadius: modernTheme.borderRadius.lg,
    boxShadow: modernTheme.shadows.xl,
    zIndex: 2000,
    overflow: 'hidden'
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 8px',
    border: 'none',
    background: active ? modernTheme.colors.primary : 'transparent',
    color: active ? 'white' : modernTheme.colors.text.primary,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: active ? '600' : '400',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{
        background: modernTheme.colors.primary,
        color: 'white',
        padding: '16px 20px',
        fontSize: '16px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>🎯 Raf Ayarları</div>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            opacity: 0.8
          }}
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${modernTheme.colors.border.light}` }}>
        <button 
          style={tabStyle(activeTab === 'type')}
          onClick={() => setActiveTab('type')}
        >
          📦 Tip
        </button>
        <button 
          style={tabStyle(activeTab === 'dimensions')}
          onClick={() => setActiveTab('dimensions')}
        >
          📐 Boyut
        </button>
        <button 
          style={tabStyle(activeTab === 'position')}
          onClick={() => setActiveTab('position')}
        >
          🎯 Pozisyon
        </button>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '20px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {activeTab === 'type' && (
          <div>
            <h4 style={{ 
              margin: '0 0 16px 0',
              color: modernTheme.colors.text.primary,
              fontSize: '14px'
            }}>
              Raf Tipini Seçin
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rackTypes.map((rackType) => (
                <div
                  key={rackType.type}
                  onClick={() => handleTypeSelect(rackType)}
                  style={{
                    padding: '16px',
                    border: `2px solid ${
                      currentSettings.type === rackType.type 
                        ? modernTheme.colors.primary 
                        : modernTheme.colors.border.light
                    }`,
                    borderRadius: modernTheme.borderRadius.md,
                    cursor: 'pointer',
                    background: currentSettings.type === rackType.type 
                      ? `${modernTheme.colors.primary}15` 
                      : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '24px' }}>{rackType.icon}</span>
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '14px',
                        color: modernTheme.colors.text.primary
                      }}>
                        {rackType.name}
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: modernTheme.colors.text.secondary
                      }}>
                        {rackType.description}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '11px',
                    color: modernTheme.colors.text.secondary,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px'
                  }}>
                    <div>
                      📏 {rackType.defaultDimensions.width}×{rackType.defaultDimensions.depth}×{rackType.defaultDimensions.height}m
                    </div>
                    <div>
                      📊 {rackType.defaultLevels} seviye
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div>
            <h4 style={{ 
              margin: '0 0 16px 0',
              color: modernTheme.colors.text.primary,
              fontSize: '14px'
            }}>
              Boyutları Ayarlayın
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Genişlik */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modernTheme.colors.text.primary
                }}>
                  📏 Genişlik: {currentSettings.dimensions?.width || 2.4}m
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.1"
                  value={currentSettings.dimensions?.width || 2.4}
                  onChange={(e) => onSettingsChange({
                    dimensions: {
                      ...currentSettings.dimensions!,
                      width: Number(e.target.value)
                    }
                  })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Derinlik */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modernTheme.colors.text.primary
                }}>
                  📐 Derinlik: {currentSettings.dimensions?.depth || 1.2}m
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={currentSettings.dimensions?.depth || 1.2}
                  onChange={(e) => onSettingsChange({
                    dimensions: {
                      ...currentSettings.dimensions!,
                      depth: Number(e.target.value)
                    }
                  })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Yükseklik */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modernTheme.colors.text.primary
                }}>
                  📏 Yükseklik: {currentSettings.dimensions?.height || 6}m
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={currentSettings.dimensions?.height || 6}
                  onChange={(e) => onSettingsChange({
                    dimensions: {
                      ...currentSettings.dimensions!,
                      height: Number(e.target.value)
                    }
                  })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Seviye Sayısı */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modernTheme.colors.text.primary
                }}>
                  📊 Seviye Sayısı: {currentSettings.levels || 4}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={currentSettings.levels || 4}
                  onChange={(e) => onSettingsChange({
                    levels: Number(e.target.value)
                  })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'position' && (
          <div>
            <h4 style={{ 
              margin: '0 0 16px 0',
              color: modernTheme.colors.text.primary,
              fontSize: '14px'
            }}>
              Pozisyon ve Açı
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Rotasyon */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modernTheme.colors.text.primary
                }}>
                  🔄 Açı: {currentSettings.rotation || 0}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={currentSettings.rotation || 0}
                  onChange={(e) => onSettingsChange({
                    rotation: Number(e.target.value)
                  })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Hızlı açı seçenekleri */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modernTheme.colors.text.primary
                }}>
                  ⚡ Hızlı Açılar:
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                    <button
                      key={angle}
                      onClick={() => onSettingsChange({ rotation: angle })}
                      style={{
                        padding: '6px 12px',
                        border: `1px solid ${
                          currentSettings.rotation === angle 
                            ? modernTheme.colors.primary 
                            : modernTheme.colors.border.light
                        }`,
                        borderRadius: modernTheme.borderRadius.sm,
                        background: currentSettings.rotation === angle 
                          ? modernTheme.colors.primary 
                          : 'white',
                        color: currentSettings.rotation === angle 
                          ? 'white' 
                          : modernTheme.colors.text.primary,
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Pozisyon bilgisi */}
              <div style={{
                background: modernTheme.colors.background.secondary,
                padding: '12px',
                borderRadius: modernTheme.borderRadius.sm,
                fontSize: '11px',
                color: modernTheme.colors.text.secondary
              }}>
                <div><strong>Mevcut Pozisyon:</strong></div>
                <div>X: {currentSettings.position?.x.toFixed(2) || '0.00'}m</div>
                <div>Z: {currentSettings.position?.z.toFixed(2) || '0.00'}m</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid ${modernTheme.colors.border.light}`,
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            border: `1px solid ${modernTheme.colors.border.light}`,
            borderRadius: modernTheme.borderRadius.md,
            background: 'white',
            color: modernTheme.colors.text.primary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          ❌ İptal
        </button>
        
        <button
          onClick={onConfirmPlacement}
          style={{
            flex: 2,
            padding: '12px',
            border: 'none',
            borderRadius: modernTheme.borderRadius.md,
            background: modernTheme.colors.success,
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          ✅ Rafı Yerleştir
        </button>
      </div>
    </div>
  );
};