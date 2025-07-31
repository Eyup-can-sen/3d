import React, { useState } from 'react';
import { WarehousePlan, Wall, Point, Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { CargoStats } from '../Scene/ModernScene';
import { modernTheme } from './ModernTheme';

export interface ModernPropertiesPanelProps {
  currentPlan: WarehousePlan;
  selectedRack: Rack | null;
  selectedWall: Wall | null;
  selectedPoint: Point | null;
  selectedCargo?: any;
  cargoStats: CargoStats;
  totalRacks: number;
  cargos: any[];
  onUpdatePlan: (updates: any) => void;
  onUpdateRack: (rackId: string, updates: any) => void;
  onDeleteRack: (rackId: string) => void;
  onCargoSelect?: (cargoId: string) => void;
  onCargoEdit: (cargoId: string, updates: any) => void; // EKLENDI
  onCargoDelete: (cargoId: string) => void; // EKLENDI
  onAddCargo: () => void; // EKLENDI
  onShowCargoWizard: () => void;
  onShowRackSettings: () => void;
}

export const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  currentPlan,
  selectedRack,
  selectedWall,
  selectedPoint,
  selectedCargo,
  cargoStats,
  totalRacks,
  cargos,
  onUpdatePlan,
  onUpdateRack,
  onDeleteRack,
  onCargoSelect,
  onCargoEdit,
  onCargoDelete,
  onAddCargo,
  onShowCargoWizard,
  onShowRackSettings
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'racks' | 'cargo'>('plan');

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: '110px',
    right: '20px',
    width: '350px',
    maxHeight: 'calc(100vh - 40px)',
    background: modernTheme.colors.background.main,
    border: `1px solid ${modernTheme.colors.border.light}`,
    borderRadius: modernTheme.borderRadius.lg,
    boxShadow: modernTheme.shadows.xl,
    zIndex: 1000,
    overflowY: 'auto'
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: modernTheme.borderRadius.md,
    background: isActive ? modernTheme.colors.primary : 'transparent',
    color: isActive ? 'white' : modernTheme.colors.text.primary,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  });

  return (
    <div style={panelStyle}>
      {/* Header Tabs */}
      <div style={{
        display: 'flex',
        padding: modernTheme.spacing.md,
        borderBottom: `1px solid ${modernTheme.colors.border.light}`,
        gap: modernTheme.spacing.sm
      }}>
        <button
          style={tabStyle(activeTab === 'plan')}
          onClick={() => setActiveTab('plan')}
        >
          🏪 Plan
        </button>
        <button
          style={tabStyle(activeTab === 'racks')}
          onClick={() => setActiveTab('racks')}
        >
          📦 Raflar
        </button>
        <button
          style={tabStyle(activeTab === 'cargo')}
          onClick={() => setActiveTab('cargo')}
        >
          🚛 Kargo
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: modernTheme.spacing.md }}>
        {activeTab === 'plan' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              📊 Plan Bilgileri
            </h3>
            <div style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>
              <p>🏪 {currentPlan.name}</p>
              <p>📍 {currentPlan.points.length} nokta</p>
              <p>🧱 {currentPlan.walls.length} duvar</p>
              <p>📊 {currentPlan.area?.toFixed(2) || '0.00'} m²</p>
              <p>📦 {totalRacks} raf</p>
              <p>🚛 {cargos.length} kargo</p>
            </div>
          </div>
        )}

        {activeTab === 'racks' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              📦 Raf Yönetimi
            </h3>
            {selectedRack ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600' }}>
                  Seçili Raf: {selectedRack.id.slice(-8)}
                </p>
                <div style={{ fontSize: '11px', color: modernTheme.colors.text.secondary }}>
                  <p>🏷️ Tip: {selectedRack.type}</p>
                  <p>📏 Boyut: {selectedRack.dimensions.width}×{selectedRack.dimensions.height}×{selectedRack.dimensions.depth}</p>
                  <p>📚 Seviye: {selectedRack.levels}</p>
                  <p>📦 Kapasite: {selectedRack.capacity}</p>
                </div>
                <button
                  onClick={() => onDeleteRack(selectedRack.id)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: modernTheme.borderRadius.sm,
                    background: modernTheme.colors.error,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginTop: '8px'
                  }}
                >
                  🗑️ Sil
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>
                Raf seçin
              </p>
            )}
          </div>
        )}

        {activeTab === 'cargo' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              🚛 Kargo İstatistikleri
            </h3>
            <div style={{ fontSize: '11px', color: modernTheme.colors.text.secondary }}>
              <p>📦 Toplam: {cargoStats.total}</p>
              <p>✅ Teslim: {cargoStats.delivered}</p>
              <p>⏳ Bekleyen: {cargoStats.pending}</p>
              <p>🚛 Yolda: {cargoStats.inTransit}</p>
            </div>
            
            <button
              onClick={onAddCargo}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: modernTheme.borderRadius.sm,
                background: modernTheme.colors.success,
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                marginTop: '8px'
              }}
            >
              ➕ Kargo Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export {};