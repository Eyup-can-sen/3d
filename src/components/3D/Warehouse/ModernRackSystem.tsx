import React from 'react';
import { Html } from '@react-three/drei';
import { Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { modernTheme } from '../UI/ModernTheme';

export interface ModernRackSystemProps {
  racks: Array<Rack & { isSelected: boolean }>;
  cargos: any[];
  selectedRack: string | null;
  selectedCargo?: any;
  onRackClick: (rackId: string) => void;
  onRackUpdate?: (rackId: string, updates: any) => void;
  onCargoClick?: (cargoId: string) => void;
  showLabels?: boolean;
  showCapacity?: boolean;
  showMeasurements?: boolean;
  animateMovement?: boolean;
  isPointInside: (x: number, z: number) => boolean;
}

export const ModernRackSystem: React.FC<ModernRackSystemProps> = ({
  racks,
  cargos,
  selectedRack,
  selectedCargo,
  onRackClick,
  onRackUpdate,
  onCargoClick,
  showLabels = true,
  showCapacity = true,
  showMeasurements = false,
  animateMovement = true,
  isPointInside
}) => {
  return (
    <group>
      {racks.map((rack) => (
        <group key={rack.id}>
          {/* Raf ana yapısı */}
          <mesh
            position={[rack.position.x, rack.dimensions.height / 2, rack.position.z]}
            rotation={[0, rack.rotation, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onRackClick(rack.id);
            }}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[
              rack.dimensions.width,
              rack.dimensions.height,
              rack.dimensions.depth
            ]} />
            <meshStandardMaterial 
              color={rack.isSelected ? modernTheme.colors.accent : rack.color}
              transparent
              opacity={0.8}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Raf seviyeleri */}
          {Array.from({ length: rack.levels }, (_, level) => (
            <mesh
              key={level}
              position={[
                rack.position.x,
                (rack.dimensions.height / rack.levels) * (level + 0.5),
                rack.position.z
              ]}
              rotation={[0, rack.rotation, 0]}
            >
              <boxGeometry args={[
                rack.dimensions.width,
                0.05,
                rack.dimensions.depth
              ]} />
              <meshStandardMaterial 
                color="#666"
                roughness={0.8}
                metalness={0.2}
              />
            </mesh>
          ))}

          {/* Raf etiketleri */}
          {showLabels && (
            <Html
              position={[
                rack.position.x,
                rack.dimensions.height + 0.5,
                rack.position.z
              ]}
              center
            >
              <div style={{
                background: rack.isSelected ? modernTheme.colors.accent : modernTheme.colors.primary,
                color: 'white',
                padding: '4px 8px',
                borderRadius: modernTheme.borderRadius.sm,
                fontSize: '10px',
                fontWeight: '600',
                textAlign: 'center',
                minWidth: '60px'
              }}>
                📦 {rack.type.toUpperCase()}<br/>
                {showCapacity && `${rack.capacity} kapasite`}
              </div>
            </Html>
          )}

          {/* Seçili raf highlight */}
          {rack.isSelected && (
            <mesh
              position={[rack.position.x, 0.01, rack.position.z]}
              rotation={[-Math.PI / 2, 0, rack.rotation]}
            >
              <ringGeometry args={[
                Math.max(rack.dimensions.width, rack.dimensions.depth) / 2,
                Math.max(rack.dimensions.width, rack.dimensions.depth) / 2 + 0.2,
                32
              ]} />
              <meshBasicMaterial 
                color={modernTheme.colors.accent}
                transparent
                opacity={0.5}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Kargo kutuları */}
      {cargos.map((cargo, index) => (
        <mesh
          key={cargo.id || index}
          position={[
            cargo.position?.x || 0,
            cargo.position?.y || 0.5,
            cargo.position?.z || 0
          ]}
          onClick={(e) => {
            e.stopPropagation();
            onCargoClick?.(cargo.id);
          }}
          castShadow
        >
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial 
            color={cargo.id === selectedCargo ? modernTheme.colors.warning : '#8b4513'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

export {};