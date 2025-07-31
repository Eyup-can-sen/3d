// src/components/3D/Warehouse/ModernWarehouseCanvas.tsx
import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three'; // THREE kütüphanesini import et
import ModernGroundHandler from '../Controls/ModernGroundHandler';
import { ModernWarehouse } from './ModernWarehouse';
import { ModernRackSystem } from './ModernRackSystem';
import { modernTheme } from '../UI/ModernTheme';
import { RackConfig } from '../Scene/ModernScene'; // RackConfig arayüzünü import et

interface ModernWarehouseCanvasProps {
  rackPlacementMode: boolean;
  isDrawing: boolean;
  mode: string;
  handleCanvasClick: (e: any) => void; 
  mousePosition: { x: number; z: number };
  gridSize: number;
  snapToGrid: boolean;
  pendingRackConfig: RackConfig | null;
  warehouseProps: any; // ModernWarehouse bileşenine aktarılan props
  rackSystemProps: any; // ModernRackSystem bileşenine aktarılan props
  // YENİ: updateMousePosition'ı doğrudan bir prop olarak tanımlıyoruz
  updateMousePosition: (x: number, z: number) => void; 
}

const ModernWarehouseCanvas: React.FC<ModernWarehouseCanvasProps> = ({
  rackPlacementMode,
  isDrawing,
  mode,
  handleCanvasClick,
  mousePosition,
  gridSize,
  snapToGrid,
  pendingRackConfig,
  warehouseProps,
  rackSystemProps,
  updateMousePosition // YENİ: Prop olarak alıyoruz
}) => {
  const orbitControlsRef = useRef<any>(null);

  return (
    <Canvas
      camera={{ position: [0, 10, 15], fov: 60 }}
      shadows
      gl={{ antialias: true }}
      style={{ background: 'linear-gradient(135deg, #5f6875ff 20%, #484e57ff 100%)' }}
    >
      <Suspense fallback={<Html center>Loading...</Html>}>
        <Environment preset="city" /> 
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 7.5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Fare hareketini ve tıklamasını ModernGroundHandler'a devrediyoruz */}
        <ModernGroundHandler
          onGroundClick={handleCanvasClick} // Tıklama olayını ana işleyiciye gönder
          onPointerMove={(e) => {
            // ModernGroundHandler'dan gelen ThreeEvent<PointerEvent>'in point'ini kullan
            if (e.point) {
              updateMousePosition(e.point.x, e.point.z);
            }
          }} 
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />

        <ModernWarehouse {...warehouseProps} />
        <ModernRackSystem {...rackSystemProps} />

        {/* Raf yerleştirme önizlemesi */}
        {rackPlacementMode && pendingRackConfig && (
          <mesh position={[mousePosition.x, 0.05, mousePosition.z]} rotation-y={THREE.MathUtils.degToRad(pendingRackConfig.rotation || 0)}>
            <boxGeometry args={[pendingRackConfig.dimensions.width, pendingRackConfig.dimensions.height, pendingRackConfig.dimensions.depth]} />
            <meshStandardMaterial color={pendingRackConfig.color} opacity={0.5} transparent />
          </mesh>
        )}

      </Suspense>

      <OrbitControls ref={orbitControlsRef} makeDefault />
    </Canvas>
  );
};

export default ModernWarehouseCanvas;