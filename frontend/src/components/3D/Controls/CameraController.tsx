import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  target?: Vector3;
  autoRotate?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({ 
  target, 
  autoRotate = false 
}) => {
  const { camera } = useThree();
  const targetRef = useRef(target || new Vector3(0, 0, 0));
  
  useFrame((state) => {
    if (autoRotate) {
      // Otomatik dönüş
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 20;
      state.camera.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 20;
      state.camera.lookAt(targetRef.current);
    }
  });

  return null;
};