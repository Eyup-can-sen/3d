// src/components/3D/Scene/ModernScene.tsx

import React, { useState, useCallback, useMemo, Suspense, useRef } from 'react';
import { type ThreeEvent } from '@react-three/fiber'; 

import { OrbitControls, Environment, Html } from '@react-three/drei';
import { useAdvancedWarehouseBuilder } from '../../../hooks/useAdvancedWarehouseBuilder';
import { ModernWarehouse } from '../Warehouse/ModernWarehouse';
import { ModernToolbar } from '../UI/ModernToolbar';
import { ModernPropertiesPanel } from '../UI/ModernPropertiesPanel';
import { ModernRackSystem } from '../Warehouse/ModernRackSystem';
import ModernGroundHandler from '../Controls/ModernGroundHandler'; 
import { WallEditor } from '../UI/WallEditor';
import { RackConfigModal } from '../UI/RackConfigModal';
import { modernTheme } from '../UI/ModernTheme';
import ModernWarehouseCanvas from '../Warehouse/ModernWarehouseCanvas'; 

// Arayüzler (ideal olarak, bu arayüzler ortak bir `types.ts` dosyasında olmalı)
export interface CargoStats {
    total: number;
    delivered: number;
    pending: number;
    inTransit: number;
}

export interface RackConfig {
    type: 'pallet' | 'shelf' | 'cantilever';
    dimensions: { width: number; height: number; depth: number };
    levels: number;
    capacity: number;
    material: string;
    color: string;
    rotation: number;
}

