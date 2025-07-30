import React from 'react';
import { Html } from '@react-three/drei';
import { Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { modernTheme } from '../UI/ModernTheme';

interface ModernRackProps {
  rack: Rack;
  isSelected: boolean;
  onClick: () => void;
  showMeasurements: boolean;
}

export const ModernRack: React.FC<ModernRackProps> = ({
  rack,
  isSelected,
  onClick,
  showMeasurements
}) => {
  const rackColor = rack.type === 'pallet' 
    ? modernTheme.colors.accent 
    : rack.type === 'shelf' 
      ? modernTheme.colors.success 
      : modernTheme.colors.warning;

  return (
    <group
      position={[rack.position.x, rack.position.y, rack.position.z]}
      rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Ana raf yapısı */}
      <mesh
        position={[0, rack.dimensions.height / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[
          rack.dimensions.width,
          rack.dimensions.height,
          rack.dimensions.depth
        ]} />
        <meshStandardMaterial
          color={isSelected ? modernTheme.colors.primary : rackColor}
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>

      {/* Raf seviyeleri */}
      {Array.from({ length: rack.levels }, (_, i) => (
        <mesh
          key={`level-${i}`}
          position={[
            0,
            (rack.dimensions.height / rack.levels) * (i + 0.5),
            0
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[
            rack.dimensions.width,
            0.1,
            rack.dimensions.depth
          ]} />
          <meshStandardMaterial
            color={modernTheme.colors.text.primary}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Dikey destekler */}
      {[
        [-rack.dimensions.width/2, 0, -rack.dimensions.depth/2],
        [rack.dimensions.width/2, 0, -rack.dimensions.depth/2],
        [rack.dimensions.width/2, 0, rack.dimensions.depth/2],
        [-rack.dimensions.width/2, 0, rack.dimensions.depth/2]
      ].map((pos, i) => (
        <mesh
          key={`support-${i}`}
          position={[pos[0], rack.dimensions.height/2, pos[2]]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.05, rack.dimensions.height, 8]} />
          <meshStandardMaterial color={modernTheme.colors.text.primary} />
        </mesh>
      ))}

      {/* Ölçüm etiketleri */}
      {showMeasurements && (
        <Html
          position={[0, rack.dimensions.height + 0.5, 0]}
          center
          occlude
        >
          <div style={{
            background: modernTheme.colors.background.panel,
            border: `1px solid ${modernTheme.colors.border.light}`,
            borderRadius: modernTheme.borderRadius.sm,
            padding: '4px 8px',
            fontSize: '10px',
            color: modernTheme.colors.text.primary,
            textAlign: 'center',
            boxShadow: modernTheme.shadows.sm
          }}>
            {rack.dimensions.width}×{rack.dimensions.depth}×{rack.dimensions.height}m
          </div>
        </Html>
      )}
    </group>
  );
};