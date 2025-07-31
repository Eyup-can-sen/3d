import React, { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Plane, Vector3, Raycaster, Vector2, Mesh } from 'three';
import { Html } from '@react-three/drei';
import { useAdvancedWarehouseBuilder } from '../../../hooks/useAdvancedWarehouseBuilder';
import { RackConfig } from '../Scene/ModernScene';
import { modernTheme } from '../UI/ModernTheme';

interface ModernGroundHandlerProps {
  showGrid?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  gridSpacing?: number;
  onRackPlacement?: (x: number, z: number) => void;
  rackPlacementMode?: boolean;
  pendingRackConfig?: RackConfig | null;
  // ÇIZIM PARAMETRELERINI SIL
}

export const ModernGroundHandler: React.FC<ModernGroundHandlerProps> = ({
  showGrid = true,
  gridSize = 50,
  snapToGrid = true,
  gridSpacing = 1,
  onRackPlacement,
  rackPlacementMode = false,
  pendingRackConfig
  // ÇIZIM PARAMETRELERINI SIL
}) => {
  const { camera, scene, gl } = useThree();
  const planeRef = useRef<Mesh>(null);
  const raycasterRef = useRef(new Raycaster());
  const mouseRef = useRef(new Vector2());
  
  const {
    mode,
    currentPlan,
    isDrawing,
    previewLine,
    updateMousePosition,
    addPoint
  } = useAdvancedWarehouseBuilder();

  const [mouseWorldPos, setMouseWorldPos] = React.useState({ x: 0, z: 0 });

  // Grid snap fonksiyonu
  const snapToGridPoint = useCallback((x: number, z: number) => {
    if (!snapToGrid) return { x, z };
    
    return {
      x: Math.round(x / gridSpacing) * gridSpacing,
      z: Math.round(z / gridSpacing) * gridSpacing
    };
  }, [snapToGrid, gridSpacing]);

  // Mouse pozisyon takibi
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!planeRef.current) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    
    const ground = new Plane(new Vector3(0, 1, 0), 0);
    const intersection = new Vector3();
    
    if (raycasterRef.current.ray.intersectPlane(ground, intersection)) {
      let { x, z } = snapToGridPoint(intersection.x, intersection.z);
      
      setMouseWorldPos({ x, z });
      updateMousePosition(x, z);
    }
  }, [camera, snapToGridPoint, updateMousePosition, gl.domElement]);

  // Click işleme - SADECE ESKİ SİSTEM
  const handleClick = useCallback((event: MouseEvent) => {
    if (mode === 'draw') {
      event.preventDefault();
      event.stopPropagation();
      
      const { x, z } = mouseWorldPos;
      addPoint(x, z);
    } else if (rackPlacementMode && onRackPlacement) {
      event.preventDefault();
      event.stopPropagation();
      
      const { x, z } = mouseWorldPos;
      onRackPlacement(x, z);
    }
  }, [mode, rackPlacementMode, mouseWorldPos, addPoint, onRackPlacement]);

  // Event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    const onMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        handleClick(e);
      }
    };
    
    canvas.addEventListener('mousemove', onMouseMove, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
    };
  }, [handleMouseMove, handleClick, gl]);

  return (
    <group>
      {/* Ground plane */}
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        visible={false}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Grid */}
      {showGrid && (
        <gridHelper
          args={[gridSize, gridSize / gridSpacing, modernTheme.colors.border.light, modernTheme.colors.border.light]}
          position={[0, 0, 0]}
        />
      )}

      {/* Raf yerleştirme önizlemesi */}
      {rackPlacementMode && pendingRackConfig && (
        <mesh position={[mouseWorldPos.x, pendingRackConfig.dimensions.height / 2, mouseWorldPos.z]}>
          <boxGeometry args={[
            pendingRackConfig.dimensions.width,
            pendingRackConfig.dimensions.height,
            pendingRackConfig.dimensions.depth
          ]} />
          <meshStandardMaterial 
            color={pendingRackConfig.color}
            transparent 
            opacity={0.5}
          />
        </mesh>
      )}

      {/* ESKİ SİSTEM - Noktaları göster */}
      {currentPlan.points.map((point, index) => (
        <group key={point.id}>
          <mesh position={[point.x, 0.2, point.z]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color={index === 0 ? modernTheme.colors.error : modernTheme.colors.primary}
              emissive={index === 0 ? modernTheme.colors.error : modernTheme.colors.primary}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ESKİ SİSTEM - Preview line */}
      {previewLine && mode === 'draw' && (
        <mesh
          position={[
            (previewLine.start.x + previewLine.end.x) / 2,
            0.05,
            (previewLine.start.z + previewLine.end.z) / 2
          ]}
          rotation={[0, Math.atan2(
            previewLine.end.z - previewLine.start.z,
            previewLine.end.x - previewLine.start.x
          ), 0]}
        >
          <boxGeometry args={[previewLine.distance, 0.02, 0.1]} />
          <meshBasicMaterial color={modernTheme.colors.accent} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

export default ModernGroundHandler;