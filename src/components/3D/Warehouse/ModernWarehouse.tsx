import React, { useMemo } from 'react';
import { Shape } from 'three';
import { Html } from '@react-three/drei';
import { Point, Wall } from '../../../hooks/useAdvancedWarehouseBuilder';
import { MeasurementDisplay } from '../UI/MeasurementDisplay';
import { modernTheme } from '../UI/ModernTheme';

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
}

interface ProcessedWall extends Wall {
  id: string;
  length: number;
}

interface WallData {
  id: string;
  geometry: [number, number, number];
  position: [number, number, number];
  rotation: number;
  length: number;
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
  onWallClick
}) => {
  // Process points with guaranteed IDs
  const processedPoints = useMemo(() => {
    return points.map((point, index) => ({
      ...point,
      id: point.id || `point-${index}`
    }));
  }, [points]);

  // Process walls with guaranteed IDs and lengths
  const processedWalls = useMemo((): ProcessedWall[] => {
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

  // Create wall data for 3D rendering
  const wallData = useMemo((): WallData[] => {
    return processedWalls.map(wall => {
      const dx = wall.endPoint.x - wall.startPoint.x;
      const dz = wall.endPoint.z - wall.startPoint.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);
      
      return {
        id: wall.id,
        geometry: [length, height, 0.25] as [number, number, number],
        position: [
          (wall.startPoint.x + wall.endPoint.x) / 2,
          height / 2,
          (wall.startPoint.z + wall.endPoint.z) / 2
        ] as [number, number, number],
        rotation: angle,
        length
      };
    });
  }, [processedWalls, height]);

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

  const thickness = 0.25;

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

      {/* Walls */}
      {processedWalls.map((wall) => {
        const midX = (wall.startPoint.x + wall.endPoint.x) / 2;
        const midZ = (wall.startPoint.z + wall.endPoint.z) / 2;
        const dx = wall.endPoint.x - wall.startPoint.x;
        const dz = wall.endPoint.z - wall.startPoint.z;
        const angle = Math.atan2(dz, dx);

        return (
          <group key={wall.id}>
            {/* Main wall */}
            <mesh
              position={[midX, height / 2, midZ]}
              rotation={[0, angle, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onWallClick?.(wall.id);
              }}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[wall.length, height, thickness]} />
              <meshStandardMaterial 
                color={selectedWall === wall.id ? modernTheme.colors.accent : modernTheme.colors.text.primary}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Wall measurement indicator */}
            {showMeasurements && (
              <mesh position={[midX, 0.5, midZ]} rotation={[0, angle, 0]}>
                <boxGeometry args={[wall.length, 0.2, 0.1]} />
                <meshStandardMaterial 
                  color={selectedWall === wall.id ? modernTheme.colors.accent : modernTheme.colors.warning}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}

            {/* Wall base line */}
            <mesh position={[midX, 0.01, midZ]} rotation={[0, angle, 0]}>
              <boxGeometry args={[wall.length, 0.02, 0.15]} />
              <meshBasicMaterial 
                color={modernTheme.colors.primary}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        );
      })}

      {/* 3D Walls for completed warehouse */}
      {isCompleted && wallData.map((wall) => (
        <group key={`3d-${wall.id}`}>
          <mesh
            position={wall.position}
            rotation={[0, wall.rotation, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onWallClick?.(wall.id);
            }}
            castShadow
            receiveShadow
          >
            <boxGeometry args={wall.geometry} />
            <meshStandardMaterial 
              color={selectedWall === wall.id ? modernTheme.colors.accent : modernTheme.colors.text.primary}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>

          {/* Wall cap */}
          <mesh
            position={[
              wall.position[0],
              wall.position[1] + (wall.geometry[1] || 0) / 2,
              wall.position[2]
            ]}
            rotation={[0, wall.rotation, 0]}
          >
            <boxGeometry args={[
              wall.geometry[0] || 1, 
              0.1, 
              (wall.geometry[2] || 0) + 0.05
            ]} />
            <meshStandardMaterial 
              color={modernTheme.colors.text.primary}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Measurements */}
      {showMeasurements && (
        <MeasurementDisplay 
          walls={processedWalls} 
          points={processedPoints} 
          showMeasurements={showMeasurements}
        />
      )}

      {/* Warehouse info */}
      {isCompleted && (
        <Html
          position={[
            processedPoints.reduce((sum, p) => sum + p.x, 0) / processedPoints.length,
            height + 1,
            processedPoints.reduce((sum, p) => sum + p.z, 0) / processedPoints.length
          ]}
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
      {!isCompleted && processedPoints.length >= 2 && (
        <group>
          {/* Preview line from last point to first point (closure line) */}
          {processedPoints.length > 2 && (
            <mesh
              position={[
                (processedPoints[processedPoints.length - 1].x + processedPoints[0].x) / 2,
                0.05,
                (processedPoints[processedPoints.length - 1].z + processedPoints[0].z) / 2
              ]}
              rotation={[
                0,
                Math.atan2(
                  processedPoints[0].z - processedPoints[processedPoints.length - 1].z,
                  processedPoints[0].x - processedPoints[processedPoints.length - 1].x
                ),
                0
              ]}
            >
              <boxGeometry args={[
                Math.sqrt(
                  Math.pow(processedPoints[0].x - processedPoints[processedPoints.length - 1].x, 2) +
                  Math.pow(processedPoints[0].z - processedPoints[processedPoints.length - 1].z, 2)
                ),
                0.02,
                0.05
              ]} />
              <meshBasicMaterial 
                color={modernTheme.colors.warning}
                transparent
                opacity={0.5}
              />
            </mesh>
          )}

          {/* Construction info */}
          <Html
            position={[
              processedPoints.reduce((sum, p) => sum + p.x, 0) / processedPoints.length,
              1,
              processedPoints.reduce((sum, p) => sum + p.z, 0) / processedPoints.length
            ]}
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
              🚧 İnşaat Modunda<br/>
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