import React, { useState } from 'react';
import { modernTheme } from './ModernTheme';

interface ModernSettingsPanelProps {
  snapToGrid: boolean;
  gridSize: number;
  showMeasurements: boolean;
  showGrid: boolean;
  onToggleSnapToGrid: () => void;
  onGridSizeChange: (size: number) => void;
  onToggleMeasurements: () => void;
  onToggleGrid: () => void;
}

export const ModernSettingsPanel: React.FC<ModernSettingsPanelProps> = ({
  snapToGrid,
  gridSize,
  showMeasurements,
  showGrid,
  onToggleSnapToGrid,
  onGridSizeChange,
  onToggleMeasurements,
  onToggleGrid
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    background: modernTheme.colors.background.panel,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${modernTheme.colors.border.light}`,
    borderRadius: modernTheme.borderRadius.lg,
    boxShadow: modernTheme.shadows.lg,
    zIndex: 1000,
    transition: 'all 0.3s ease'
  };

  const toggleButtonStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    border: 'none',
    borderRadius: modernTheme.borderRadius.lg,
    background: modernTheme.colors.primary,
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={panelStyle}>
      {isOpen ? (
        // Expanded panel
        <div style={{ padding: modernTheme.spacing.md, minWidth: '280px' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: modernTheme.spacing.md
          }}>
            <h3 style={{
              margin: 0,
              color: modernTheme.colors.text.primary,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              ⚙️ Ayarlar
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: modernTheme.colors.text.secondary
              }}
            >
              ✕
            </button>
          </div>

          {/* Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: modernTheme.spacing.md }}>
            {/* Grid Settings */}
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                color: modernTheme.colors.text.primary,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                🎯 Grid Ayarları
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  cursor: 'pointer',
                  gap: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={onToggleGrid}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: modernTheme.colors.primary
                    }}
                  />
                  Grid Göster
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  cursor: 'pointer',
                  gap: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={onToggleSnapToGrid}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: modernTheme.colors.primary
                    }}
                  />
                  Grid'e Hizala
                </label>

                {snapToGrid && (
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: modernTheme.colors.text.primary
                    }}>
                      Grid Boyutu: {gridSize}m
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={gridSize}
                      onChange={(e) => onGridSizeChange(Number(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: modernTheme.colors.primary
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '10px',
                      color: modernTheme.colors.text.secondary,
                      marginTop: '2px'
                    }}>
                      <span>0.5m</span>
                      <span>5m</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                color: modernTheme.colors.text.primary,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                👁️ Görünüm Ayarları
              </h4>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                cursor: 'pointer',
                gap: '8px'
              }}>
                <input
                  type="checkbox"
                  checked={showMeasurements}
                  onChange={onToggleMeasurements}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: modernTheme.colors.primary
                  }}
                />
                Ölçüleri Göster
              </label>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                color: modernTheme.colors.text.primary,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ⚡ Hızlı İşlemler
              </h4>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '6px 12px',
                  border: `1px solid ${modernTheme.colors.border.light}`,
                  borderRadius: modernTheme.borderRadius.sm,
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}>
                  🔄 Sıfırla
                </button>
                
                <button style={{
                  padding: '6px 12px',
                  border: `1px solid ${modernTheme.colors.border.light}`,
                  borderRadius: modernTheme.borderRadius.sm,
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}>
                  📐 Merkeze Al
                </button>
                
                <button style={{
                  padding: '6px 12px',
                  border: `1px solid ${modernTheme.colors.border.light}`,
                  borderRadius: modernTheme.borderRadius.sm,
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}>
                  🔍 Sığdır
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed button
        <button
          style={toggleButtonStyle}
          onClick={() => setIsOpen(true)}
          title="Ayarlar"
        >
          ⚙️
        </button>
      )}
    </div>
  );
};