export const ModernScene: React.FC = () => {
    const warehouseBuilder = useAdvancedWarehouseBuilder();

    const {
        currentPlan,
        mode,
        selectedWall,
        selectedPoint,
        selectedRack,
        mousePosition,
        isDrawing,
        previewLine,
        racks,
        showMeasurements,
        setShowMeasurements,
        snapToGrid,
        setSnapToGrid,
        gridSize,
        setGridSize,
        startDrawing,
        addPoint, 
        completeDrawing,
        addRack,
        selectRack,
        updateRack,
        deleteRack,
        isPointInside,
        setSelectedPoint,
        setSelectedWall,
        setMode,
        cancelDrawing,
        updateWallHeight,
        updateWallThickness,
        updateWallColor,
        updateMousePosition, // YENİ: useAdvancedWarehouseBuilder'dan alıyoruz
    } = warehouseBuilder;

    // Yerel Durum Yönetimi
    const [cargos] = useState<any[]>([]);
    const [rackPlacementMode, setRackPlacementMode] = useState(false);
    const [pendingRackConfig, setPendingRackConfig] = useState<RackConfig | null>(null);
    const [showRackSettings, setShowRackSettings] = useState(false); 
    const [showCargoWizard, setShowCargoWizard] = useState(false); 
    const [showRackConfigModal, setShowRackConfigModal] = useState(false);

    // Refler (Kamera ve OrbitControls erişimi için) - Bunlar ModernWarehouseCanvas içinde yönetiliyor artık
    const cameraRef = useRef<any>(null);
    const orbitControlsRef = useRef<any>(null);

    // Raf Çakışma Kontrolü
    const checkRackCollision = useCallback((x: number, z: number, config: RackConfig) => {
        const { width, depth } = config.dimensions;
        const halfWidth = width / 2;
        const halfDepth = depth / 2;

        for (const rack of racks) {
            if (selectedRack && rack.id === selectedRack) continue;

            const rackHalfWidth = rack.dimensions.width / 2;
            const rackHalfDepth = rack.dimensions.depth / 2;

            if (
                Math.abs(x - rack.position.x) < (halfWidth + rackHalfWidth + 0.5) &&
                Math.abs(z - rack.position.z) < (halfDepth + rackHalfDepth + 0.5)
            ) {
                return { valid: false, reason: 'Başka bir rafla çakışıyor (min 0.5m mesafe)' };
            }
        }

        if (!currentPlan.isCompleted) {
            return { valid: false, reason: 'Depo planı tamamlanmadı.' };
        }
        if (!isPointInside(x, z)) {
            return { valid: false, reason: 'Depo sınırları dışında' };
        }

        return { valid: true, reason: '' };
    }, [racks, isPointInside, currentPlan.isCompleted, selectedRack]);

    // İşlemler
    const handleSave = useCallback(() => {
        const planData = {
            plan: currentPlan,
            racks,
            cargos,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`modern-warehouse-${currentPlan.id}`, JSON.stringify(planData));

        const areaText = currentPlan.area?.toFixed(2) || '0.00';
        alert(`✅ Depo kaydedildi!\n📊 Alan: ${areaText} m²\n📦 Raf: ${racks.length}\n🚛 Kargo: ${cargos.length}`);
    }, [currentPlan, racks, cargos]);

    const handleStartRackPlacement = useCallback(() => {
        if (!currentPlan.isCompleted) {
            alert('⚠️ Önce depo planını tamamlayın!');
            return;
        }
        setShowRackConfigModal(true);
    }, [currentPlan.isCompleted]);

    const handleRackConfigSave = useCallback((config: RackConfig) => {
        setPendingRackConfig(config);
        setRackPlacementMode(true);
        setShowRackConfigModal(false);
        setMode('rack');
    }, [setMode]);

    // Grid'e oturtma fonksiyonu (ModernGroundHandler'da da var, ortak bir util'e taşınabilir)
    const snapToGridPoint = useCallback((x: number, z: number) => {
        if (!snapToGrid) return { x, z };
        const spacing = 1; // GridSpacing'i burada sabitledik, ModernGroundHandler ile uyumlu olmalı
        return {
            x: Math.round(x / spacing) * spacing,
            z: Math.round(z / spacing) * spacing
        };
    }, [snapToGrid]);

    // 3D sahnesi için merkezi tıklama yöneticisi
    const handleCanvasClick = useCallback((event: ThreeEvent<MouseEvent>) => {
        console.log("[ModernScene] Canvas tıklandı!", event);

        // ModernGroundHandler tarafından bir tıklama olarak filtrelenmişse buraya geliriz.
        if (event.point) {
            const { x, z } = snapToGridPoint(event.point.x, event.point.z);
            console.log(`[ModernScene] Canvas kesişim noktası: x=${x}, z=${z}. Mod: ${mode}, isDrawing: ${isDrawing}, rackPlacementMode: ${rackPlacementMode}`);

            if (rackPlacementMode && pendingRackConfig) {
                console.log("[ModernScene] Raf yerleştirme modu aktif. Raf yerleştiriliyor.");
                const collisionResult = checkRackCollision(x, z, pendingRackConfig);
                if (!collisionResult.valid) {
                    alert(`❌ ${collisionResult.reason}`);
                    return;
                }

                const rackData = {
                    type: pendingRackConfig.type,
                    position: { x: x, y: 0, z: z },
                    dimensions: pendingRackConfig.dimensions,
                    rotation: pendingRackConfig.rotation,
                    levels: pendingRackConfig.levels,
                    capacity: pendingRackConfig.capacity,
                    material: pendingRackConfig.material,
                    color: pendingRackConfig.color,
                    tags: [],
                    notes: ''
                };
                const newRackId = addRack(rackData);

                if (newRackId) {
                    setRackPlacementMode(false);
                    setPendingRackConfig(null);
                    setMode('view');
                    selectRack(newRackId);
                    console.log("[ModernScene] Raf başarıyla yerleştirildi.");
                }

            } else if (mode === 'draw' && isDrawing) {
                console.log("[ModernScene] Çizim modu aktif. Nokta ekleniyor:", { x, z });
                // Sadece noktayı ekle. useAdvancedWarehouseBuilder içindeki addPoint
                // önceki noktayı başlangıç noktası olarak alıp çizimi devam ettirmeli.
                addPoint(x, z);
            } else {
                setSelectedPoint(null);
                setSelectedWall(null);
                selectRack(null);
            }
        } else {
            console.log("[ModernScene] Canvas tıklandı ama 3D nokta bulunamadı.");
            if (mode === 'edit' || mode === 'wall-edit' || mode === 'rack' || mode === 'view') {
                setSelectedPoint(null);
                setSelectedWall(null);
                selectRack(null);
            }
        }
    }, [
        rackPlacementMode, pendingRackConfig, mode, isDrawing, addPoint, 
        snapToGridPoint, checkRackCollision, addRack, setMode, selectRack,
        setSelectedPoint, setSelectedWall
    ]);


    const handleCancelRackPlacement = useCallback(() => {
        setRackPlacementMode(false);
        setPendingRackConfig(null);
        setShowRackConfigModal(false);
        setMode('view');
    }, [setMode]);

    const handlePointClick = useCallback((pointId: string) => {
        if (mode === 'edit') {
            setSelectedPoint(currentPlan.points.find(p => p.id === pointId) || null);
        }
    }, [mode, currentPlan.points, setSelectedPoint]);

    const handleWallClick = useCallback((wallId: string) => {
        if (mode === 'edit' || mode === 'wall-edit') {
            setSelectedWall(currentPlan.walls.find(w => w.id === wallId) || null);
        }
    }, [mode, currentPlan.walls, setSelectedWall]);

    const handleRackClick = useCallback((rackId: string) => {
        selectRack(rackId);
    }, [selectRack]);

    // Belleğe Alınmış Hesaplanan Değerler (Memoized Computed Values)
    const selectedRackData = useMemo(() => {
        return selectedRack ? racks.find(r => r.id === selectedRack) || null : null;
    }, [selectedRack, racks]);

    const cargoStats: CargoStats = useMemo(() => {
        return {
            total: cargos.length,
            delivered: cargos.filter(c => c.status === 'delivered').length,
            pending: cargos.filter(c => c.status === 'pending').length,
            inTransit: cargos.filter(c => c.status === 'in-transit').length
        };
    }, [cargos]);

    // Belleğe Alınmış Prop Nesneleri (Memoized Prop Objects)
    const warehouseProps = useMemo(() => ({
        points: currentPlan.points,
        walls: currentPlan.walls,
        height: currentPlan.height,
        isCompleted: currentPlan.isCompleted,
        showMeasurements,
        selectedPoint: selectedPoint?.id || null,
        selectedWall: selectedWall?.id || null,
        onPointClick: handlePointClick,
        onWallClick: handleWallClick,
        previewLine,
        mousePosition,
        mode,
        isDrawing
    }), [
        currentPlan.points,
        currentPlan.walls,
        currentPlan.height,
        currentPlan.isCompleted,
        showMeasurements,
        selectedPoint?.id,
        selectedWall?.id,
        handlePointClick,
        handleWallClick,
        previewLine,
        mousePosition,
        mode,
        isDrawing
    ]);

    const rackSystemProps = useMemo(() => ({
        racks: racks.map(rack => ({
            ...rack,
            isSelected: rack.id === selectedRack
        })),
        cargos,
        selectedRack: selectedRack,
        selectedCargo: null,
        onRackClick: handleRackClick,
        onRackUpdate: updateRack,
        onCargoClick: (cargoId: string) => { /* empty */ },
        onRackAdd: addRack,
        onCargoAdd: () => { /* empty */ },
        showLabels: true,
        showCapacity: true,
        showMeasurements: showMeasurements,
        animateMovement: true,
        isPointInside,
        pendingRackConfig,
        rackPlacementMode
    }), [racks, cargos, selectedRack, handleRackClick, updateRack, showMeasurements, isPointInside, pendingRackConfig, rackPlacementMode, addRack]);

    const propertiesPanelProps = useMemo(() => ({
        currentPlan,
        selectedRack: selectedRackData,
        selectedWall,
        selectedPoint,
        selectedCargo: null,
        cargoStats,
        totalRacks: racks.length,
        cargos,
        onUpdatePlan: (updates: any) => { /* empty */ },
        onUpdateRack: (rackId: string, updates: any) => {
            updateRack(rackId, updates);
        },
        onDeleteRack: (rackId: string) => {
            deleteRack(rackId);
        },
        onCargoSelect: (cargoId: string) => { /* empty */ },
        onCargoEdit: (cargoId: string, updates: any) => { /* empty */ },
        onCargoDelete: (cargoId: string) => { /* empty */ },
        onAddCargo: () => setShowCargoWizard(true),
        onShowCargoWizard: () => setShowCargoWizard(true),
        onShowRackSettings: () => setShowRackSettings(true)
    }), [
        currentPlan,
        selectedRackData,
        selectedWall,
        selectedPoint,
        cargoStats,
        racks.length,
        cargos,
        updateRack,
        deleteRack
    ]);

    const toolbarProps = useMemo(() => ({
        mode: mode as any, // Mode type casted as any to avoid potential type issues
        onModeChange: setMode,
        onStartDrawing: startDrawing,
        onCompleteDrawing: completeDrawing,
        onCancelDrawing: cancelDrawing,
        onSave: handleSave,
        onLoad: () => { /* empty */ },
        onStartRackPlacement: handleStartRackPlacement,
        onCancelRackPlacement: handleCancelRackPlacement,
        isDrawing,
        canComplete: currentPlan.points.length >= 3,
        rackPlacementMode
    }), [
        mode,
        setMode,
        startDrawing,
        completeDrawing,
        cancelDrawing,
        handleSave,
        handleStartRackPlacement,
        handleCancelRackPlacement,
        isDrawing,
        currentPlan.points.length,
        rackPlacementMode
    ]);

    // Belleğe Alınmış Bileşenler (Memoized Components)
    const MemoizedToolbar = React.memo(() => <ModernToolbar {...toolbarProps} />);
    const MemoizedPropertiesPanel = React.memo(() => <ModernPropertiesPanel {...propertiesPanelProps} />);

    return (
        <>
            <MemoizedToolbar />
            <MemoizedPropertiesPanel />

            {showRackConfigModal && (
                <RackConfigModal
                    onSave={handleRackConfigSave}
                    onCancel={handleCancelRackPlacement}
                />
            )}

            {selectedWall && (
                <WallEditor
                    wall={selectedWall}
                    onUpdateHeight={updateWallHeight}
                    onUpdateThickness={updateWallThickness}
                    onUpdateColor={updateWallColor}
                    onClose={() => setSelectedWall(null)}
                />
            )}

            <div style={{
                width: '100%',
                height: '100vh',
                background: 'linear-gradient(135deg, #5f6875ff 20%, #484e57ff 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Durum Bilgisi Ekranı */}
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: '20px',
                    height: '40px',
                    background: modernTheme.colors.background.main,
                    border: `1px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    fontSize: '12px',
                    color: modernTheme.colors.text.primary,
                    boxShadow: modernTheme.shadows.sm,
                    zIndex: 10,
                    gap: '16px'
                }}>
                    <span>🏪 {currentPlan.name}</span>
                    <span>•</span>
                    <span>📍 {currentPlan.points.length} nokta</span>
                    <span>•</span>
                    <span>🧱 {currentPlan.walls.length} duvar</span>
                    {currentPlan.isCompleted && (
                        <>
                            <span>•</span>
                            <span>📊 {currentPlan.area?.toFixed(1) || '0.0'} m²</span>
                        </>
                    )}
                    {(mode === 'draw' && isDrawing) && (
                        <>
                            <span>•</span>
                            <span style={{ color: modernTheme.colors.primary }}>
                                ✏️ Çizim modu aktif - tıklayarak nokta ekleyin
                            </span>
                        </>
                    )}
                    {rackPlacementMode && (
                        <>
                            <span>•</span>
                            <span style={{ color: modernTheme.colors.warning }}>
                                📦 Raf yerleştirme modu aktif - tıklayarak yerleştirin
                            </span>
                        </>
                    )}
                </div>

                {/* Ana 3D Canvas */}
                <ModernWarehouseCanvas
                    rackPlacementMode={rackPlacementMode}
                    isDrawing={isDrawing}
                    mode={mode}
                    handleCanvasClick={handleCanvasClick} 
                    mousePosition={mousePosition}
                    gridSize={gridSize}
                    snapToGrid={snapToGrid}
                    pendingRackConfig={pendingRackConfig}
                    warehouseProps={warehouseProps}
                    rackSystemProps={rackSystemProps}
                    updateMousePosition={updateMousePosition} // YENİ: updateMousePosition prop'u iletiliyor
                />

            </div>
        </>
    );
};

export default ModernScene;