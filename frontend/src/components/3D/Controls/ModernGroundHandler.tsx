// src/components/3D/Controls/ModernGroundHandler.tsx
import React, { useRef, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { type ThreeEvent } from '@react-three/fiber'; // ThreeEvent'i tip olarak import edin

interface ModernGroundHandlerProps {
  onGroundClick: (e: ThreeEvent<MouseEvent>) => void;
  onPointerMove: (e: ThreeEvent<PointerEvent>) => void;
  snapToGrid: boolean;
  gridSize: number;
}

const ModernGroundHandler: React.FC<ModernGroundHandlerProps> = ({
  onGroundClick,
  onPointerMove,
  snapToGrid,
  gridSize,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { scene } = useThree();

  // Fare basılı tutulduğunda başlangıç konumunu ve sürükleme durumunu tut
  const pointerDownRef = useRef<{ clientX: number; clientY: number } | null>(null);
  // `isDragging` durumu yalnızca UI geri bildirimi için kullanılabilir,
  // tıklama mantığı `handlePointerUp` içindeki mesafe kontrolüne bağlıdır.
  const [isDragging, setIsDragging] = useState(false); 

  const snapToGridPoint = useCallback((x: number, z: number) => {
    if (!snapToGrid) return new THREE.Vector3(x, 0, z);
    const spacing = 1; // 1 metrelik aralıklarla snap yap (ModernScene'deki snapToGridPoint ile uyumlu olmalı)
    return new THREE.Vector3(
      Math.round(x / spacing) * spacing,
      0,
      Math.round(z / spacing) * spacing
    );
  }, [snapToGrid]);

  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    // Fareye basıldığında başlangıç Client koordinatlarını kaydet
    pointerDownRef.current = { clientX: event.clientX, clientY: event.clientY };
    setIsDragging(false); // Başlangıçta sürükleme yok sayılır
  }, []);

  const handlePointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (pointerDownRef.current) {
      const dx = Math.abs(event.clientX - pointerDownRef.current.clientX);
      const dy = Math.abs(event.clientY - pointerDownRef.current.clientY);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Eğer fare başlangıç konumundan çok az kaydırıldıysa (eşik değeri 5 piksel),
      // bunu bir tıklama olarak kabul et ve `onGroundClick` prop'unu çağır.
      // Aksi takdirde, bu bir sürükleme işlemiydi ve tıklama yapma.
      const clickTolerance = 5; // Pixels
      if (distance < clickTolerance) {
        console.log("[ModernGroundHandler] Tıklama algılandı, onGroundClick çağrılıyor.");
        // ThreeEvent<PointerEvent>'ı ThreeEvent<MouseEvent>'e dönüştürüyoruz,
        // çünkü handleCanvasClick MouseEvent bekliyor olabilir.
        onGroundClick(event as ThreeEvent<MouseEvent>); 
      } else {
        console.log(`[ModernGroundHandler] Sürükleme sona erdi. Mesafe: ${distance.toFixed(2)}px`);
      }
    }
    // İşlem bitti, referansı ve sürükleme durumunu sıfırla
    pointerDownRef.current = null;
    setIsDragging(false); 
  }, [onGroundClick]);

  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    // Fare basılıyken hareket ediyorsa ve henüz sürükleme olarak işaretlenmediyse
    if (pointerDownRef.current && !isDragging) {
      const dx = Math.abs(event.clientX - pointerDownRef.current.clientX);
      const dy = Math.abs(event.clientY - pointerDownRef.current.clientY);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const dragThreshold = 5; // Eşik değeri kadar hareket ettiyse sürükleme olarak kabul et
      if (distance >= dragThreshold) { 
        setIsDragging(true); // Sürükleme başladı
        console.log(`[ModernGroundHandler] Sürükleme başladı. Hareket mesafesi: ${distance.toFixed(2)}px`);
      }
    }

    // Dünya koordinatlarında fare pozisyonunu gönder
    const intersection = event.intersections.find(i => i.object === meshRef.current);
    if (intersection) {
      const { x, z } = snapToGridPoint(intersection.point.x, intersection.point.z);
      // `onPointerMove`'a her zaman çağrı yaparız ki `previewLine` güncellenebilsin.
      onPointerMove({ ...event, point: new THREE.Vector3(x, 0, z) }); 
    }
  }, [onPointerMove, snapToGridPoint, isDragging]);

  return (
    <>
      <mesh
        ref={meshRef}
        rotation-x={-Math.PI / 2} // XZ düzleminde olması için döndür
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[gridSize, gridSize]} />
        {/* Materyali görünmez yapıyoruz, böylece sadece etkileşim için kullanılıyor */}
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0} /> 
      </mesh>
      <Grid
        args={[gridSize, gridSize]}
        sectionColor="#a0a0a0"
        cellColor="#e0e0e0"
        fadeDistance={100}
        position={[0, 0.01, 0]} // Zeminden biraz yukarıda göster
      />
    </>
  );
};

export default ModernGroundHandler;