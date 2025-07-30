import React, { useState } from 'react';
import { RackConfig } from '../Scene/ModernScene';
import { modernTheme } from './ModernTheme';

interface RackConfigModalProps {
    onSave: (config: RackConfig) => void;
    onCancel: () => void;
}

export const RackConfigModal: React.FC<RackConfigModalProps> = ({ onSave, onCancel }) => {
    const [config, setConfig] = useState<RackConfig>({
        type: 'pallet',
        dimensions: { width: 2.4, height: 2.5, depth: 1.2 },
        levels: 4,
        capacity: 16,
        material: 'steel',
        color: '#4a90e2',
        rotation: 0
    });

    const handleSave = () => {
        onSave(config);
    };

    const updateConfig = (key: keyof RackConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const updateDimensions = (key: keyof RackConfig['dimensions'], value: number) => {
        setConfig(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [key]: value }
        }));
    };

    const presetConfigs = {
        pallet: { dimensions: { width: 2.4, height: 2.5, depth: 1.2 }, levels: 4, capacity: 16 },
        shelf: { dimensions: { width: 1.8, height: 2.0, depth: 0.8 }, levels: 5, capacity: 20 },
        cantilever: { dimensions: { width: 3.0, height: 3.0, depth: 1.5 }, levels: 3, capacity: 12 }
    };

    const applyPreset = (type: keyof typeof presetConfigs) => {
        const preset = presetConfigs[type];
        setConfig(prev => ({
            ...prev,
            type,
            ...preset
        }));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }}>
            <div style={{
                background: modernTheme.colors.background.main,
                borderRadius: modernTheme.borderRadius.xl,
                padding: '24px',
                width: '500px',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: modernTheme.shadows.xl
            }}>
                <h2 style={{
                    margin: '0 0 20px 0',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: modernTheme.colors.text.primary,
                    textAlign: 'center'
                }}>
                    📦 Raf Konfigürasyonu
                </h2>

                {/* Hızlı Presetler */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                        Hızlı Seçim:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {Object.keys(presetConfigs).map(type => (
                            <button
                                key={type}
                                onClick={() => applyPreset(type as keyof typeof presetConfigs)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    border: config.type === type ? `2px solid ${modernTheme.colors.primary}` : `1px solid ${modernTheme.colors.border.light}`,
                                    borderRadius: modernTheme.borderRadius.md,
                                    background: config.type === type ? modernTheme.colors.primary : 'white',
                                    color: config.type === type ? 'white' : modernTheme.colors.text.primary,
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Boyutlar */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>
                        📏 Boyutlar (metre):
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>Genişlik</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0.5"
                                max="10"
                                value={config.dimensions.width}
                                onChange={e => updateDimensions('width', parseFloat(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid ${modernTheme.colors.border.light}`,
                                    borderRadius: modernTheme.borderRadius.sm,
                                    fontSize: '12px'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>Yükseklik</label>
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="8"
                                value={config.dimensions.height}
                                onChange={e => updateDimensions('height', parseFloat(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid ${modernTheme.colors.border.light}`,
                                    borderRadius: modernTheme.borderRadius.sm,
                                    fontSize: '12px'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: modernTheme.colors.text.secondary }}>Derinlik</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0.5"
                                max="5"
                                value={config.dimensions.depth}
                                onChange={e => updateDimensions('depth', parseFloat(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid ${modernTheme.colors.border.light}`,
                                    borderRadius: modernTheme.borderRadius.sm,
                                    fontSize: '12px'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Seviyeler ve Kapasite */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                            📚 Seviye Sayısı:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={config.levels}
                            onChange={e => updateConfig('levels', parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: `1px solid ${modernTheme.colors.border.light}`,
                                borderRadius: modernTheme.borderRadius.sm,
                                fontSize: '12px'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                            📦 Kapasite:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={config.capacity}
                            onChange={e => updateConfig('capacity', parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: `1px solid ${modernTheme.colors.border.light}`,
                                borderRadius: modernTheme.borderRadius.sm,
                                fontSize: '12px'
                            }}
                        />
                    </div>
                </div>

                {/* Renk */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                        🎨 Renk:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['#4a90e2', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#34495e'].map(color => (
                            <button
                                key={color}
                                onClick={() => updateConfig('color', color)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: config.color === color ? '3px solid #333' : '1px solid #ddd',
                                    borderRadius: '50%',
                                    background: color,
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Önizleme */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '16px',
                    borderRadius: modernTheme.borderRadius.md,
                    marginBottom: '20px',
                    fontSize: '12px',
                    color: modernTheme.colors.text.secondary
                }}>
                    <strong>📋 Önizleme:</strong><br/>
                    🏷️ Tip: {config.type}<br/>
                    📏 Boyut: {config.dimensions.width} × {config.dimensions.height} × {config.dimensions.depth} m<br/>
                    📚 {config.levels} seviye, {config.capacity} kapasite<br/>
                    📊 Toplam alan: {(config.dimensions.width * config.dimensions.depth).toFixed(2)} m²
                </div>

                {/* Butonlar */}
                <div style={{ display: 'flex', gap: '12px' }}>
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
                            fontSize: '14px'
                        }}
                    >
                        ❌ İptal
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: modernTheme.borderRadius.md,
                            background: modernTheme.colors.primary,
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        ✅ Raf Yerleştir
                    </button>
                </div>
            </div>
        </div>
    );
};

export {};