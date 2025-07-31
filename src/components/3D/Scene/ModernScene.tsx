import React, { useState, useCallback, useMemo, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import { useAdvancedWarehouseBuilder } from '../../../hooks/useAdvancedWarehouseBuilder';
import { SimpleDrawingSystem } from '../Drawing/SimpleDrawingSystem'; // SADECE BU KALSIN
import { ModernWarehouse } from '../Warehouse/ModernWarehouse';
import { ModernToolbar } from '../UI/ModernToolbar';
import { ModernPropertiesPanel } from '../UI/ModernPropertiesPanel';
import { ModernRackSystem } from '../Warehouse/ModernRackSystem';
import ModernGroundHandler from '../Controls/ModernGroundHandler';
import { WallEditor } from '../UI/WallEditor';
import { RackConfigModal } from '../UI/RackConfigModal';
import { modernTheme } from '../UI/ModernTheme';

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
    
    // YENİ - Çizim sistemi
    const [showDrawingSystem, setShowDrawingSystem] = useState(false);
    
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
        updateWallColor
    } = warehouseBuilder;

    // Local state
    const [cargos] = useState<any[]>([]);
    const [rackPlacementMode, setRackPlacementMode] = useState(false);
    const [pendingRackConfig, setPendingRackConfig] = useState<RackConfig | null>(null);
    const [showRackSettings, setShowRackSettings] = useState(false);
    const [showCargoWizard, setShowCargoWizard] = useState(false);
    const [showRackConfigModal, setShowRackConfigModal] = useState(false);

    // Camera state
    const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([10, 10, 10]);
    const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);

    // Collision detection
    const checkRackCollision = useCallback((x: number, z: number, config: RackConfig) => {
        const { width, depth } = config.dimensions;
        const halfWidth = width / 2;
        const halfDepth = depth / 2;
        
        // Check rack-rack collision
        for (const rack of racks) {
            const rackHalfWidth = rack.dimensions.width / 2;
            const rackHalfDepth = rack.dimensions.depth / 2;
            
            if (
                Math.abs(x - rack.position.x) < (halfWidth + rackHalfWidth + 0.5) &&
                Math.abs(z - rack.position.z) < (halfDepth + rackHalfDepth + 0.5)
            ) {
                return { valid: false, reason: 'Başka bir rafla çakışıyor (min 0.5m mesafe)' };
            }
        }
        
        // Check boundaries
        if (!isPointInside(x, z)) {
            return { valid: false, reason: 'Depo sınırları dışında' };
        }
        
        return { valid: true, reason: '' };
    }, [racks, isPointInside]);

    // Actions
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
        
        // Önce raf konfigürasyonu göster
        setShowRackConfigModal(true);
    }, [currentPlan.isCompleted]);

    const handleRackConfigSave = useCallback((config: RackConfig) => {
        setPendingRackConfig(config);
        setRackPlacementMode(true);
        setShowRackConfigModal(false);
        setMode('rack');
    }, [setMode]);

    const handleRackPlacement = useCallback((x: number, z: number) => {
        if (!rackPlacementMode || !pendingRackConfig) return;

        const gridSpacing = 1;
        const finalX = snapToGrid ? Math.round(x / gridSpacing) * gridSpacing : x;
        const finalZ = snapToGrid ? Math.round(z / gridSpacing) * gridSpacing : z;

        // Collision check
        const collisionResult = checkRackCollision(finalX, finalZ, pendingRackConfig);
        if (!collisionResult.valid) {
            alert(`❌ ${collisionResult.reason}`);
            return;
        }

        const rackData = {
            type: pendingRackConfig.type,
            position: { x: finalX, y: 0, z: finalZ },
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
        }
    }, [rackPlacementMode, pendingRackConfig, snapToGrid, checkRackCollision, addRack, setMode, selectRack]);

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

    const handleCanvasClick = useCallback((event: any) => {
        if (rackPlacementMode && event.point) {
            handleRackPlacement(event.point.x, event.point.z);
        }
    }, [rackPlacementMode, handleRackPlacement]);

    // Memoized computed values
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

    // Memoized props objects
    const warehouseProps = useMemo(() => ({
        points: currentPlan.points,
        walls: currentPlan.walls,
        height: currentPlan.height,
        isCompleted: currentPlan.isCompleted,
        showMeasurements,
        selectedPoint: selectedPoint?.id || null,
        selectedWall: selectedWall?.id || null,
        onPointClick: handlePointClick,
        onWallClick: handleWallClick
    }), [
        currentPlan.points,
        currentPlan.walls,
        currentPlan.height,
        currentPlan.isCompleted,
        showMeasurements,
        selectedPoint?.id,
        selectedWall?.id,
        handlePointClick,
        handleWallClick
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
        onCargoClick: (cargoId: string) => {},
        showLabels: true,
        showCapacity: true,
        showMeasurements: showMeasurements,
        animateMovement: true,
        isPointInside,
        pendingRackConfig,
        rackPlacementMode
    }), [racks, cargos, selectedRack, handleRackClick, updateRack, showMeasurements, isPointInside, pendingRackConfig, rackPlacementMode]);

    const propertiesPanelProps = useMemo(() => ({
        currentPlan,
        selectedRack: selectedRackData,
        selectedWall,
        selectedPoint,
        selectedCargo: null,
        cargoStats,
        totalRacks: racks.length,
        cargos,
        onUpdatePlan: (updates: any) => {
            // Handle plan updates
        },
        onUpdateRack: (rackId: string, updates: any) => {
            updateRack(rackId, updates);
        },
        onDeleteRack: (rackId: string) => {
            deleteRack(rackId);
        },
        onCargoSelect: (cargoId: string) => {},
        onCargoEdit: (cargoId: string, updates: any) => {},
        onCargoDelete: (cargoId: string) => {},
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
        mode: mode as any,
        onModeChange: setMode,
        onStartDrawing: startDrawing,
        onCompleteDrawing: completeDrawing,
        onCancelDrawing: cancelDrawing,
        onSave: handleSave,
        onLoad: () => {},
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

    // Memoized components
    const MemoizedToolbar = React.memo(() => <ModernToolbar {...toolbarProps} />);
    const MemoizedPropertiesPanel = React.memo(() => <ModernPropertiesPanel {...propertiesPanelProps} />);

    return (
        <>
            {/* YENİ - Çizim Sistemi */}
            {showDrawingSystem ? (
                <div style={{ width: '100vw', height: '100vh' }}>
                    <Canvas 
                        camera={{ position: [15, 15, 15], fov: 50 }}
                        style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
                    >
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                        <OrbitControls 
                            enablePan={true}
                            enableZoom={true}
                            enableRotate={true}
                            maxPolarAngle={Math.PI / 2}
                        />
                        
                        <SimpleDrawingSystem
                            onComplete={(data) => {
                                console.log('Depo tamamlandı:', data);
                                alert(`✅ Depo oluşturuldu!\n📊 Alan: ${data.area.toFixed(1)} m²\n📍 Nokta: ${data.points.length}\n🚪 Kapı: ${data.doors.length}\n📏 Yükseklik: ${data.height}m`);
                                setShowDrawingSystem(false);
                            }}
                            onCancel={() => setShowDrawingSystem(false)}
                        />
                    </Canvas>
                </div>
            ) : (
                <>
                    {/* YENİ - Çizim Butonu */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '300px',
                        zIndex: 1000
                    }}>
                        <button
                            onClick={() => setShowDrawingSystem(true)}
                            style={{
                                padding: '12px 20px',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            🏗️ Zemin Çiz
                        </button>
                    </div>

                    {/* MEVCUT KODLAR */}
                    <MemoizedToolbar />

                    <MemoizedPropertiesPanel />

                    {/* Raf Konfigürasyon Modal */}
                    {showRackConfigModal && (
                        <RackConfigModal
                            onSave={handleRackConfigSave}
                            onCancel={handleCancelRackPlacement}
                        />
                    )}

                    {/* Wall Editor */}
                    {selectedWall && (
                        <WallEditor
                            wall={selectedWall}
                            onUpdateHeight={updateWallHeight}
                            onUpdateThickness={updateWallThickness}
                            onUpdateColor={updateWallColor}
                            onClose={() => setSelectedWall(null)}
                        />
                    )}

                    {/* Ana 3D Sahne */}
                    <div style={{
                        width: '100vw',
                        height: '100vh',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Status Bar */}
                        <div style={{
                            position: 'absolute',
                            top: '80px',
                            left: '20px',
                            right: '380px',
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
                            {rackPlacementMode && (
                                <>
                                    <span>•</span>
                                    <span style={{ color: modernTheme.colors.warning }}>
                                        📦 Raf yerleştirme modu aktif - tıklayarak yerleştirin
                                    </span>
                                </>
                            )}
                        </div>

                        {/* 3D Canvas */}
                        <Canvas
                            shadows
                            camera={{
                                position: cameraPosition,
                                fov: 60,
                                near: 0.1,
                                far: 1000
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                cursor: rackPlacementMode ? 'crosshair' : 'default'
                            }}
                            onClick={handleCanvasClick}
                        >
                            {/* Lighting */}
                            <ambientLight intensity={0.4} />
                            <directionalLight
                                position={[10, 10, 5]}
                                intensity={1}
                                castShadow
                                shadow-mapSize-width={2048}
                                shadow-mapSize-height={2048}
                                shadow-camera-far={50}
                                shadow-camera-left={-10}
                                shadow-camera-right={10}
                                shadow-camera-top={10}
                                shadow-camera-bottom={-10}
                            />
                            <pointLight position={[-10, -10, -10]} intensity={0.3} />

                            {/* Camera Controls */}
                            <OrbitControls
                                target={cameraTarget}
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                minDistance={2}
                                maxDistance={50}
                                maxPolarAngle={Math.PI / 2.1}
                                onChange={(e) => {
                                    if (e && e.target) {
                                        setCameraPosition([
                                            e.target.object.position.x,
                                            e.target.object.position.y,
                                            e.target.object.position.z
                                        ]);
                                    }
                                }}
                            />

                            {/* Environment */}
                            <Environment preset="warehouse" />

                            {/* Ground Handler */}
                            <ModernGroundHandler
                                showGrid={true}
                                gridSize={gridSize}
                                snapToGrid={snapToGrid}
                                gridSpacing={1}
                                onRackPlacement={handleRackPlacement}
                                rackPlacementMode={rackPlacementMode}
                                pendingRackConfig={pendingRackConfig}
                            />

                            {/* 3D Components */}
                            <Suspense fallback={
                                <Html center>
                                    <div style={{
                                        background: modernTheme.colors.primary,
                                        color: 'white',
                                        padding: '12px 20px',
                                        borderRadius: modernTheme.borderRadius.lg,
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        🔄 Yükleniyor...
                                    </div>
                                </Html>
                            }>
                                <ModernWarehouse {...warehouseProps} />

                                <ModernRackSystem {...rackSystemProps} />
                            </Suspense>
                        </Canvas>
                    </div>
                </>
            )}
        </>
    );
};

export default ModernScene;