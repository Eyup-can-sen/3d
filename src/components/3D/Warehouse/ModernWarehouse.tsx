import React, { useMemo } from 'react';
import { Shape, Vector3 } from 'three'; // Import Vector3 for Line component
import { Html, Line } from '@react-three/drei'; // Import Line
import { Point, Wall, DrawingMode, MousePosition } from '../../../hooks/useAdvancedWarehouseBuilder'; // Ensure these types are correctly imported
import { MeasurementDisplay } from '../UI/MeasurementDisplay';
import { modernTheme } from '../UI/ModernTheme';

// Extend the Point interface if it doesn't already have an optional 'id'
// For robust usage, consider defining these in a shared types file.
interface PointWithId extends Point {
    id: string;
}

// Extend the Wall interface if it doesn't already have an optional 'id' or 'length'
interface WallWithIdAndLength extends Wall {
    id: string;
    length: number;
}

// --- UPDATED INTERFACE FOR PROPS ---
export interface ModernWarehouseProps {
    points: Point[];
    walls: Wall[];
    height: number;
    isCompleted: boolean;
    showMeasurements: boolean;
    selectedPoint?: string | null;
    selectedWall?: string | null;
    onPointClick?: (pointId: string) => void;
    onWallClick?: (wallId: string) => void;
    // New props from ModernScene.tsx
    previewLine: { start: Point; end: MousePosition; distance: number; angle: number; } | null;
    mousePosition: MousePosition;
    mode: DrawingMode; // 'draw' | 'edit' | 'view' | 'rack'
    isDrawing: boolean;
}

