import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Vector3, Vector2, Raycaster } from 'three';
import { Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { modernTheme } from '../UI/ModernTheme';

interface RackTransformControlsProps {
    rack: Rack;
    isSelected: boolean;
    snapToGrid: boolean;
    gridSize: number;
    onUpdate: (updates: Partial<Rack>) => void;
    isPointInside: (x: number, z: number) => boolean;
}

export const RackTransformControls: React.FC<RackTransformControlsProps> = ({
    rack,
    isSelected,
    snapToGrid,
    gridSize,
    onUpdate,
    isPointInside
}) => {
    const { camera, gl } = useThree();
    const [isDragging, setIsDragging] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState<Vector3 | null>(null);
    const [isValidPosition, setIsValidPosition] = useState(true);
    const [resizeAxis, setResizeAxis] = useState<'width' | 'depth' | null>(null);

    const raycaster = useRef(new Raycaster());

    const handlePointerDown = (e: any, mode: 'move' | 'rotate' | 'resize', axis?: 'width' | 'depth') => {
        e.stopPropagation();

        if (mode === 'move') {
            setIsDragging(true);
            setDragStart(new Vector3(rack.position.x, 0, rack.position.z));
            gl.domElement.style.cursor = 'grabbing';
        } else if (mode === 'rotate') {
            setIsRotating(true);
            gl.domElement.style.cursor = 'crosshair';
        } else if (mode === 'resize' && axis) {
            setIsResizing(true);
            setResizeAxis(axis);
            gl.domElement.style.cursor = axis === 'width' ? 'ew-resize' : 'ns-resize';
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        setIsRotating(false);
        setIsResizing(false);
        setResizeAxis(null);
        setDragStart(null);
        gl.domElement.style.cursor = 'default';
    };

    const handlePointerMove = (e: any) => {
        if (!isDragging && !isRotating && !isResizing) return;

        if (isDragging && dragStart) {
            // Daha hassas hareket için multiplier'ı azalttık
            let newX = rack.position.x + (e.movementX || 0) * 0.05;
            let newZ = rack.position.z - (e.movementY || 0) * 0.05;

            if (snapToGrid) {
                newX = Math.round(newX / gridSize) * gridSize;
                newZ = Math.round(newZ / gridSize) * gridSize;
            }

            const valid = isPointInside(newX, newZ);
            setIsValidPosition(valid);

            if (valid) {
                onUpdate({
                    position: { x: newX, y: rack.position.y, z: newZ }
                });
            }
        }

        if (isRotating) {
            // Daha hassas rotasyon
            const rotationDelta = (e.movementX || 0) * 1;
            let newRotation = rack.rotation + rotationDelta;

            if (snapToGrid) {
                newRotation = Math.round(newRotation / 15) * 15;
            }

            if (newRotation < 0) newRotation += 360;
            if (newRotation >= 360) newRotation -= 360;

            onUpdate({ rotation: newRotation });
        }

        if (isResizing && resizeAxis) {
            const delta = (e.movementX || 0) * 0.02;
            const currentDimensions = rack.dimensions;

            if (resizeAxis === 'width') {
                const newWidth = Math.max(0.5, Math.min(10, currentDimensions.width + delta));
                onUpdate({
                    dimensions: { ...currentDimensions, width: newWidth }
                });
            } else if (resizeAxis === 'depth') {
                const newDepth = Math.max(0.5, Math.min(10, currentDimensions.depth + delta));
                onUpdate({
                    dimensions: { ...currentDimensions, depth: newDepth }
                });
            }
        }
    };

    useEffect(() => {
        if (!isSelected || (!isDragging && !isRotating && !isResizing)) return;

        const handleMove = (e: MouseEvent) => handlePointerMove(e);
        const handleUp = () => handlePointerUp();

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [isSelected, isDragging, isRotating, isResizing, dragStart, rack.position, rack.rotation, rack.dimensions]);

    if (!isSelected) return null;

    return (
        <group position={[rack.position.x, rack.position.y, rack.position.z]}>
            {/* Selection outline - daha ince */}
            <mesh
                position={[0, rack.dimensions.height / 2, 0]}
                rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
            >
                <boxGeometry args={[
                    rack.dimensions.width + 0.1,
                    rack.dimensions.height + 0.1,
                    rack.dimensions.depth + 0.1
                ]} />
                <meshBasicMaterial
                    color={modernTheme.colors.primary}
                    transparent
                    opacity={0.3}
                    wireframe
                />
            </mesh>

            {/* Ground indicator - daha büyük */}
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, (rack.rotation * Math.PI) / 180]}>
                <ringGeometry args={[
                    Math.max(rack.dimensions.width, rack.dimensions.depth) / 2,
                    Math.max(rack.dimensions.width, rack.dimensions.depth) / 2 + 0.2
                ]} />
                <meshBasicMaterial
                    color={isValidPosition ? modernTheme.colors.success : modernTheme.colors.error}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Move handle - daha büyük ve görünür */}
            <mesh
                position={[0, rack.dimensions.height + 0.3, 0]}
                onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshBasicMaterial
                    color={isDragging ? modernTheme.colors.warning : modernTheme.colors.primary}
                />
            </mesh>

            {/* Move handle label */}
            <Html position={[0, rack.dimensions.height + 0.6, 0]} center>
                <div style={{
                    background: modernTheme.colors.primary,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: modernTheme.borderRadius.sm,
                    fontSize: '9px',
                    fontWeight: '600'
                }}>
                    🚚 TAŞI
                </div>
            </Html>

            {/* Rotation handle - yan tarafta */}
            <mesh
                position={[rack.dimensions.width / 2 + 0.5, rack.dimensions.height / 2, 0]}
                rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
                onPointerDown={(e) => handlePointerDown(e, 'rotate')}
            >
                <torusGeometry args={[0.2, 0.08, 8, 16]} />
                <meshBasicMaterial
                    color={isRotating ? modernTheme.colors.warning : modernTheme.colors.accent}
                />
            </mesh>

            {/* Rotation handle label */}
            <Html position={[rack.dimensions.width / 2 + 0.5, rack.dimensions.height / 2 + 0.4, 0]} center>
                <div style={{
                    background: modernTheme.colors.accent,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: modernTheme.borderRadius.sm,
                    fontSize: '9px',
                    fontWeight: '600'
                }}>
                    🔄 ÇEVİR
                </div>
            </Html>

            {/* Resize handles */}
            {/* Width resize */}
            <mesh
                position={[rack.dimensions.width / 2 + 0.2, 0.5, 0]}
                rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
                onPointerDown={(e) => handlePointerDown(e, 'resize', 'width')}
            >
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshBasicMaterial
                    color={isResizing && resizeAxis === 'width' ? modernTheme.colors.warning : modernTheme.colors.success}
                />
            </mesh>

            {/* Depth resize */}
            <mesh
                position={[0, 0.5, rack.dimensions.depth / 2 + 0.2]}
                rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
                onPointerDown={(e) => handlePointerDown(e, 'resize', 'depth')}
            >
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshBasicMaterial
                    color={isResizing && resizeAxis === 'depth' ? modernTheme.colors.warning : modernTheme.colors.success}
                />
            </mesh>

            {/* Info display - daha kompakt */}
            <Html
                position={[0, rack.dimensions.height + 1, 0]}
                center
            >
                <div style={{
                    background: modernTheme.colors.background.panel,
                    border: `1px solid ${modernTheme.colors.border.light}`,
                    borderRadius: modernTheme.borderRadius.sm,
                    padding: '6px 8px',
                    fontSize: '10px',
                    color: modernTheme.colors.text.primary,
                    textAlign: 'center',
                    minWidth: '100px',
                    boxShadow: modernTheme.shadows.sm
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                        📦 {rack.type === 'pallet' ? 'Palet' : rack.type === 'shelf' ? 'Klasik' : 'Konsol'}
                    </div>
                    <div style={{ fontSize: '9px', color: modernTheme.colors.text.secondary }}>
                        📐 {rack.dimensions.width.toFixed(1)}×{rack.dimensions.depth.toFixed(1)}×{rack.dimensions.height.toFixed(1)}m
                    </div>
                    <div style={{ fontSize: '9px', color: modernTheme.colors.text.secondary }}>
                        📍 ({rack.position.x.toFixed(1)}, {rack.position.z.toFixed(1)}) • {rack.rotation}°
                    </div>
                    {(isDragging || isRotating || isResizing) && (
                        <div style={{
                            fontSize: '9px',
                            color: isDragging && !isValidPosition ? modernTheme.colors.error : modernTheme.colors.success,
                            fontWeight: '600',
                            marginTop: '2px'
                        }}>
                            {isDragging && (isValidPosition ? '✅ Geçerli' : '❌ Geçersiz')}
                            {isRotating && '🔄 Çevriliyor'}
                            {isResizing && `📏 ${resizeAxis === 'width' ? 'Genişlik' : 'Derinlik'} değişiyor`}
                        </div>
                    )}
                </div>
            </Html>

            {/* Kontrol ipuçları */}
            {!isDragging && !isRotating && !isResizing && (
                <Html position={[0, -0.5, 0]} center>
                    <div style={{
                        background: modernTheme.colors.background.secondary,
                        border: `1px solid ${modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.sm,
                        padding: '4px 6px',
                        fontSize: '8px',
                        color: modernTheme.colors.text.secondary,
                        textAlign: 'center'
                    }}>
                        🔵 Taşı • 🟣 Çevir • 🟢 Boyutlandır
                    </div>
                </Html>
            )}
        </group>
    );
};