import React, { useState } from 'react';
import { Wall } from '../../../hooks/useAdvancedWarehouseBuilder';
import { modernTheme } from './ModernTheme';

interface WallEditorProps {
  wall: Wall | null;
  onUpdateHeight: (wallId: string, height: number) => void;
  onUpdateThickness: (wallId: string, thickness: number) => void;
  onUpdateColor: (wallId: string, color: string) => void;
  onClose: () => void;
}

export const WallEditor: React.FC<WallEditorProps> = ({
  wall,
  onUpdateHeight,
  onUpdateThickness,
  onUpdateColor,
  onClose
}) => {
  const [localHeight, setLocalHeight] = useState(wall?.height || 4);
  const [localThickness, setLocalThickness] = useState(wall?.thickness || 0.25);
  const [localColor, setLocalColor] = useState(wall?.color || '#8e9aaf');

  if (!wall) return null;

  const wallColors = [
    { name: 'Beton Gri', value: '#8e9aaf' },
    { name: 'Tuğla Kırmızı', value: '#cd5c5c' },
    { name: 'Beyaz', value: '#f8f9fa' },
    { name: 'Koyu Gri', value: '#495057' },
    { name: 'Kahverengi', value: '#8b4513' },
    { name: 'Yeşil', value: '#228b22' }
  ];

  const handleSave = () => {
    onUpdateHeight(wall.id, localHeight);
    onUpdateThickness(wall.id, localThickness);
    onUpdateColor(wall.id, localColor);
    onClose();
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    background: modernTheme.colors.background.main,
    border: `1px solid ${modernTheme.colors.border.light}`,
    borderRadius: modernTheme.borderRadius.lg,
    padding: modernTheme.spacing.lg,
    minWidth: '280px',
    boxShadow: modernTheme.shadows.xl,
    zIndex: 1000
  };

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: modernTheme.spacing.md,
        paddingBottom: modernTheme.spacing.sm,
        borderBottom: `1px solid ${modernTheme.colors.border.light}`
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: modernTheme.colors.text.primary
        }}>
          🧱 Duvar Düzenle
        </h3>
        <button
          onClick={onClose}
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

      {/* Wall info */}
      <div style={{
        background: modernTheme.colors.background.secondary,
        padding: modernTheme.spacing.sm,
        borderRadius: modernTheme.borderRadius.md,
        marginBottom: modernTheme.spacing.md,
        fontSize: '12px',
        color: modernTheme.colors.text.secondary
      }}>
        📏 Uzunluk: {wall.length.toFixed(2)}m<br/>
        📐 Açı: {wall.angle.toFixed(1)}°<br/>
        🆔 ID: {wall.id.slice(-8)}
      </div>

      {/* Height control */}
      <div style={{ marginBottom: modernTheme.spacing.md }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: modernTheme.colors.text.primary
        }}>
          📏 Yükseklik: {localHeight.toFixed(1)}m
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={localHeight}
          onChange={(e) => setLocalHeight(parseFloat(e.target.value))}
          style={{
            width: '100%',
            marginBottom: '8px'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: modernTheme.colors.text.secondary
        }}>
          <span>1m</span>
          <span>10m</span>
        </div>
      </div>

      {/* Thickness control */}
      <div style={{ marginBottom: modernTheme.spacing.md }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: modernTheme.colors.text.primary
        }}>
          📐 Kalınlık: {(localThickness * 100).toFixed(0)}cm
        </label>
        <input
          type="range"
          min="0.1"
          max="0.5"
          step="0.05"
          value={localThickness}
          onChange={(e) => setLocalThickness(parseFloat(e.target.value))}
          style={{
            width: '100%',
            marginBottom: '8px'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: modernTheme.colors.text.secondary
        }}>
          <span>10cm</span>
          <span>50cm</span>
        </div>
      </div>

      {/* Color selection */}
      <div style={{ marginBottom: modernTheme.spacing.lg }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: modernTheme.colors.text.primary
        }}>
          🎨 Renk
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {wallColors.map(color => (
            <button
              key={color.value}
              onClick={() => setLocalColor(color.value)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${localColor === color.value ? color.value : modernTheme.colors.border.light}`,
                borderRadius: modernTheme.borderRadius.md,
                background: `${color.value}20`,
                color: color.value,
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: localColor === color.value ? '600' : '400'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: modernTheme.spacing.sm
      }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px',
            border: `1px solid ${modernTheme.colors.border.light}`,
            borderRadius: modernTheme.borderRadius.md,
            background: 'white',
            color: modernTheme.colors.text.primary,
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ❌ İptal
        </button>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: modernTheme.borderRadius.md,
            background: modernTheme.colors.primary,
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          ✅ Kaydet
        </button>
      </div>
    </div>
  );
};

export {};