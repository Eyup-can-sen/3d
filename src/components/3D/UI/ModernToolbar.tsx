import React from 'react';
import { modernTheme } from './ModernTheme';

export type ToolbarMode = 'view' | 'draw' | 'edit' | 'rack' | 'wall-edit';

export interface ModernToolbarProps {
    mode: 'draw' | 'edit' | 'view' | 'rack' | 'wall-edit';
    onModeChange: (mode: 'draw' | 'edit' | 'view' | 'rack' | 'wall-edit') => void;
    onStartDrawing: () => void;
    onCompleteDrawing: () => void;
    onCancelDrawing: () => void;
    onSave: () => void;
    onLoad: () => void;
    onStartRackPlacement: () => void;
    onCancelRackPlacement?: () => void;
    isDrawing: boolean;
    canComplete: boolean;
    rackPlacementMode?: boolean;
}

export const ModernToolbar: React.FC<ModernToolbarProps> = ({
  mode,
  onModeChange,
  onStartDrawing,
  onCompleteDrawing,
  onCancelDrawing,
  onSave,
  onLoad,
  onCancelRackPlacement,
  isDrawing = false,
  canComplete = false,
  rackPlacementMode = false
}) => {
  const modeButtons = [
    { 
      mode: 'view' as ToolbarMode, 
      icon: '👁️', 
      label: 'Görüntüle', 
      color: modernTheme.colors.text.secondary 
    },
    { 
      mode: 'draw' as ToolbarMode, 
      icon: '✏️', 
      label: 'Çiz', 
      color: modernTheme.colors.primary 
    },
    { 
      mode: 'edit' as ToolbarMode, 
      icon: '🔧', 
      label: 'Düzenle', 
      color: modernTheme.colors.warning 
    },
    { 
      mode: 'rack' as ToolbarMode, 
      icon: '📦', 
      label: 'Raf', 
      color: modernTheme.colors.success 
    }
  ];

  const toolbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '110px',
    left: '20px',
    background: modernTheme.colors.background.main,
    border: `1px solid ${modernTheme.colors.border.light}`,
    borderRadius: modernTheme.borderRadius.lg,
    padding: modernTheme.spacing.sm,
    display: 'flex',
    gap: modernTheme.spacing.sm,
    boxShadow: modernTheme.shadows.lg,
    zIndex: 1000,
    alignItems: 'center'
  };

  const buttonStyle = (isActive: boolean, color: string): React.CSSProperties => ({
    padding: '8px 12px',
    border: 'none',
    borderRadius: modernTheme.borderRadius.md,
    background: isActive ? color : 'transparent',
    color: isActive ? 'white' : color,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minWidth: '80px',
    justifyContent: 'center'
  });

  return (
    <div style={toolbarStyle}>
      {/* Mode Buttons */}
      {modeButtons.map(button => (
        <button
          key={button.mode}
          style={buttonStyle(mode === button.mode, button.color)}
          onClick={() => {
            console.log(`[ModernToolbar] Mod değiştirme denendi: ${button.mode}`); // LOG EKLENDİ
            onModeChange(button.mode);
          }}
          disabled={rackPlacementMode && button.mode !== 'view'}
        >
          <span>{button.icon}</span>
          <span>{button.label}</span>
        </button>
      ))}

      {/* Separator */}
      <div style={{
        width: '1px',
        height: '30px',
        background: modernTheme.colors.border.light,
        margin: '0 8px'
      }} />

      {/* Action Buttons */}
      {mode === 'draw' && (
        <>
          {!isDrawing ? (
            <button
              style={buttonStyle(false, modernTheme.colors.primary)}
              onClick={() => {
                console.log("[ModernToolbar] Çizime başlama denendi!"); // LOG EKLENDİ
                onStartDrawing();
              }}
            >
              <span>🎯</span>
              <span>Başla</span>
            </button>
          ) : (
            <>
              {canComplete && (
                <button
                  style={buttonStyle(false, modernTheme.colors.success)}
                  onClick={() => {
                    console.log("[ModernToolbar] Çizimi tamamlama denendi!"); // LOG EKLENDİ
                    onCompleteDrawing();
                  }}
                >
                  <span>✅</span>
                  <span>Tamamla</span>
                </button>
              )}
              <button
                style={buttonStyle(false, modernTheme.colors.error)}
                onClick={() => {
                  console.log("[ModernToolbar] Çizimi iptal etme denendi!"); // LOG EKLENDİ
                  onCancelDrawing();
                }}
              >
                <span>❌</span>
                <span>İptal</span>
              </button>
            </>
          )}
        </>
      )}

      {rackPlacementMode && (
        <button
          style={buttonStyle(false, modernTheme.colors.error)}
          onClick={() => {
            console.log("[ModernToolbar] Raf yerleşimi iptal denendi!"); // LOG EKLENDİ
            onCancelRackPlacement?.(); // Optional chaining ile güvenli çağrı
          }}
        >
          <span>❌</span>
          <span>Raf İptal</span>
        </button>
      )}

      {/* Separator */}
      <div style={{
        width: '1px',
        height: '30px',
        background: modernTheme.colors.border.light,
        margin: '0 8px'
      }} />

      {/* File Operations */}
      <button
        style={buttonStyle(false, modernTheme.colors.accent)}
        onClick={() => {
          console.log("[ModernToolbar] Kaydetme denendi!"); // LOG EKLENDİ
          onSave();
        }}
      >
        <span>💾</span>
        <span>Kaydet</span>
      </button>

      <button
        style={buttonStyle(false, modernTheme.colors.accent)}
        onClick={() => {
          console.log("[ModernToolbar] Yükleme denendi!"); // LOG EKLENDİ
          onLoad();
        }}
      >
        <span>📁</span>
        <span>Yükle</span>
      </button>
    </div>
  );
};

export {};