import React from 'react';
import { Plane } from '@react-three/drei';

interface WarehouseFloorProps {
  width?: number;
  depth?: number;
}

export const WarehouseFloor: React.FC<WarehouseFloorProps> = ({ 
  width = 50, 
  depth = 30 
}) => {
  return (
    <group>
      {/* Ana zemin */}
      <Plane
        args={[width, depth]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#cccccc" 
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>
      
      {/* Duvar sınırları */}
      {/* Ön duvar */}
      <Plane
        args={[width, 8]}
        position={[0, 4, -depth/2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#666666" />
      </Plane>
      
      {/* Arka duvar */}
      <Plane
        args={[width, 8]}
        position={[0, 4, depth/2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#666666" />
      </Plane>
      
      {/* Sol duvar */}
      <Plane
        args={[depth, 8]}
        position={[-width/2, 4, 0]}
        rotation={[0, Math.PI/2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#666666" />
      </Plane>
      
      {/* Sağ duvar */}
      <Plane
        args={[depth, 8]}
        position={[width/2, 4, 0]}
        rotation={[0, -Math.PI/2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#666666" />
      </Plane>
    </group>
  );
};