export const ModernWarehouse: React.FC<ModernWarehouseProps> = ({
    points,
    walls,
    height,
    isCompleted,
    showMeasurements,
    selectedPoint,
    selectedWall,
    onPointClick,
    onWallClick,
    // Destructure new props
    previewLine,
    mousePosition,
    mode,
    isDrawing
}) => {
    // Wall thickness constant
    const WALL_THICKNESS = 0.25;

    // Process points with guaranteed IDs
    const processedPoints = useMemo((): PointWithId[] => {
        return points.map((point, index) => ({
            ...point,
            id: point.id || `point-${index}`
        }));
    }, [points]);

    // Process walls with guaranteed IDs and lengths
    const processedWalls = useMemo((): WallWithIdAndLength[] => {
        return walls.map((wall, index) => {
            const dx = wall.endPoint.x - wall.startPoint.x;
            const dz = wall.endPoint.z - wall.startPoint.z;
            const calculatedLength = Math.sqrt(dx * dx + dz * dz);

            return {
                ...wall,
                id: wall.id || `wall-${index}`,
                length: wall.length || calculatedLength
            };
        });
    }, [walls]);

    // Create floor shape for completed warehouse
    const floorShape = useMemo(() => {
        if (!isCompleted || points.length < 3) return null;

        const shape = new Shape();
        shape.moveTo(points[0].x, points[0].z);

        for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i].x, points[i].z);
        }

        shape.closePath();
        return shape;
    }, [points, isCompleted]);

    // Calculate centroid for HTML position
    const centroidPosition = useMemo(() => {
        if (processedPoints.length === 0) return [0, 0, 0] as [number, number, number];

        const sumX = processedPoints.reduce((sum, p) => sum + p.x, 0);
        const sumZ = processedPoints.reduce((sum, p) => sum + p.z, 0);
        return [sumX / processedPoints.length, height + 1, sumZ / processedPoints.length] as [number, number, number];
    }, [processedPoints, height]);


    return (
        <group>
            {/* Floor - only when completed */}
            {isCompleted && floorShape && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <shapeGeometry args={[floorShape]} />
                    <meshStandardMaterial
                        color={modernTheme.colors.background.secondary}
                        transparent
                        opacity={0.3}
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>
            )}

            {/* Points */}
            {processedPoints.map((point, index) => (
                <mesh
                    key={point.id}
                    position={[point.x, 0.15, point.z]}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPointClick?.(point.id);
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'default';
                    }}
                >
                    <cylinderGeometry args={[0.2, 0.3, 0.3, 12]} />
                    <meshStandardMaterial
                        color={selectedPoint === point.id ? modernTheme.colors.accent : modernTheme.colors.primary}
                        transparent
                        opacity={0.8}
                    />

                    {/* Point label */}
                    <Html position={[0, 0.4, 0]} center>
                        <div style={{
                            background: modernTheme.colors.primary,
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: modernTheme.borderRadius.sm,
                            fontSize: '10px',
                            fontWeight: '600'
                        }}>
                            P{index + 1}
                        </div>
                    </Html>
                </mesh>
            ))}

            {/* Walls - Render regardless of completion status, but visually distinguish */}
            {processedWalls.map((wall) => {
                const midX = (wall.startPoint.x + wall.endPoint.x) / 2;
                const midZ = (wall.startPoint.z + wall.endPoint.z) / 2;
                const dx = wall.endPoint.x - wall.startPoint.x;
                const dz = wall.endPoint.z - wall.startPoint.z;
                const angle = Math.atan2(dz, dx);

                const isSelected = selectedWall === wall.id;
                const wallColor = isSelected ? modernTheme.colors.accent : modernTheme.colors.text.primary;
                const wallOpacity = isCompleted ? 0.9 : 0.6; // More transparent during drawing

                return (
                    <group key={wall.id}>
                        {/* Main wall mesh */}
                        <mesh
                            position={[midX, height / 2, midZ]}
                            rotation={[0, angle, 0]}
                            onClick={(e) => {
                                e.stopPropagation();
                                onWallClick?.(wall.id);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                document.body.style.cursor = 'pointer';
                            }}
                            onPointerOut={() => {
                                document.body.style.cursor = 'default';
                            }}
                            castShadow
                            receiveShadow
                        >
                            <boxGeometry args={[wall.length, height, WALL_THICKNESS]} />
                            <meshStandardMaterial
                                color={wallColor}
                                transparent
                                opacity={wallOpacity}
                                roughness={isCompleted ? 0.6 : 0.8}
                                metalness={isCompleted ? 0.2 : 0.1}
                            />
                        </mesh>

                        {/* Wall top cap (only for completed walls for better visual finish) */}
                        {isCompleted && (
                            <mesh
                                position={[
                                    midX,
                                    height + WALL_THICKNESS / 2, // Position on top of the wall
                                    midZ
                                ]}
                                rotation={[0, angle, 0]}
                            >
                                <boxGeometry args={[wall.length + 0.05, WALL_THICKNESS / 2, WALL_THICKNESS + 0.05]} /> {/* Slightly wider cap */}
                                <meshStandardMaterial
                                    color={modernTheme.colors.text.primary} // A darker shade for contrast
                                    roughness={0.4}
                                    metalness={0.1}
                                />
                            </mesh>
                        )}
                    </group>
                );
            })}

            {/* Measurements - display on walls for both completed and incomplete */}
            {showMeasurements && (
                <MeasurementDisplay
                    walls={processedWalls}
                    points={processedPoints}
                    showMeasurements={showMeasurements}
                />
            )}

            {/* Warehouse info (for completed warehouse) */}
            {isCompleted && (
                <Html
                    position={centroidPosition}
                    center
                >
                    <div style={{
                        background: modernTheme.colors.background.main,
                        border: `1px solid ${modernTheme.colors.border.light}`,
                        borderRadius: modernTheme.borderRadius.lg,
                        padding: modernTheme.spacing.md,
                        boxShadow: modernTheme.shadows.lg,
                        fontSize: '12px',
                        color: modernTheme.colors.text.primary,
                        minWidth: '200px'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: '8px', color: modernTheme.colors.primary }}>
                            🏪 Depo Bilgileri
                        </div>
                        <div style={{ display: 'grid', gap: '4px' }}>
                            <div>📐 Yükseklik: {height.toFixed(1)}m</div>
                            <div>📊 Duvarlar: {processedWalls.length}</div>
                            <div>📍 Noktalar: {processedPoints.length}</div>
                            <div>
                                📏 Toplam Çevre: {processedWalls.reduce((sum, wall) => sum + wall.length, 0).toFixed(2)}m
                            </div>
                        </div>
                    </div>
                </Html>
            )}

            {/* Construction guides for incomplete warehouse */}
            {!isCompleted && (
                <group>
                    {/* Preview line from last point to current mouse position */}
                    {mode === 'draw' && isDrawing && previewLine && previewLine.start && mousePosition && (
                        <Line
                            points={[
                                new Vector3(previewLine.start.x, 0.05, previewLine.start.z),
                                new Vector3(mousePosition.x, 0.05, mousePosition.z)
                            ]}
                            color={modernTheme.colors.primary}
                            lineWidth={3}
                            dashed // Make it dashed to indicate it's a preview
                        />
                    )}

                    {/* Closure line from last point to first point, if enough points */}
                    {mode === 'draw' && processedPoints.length >= 2 && (
                        <Line
                            points={[
                                new Vector3(processedPoints[processedPoints.length - 1].x, 0.05, processedPoints[processedPoints.length - 1].z),
                                new Vector3(processedPoints[0].x, 0.05, processedPoints[0].z)
                            ]}
                            color={modernTheme.colors.warning}
                            lineWidth={2}
                            dashed
                            opacity={0.5}
                            transparent
                        />
                    )}

                    {/* Construction info */}
                    <Html
                        position={centroidPosition} // Use centroid for consistent positioning
                        center
                    >
                        <div style={{
                            background: `${modernTheme.colors.warning}15`,
                            border: `1px solid ${modernTheme.colors.warning}`,
                            borderRadius: modernTheme.borderRadius.md,
                            padding: modernTheme.spacing.sm,
                            fontSize: '11px',
                            color: modernTheme.colors.warning,
                            fontWeight: '600'
                        }}>
                            🚧 İnşaat Modunda<br />
                            {processedPoints.length < 3
                                ? `${3 - processedPoints.length} nokta daha gerekli`
                                : 'Tamamlamak için çizimi bitirin'
                            }
                        </div>
                    </Html>
                </group>
            )}

            {/* Grid helper for construction */}
            {!isCompleted && (
                <gridHelper
                    args={[50, 50, modernTheme.colors.border.light, modernTheme.colors.border.light]}
                    position={[0, 0, 0]}
                />
            )}
        </group>
    );
};

export default ModernWarehouse;