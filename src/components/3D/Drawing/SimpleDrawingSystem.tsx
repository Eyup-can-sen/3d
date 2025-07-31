import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3, Raycaster, Vector2, Plane } from 'three';
import { Html } from '@react-three/drei';
import { modernTheme } from '../UI/ModernTheme';

type Tool = 'select' | 'line' | 'rectangle' | 'circle' | 'polygon' | 'door';

interface Point {
  x: number;
  z: number;
  id: string;
}

interface SimpleDrawingSystemProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const SimpleDrawingSystem: React.FC<SimpleDrawingSystemProps> = ({
  onComplete,
  onCancel
}) => {
  const { camera, gl } = useThree();
  const [tool, setTool] = useState<Tool>('select');
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<Point[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, z: 0 });
  const [height, setHeight] = useState(4);
  const [doors, setDoors] = useState<any[]>([]);

  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());

  // Mouse hareket
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const ground = new Plane(new Vector3(0, 1, 0), 0);
    const intersection = new Vector3();
    
    if (raycaster.current.ray.intersectPlane(ground, intersection)) {
      const x = Math.round(intersection.x);
      const z = Math.round(intersection.z);
      setMousePos({ x, z });
    }
  }, [camera, gl]);

  // Mouse tıklama
  const handleClick = useCallback((event: MouseEvent) => {
    if (tool === 'select') return;

    const newPoint: Point = {
      x: mousePos.x,
      z: mousePos.z,
      id: `point-${Date.now()}`
    };

    switch (tool) {
      case 'line':
        if (!isDrawing) {
          setTempPoints([newPoint]);
          setIsDrawing(true);
        } else {
          setPoints([...points, ...tempPoints, newPoint]);
          setTempPoints([]);
          setIsDrawing(false);
          setTool('select');
        }
        break;

      case 'rectangle':
        if (!isDrawing) {
          setTempPoints([newPoint]);
          setIsDrawing(true);
        } else {
          const start = tempPoints[0];
          const rectPoints = [
            start,
            { x: newPoint.x, z: start.z, id: `point-${Date.now()}-1` },
            newPoint,
            { x: start.x, z: newPoint.z, id: `point-${Date.now()}-2` }
          ];
          setPoints([...points, ...rectPoints]);
          setTempPoints([]);
          setIsDrawing(false);
          setTool('select');
        }
        break;

      case 'polygon':
        if (!isDrawing) {
          setTempPoints([newPoint]);
          setIsDrawing(true);
        } else {
          // Başlangıca yakın mı?
          const start = tempPoints[0];
          const distance = Math.sqrt(
            Math.pow(newPoint.x - start.x, 2) + Math.pow(newPoint.z - start.z, 2)
          );
          
          if (distance < 1.5 && tempPoints.length >= 3) {
            // Poligonu kapat
            setPoints([...points, ...tempPoints]);
            setTempPoints([]);
            setIsDrawing(false);
            setTool('select');
          } else {
            setTempPoints([...tempPoints, newPoint]);
          }
        }
        break;

      case 'circle':
        if (!isDrawing) {
          setTempPoints([newPoint]);
          setIsDrawing(true);
        } else {
          const center = tempPoints[0];
          const radius = Math.sqrt(
            Math.pow(newPoint.x - center.x, 2) + Math.pow(newPoint.z - center.z, 2)
          );
          
          // Daire noktaları oluştur
          const circlePoints: Point[] = [];
          const segments = 16;
          for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            circlePoints.push({
              x: center.x + radius * Math.cos(angle),
              z: center.z + radius * Math.sin(angle),
              id: `circle-${i}-${Date.now()}`
            });
          }
          
          setPoints([...points, ...circlePoints]);
          setTempPoints([]);
          setIsDrawing(false);
          setTool('select');
        }
        break;

      case 'door':
        // Kapı ekle
        const newDoor = {
          id: `door-${Date.now()}`,
          x: mousePos.x,
          z: mousePos.z,
          width: 1.0,
          height: 2.1
        };
        setDoors([...doors, newDoor]);
        break;
    }
  }, [tool, isDrawing, tempPoints, points, mousePos, doors]);

  // Event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleClick, gl]);

  // Tamamla
  const handleComplete = () => {
    if (points.length < 3) {
      alert('En az 3 nokta gerekli!');
      return;
    }

    const data = {
      points,
      doors,
      height,
      area: calculateArea(points)
    };

    onComplete(data);
  };

  // Alan hesapla
  const calculateArea = (pts: Point[]) => {
    if (pts.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].x * pts[j].z;
      area -= pts[j].x * pts[i].z;
    }
    return Math.abs(area) / 2;
  };

  return (
    <group>
      {/* Toolbar */}
      <Html position={[-20, 10, 0]} center>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          minWidth: '300px'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🏗️ Depo Çizim Araçları</h3>
          
          {/* Araç Butonları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
            {[
              { id: 'select', icon: '👆', name: 'Seç' },
              { id: 'line', icon: '📏', name: 'Çizgi' },
              { id: 'rectangle', icon: '▭', name: 'Kare' },
              { id: 'circle', icon: '⭕', name: 'Daire' },
              { id: 'polygon', icon: '🔶', name: 'Çokgen' },
              { id: 'door', icon: '🚪', name: 'Kapı' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as Tool)}
                style={{
                  padding: '10px',
                  border: tool === t.id ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '5px',
                  background: tool === t.id ? '#007bff' : 'white',
                  color: tool === t.id ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span style={{ fontSize: '16px' }}>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Yükseklik */}
          <div style={{ marginBottom: '15px' }}>
            <label>📏 Yükseklik: {height}m</label>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              style={{ width: '100%', marginTop: '5px' }}
            />
          </div>

          {/* Butonlar */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              ❌ İptal
            </button>
            <button
              onClick={handleComplete}
              disabled={points.length < 3}
              style={{
                flex: 2,
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                background: points.length >= 3 ? '#28a745' : '#ddd',
                color: points.length >= 3 ? 'white' : '#666',
                cursor: points.length >= 3 ? 'pointer' : 'not-allowed'
              }}
            >
              ✅ Depoyu Oluştur
            </button>
          </div>

          {/* Bilgi */}
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            📍 Nokta: {points.length} | 🚪 Kapı: {doors.length}
            {points.length >= 3 && <div>📊 Alan: {calculateArea(points).toFixed(1)} m²</div>}
          </div>
        </div>
      </Html>

      {/* Grid */}
      <gridHelper args={[50, 50, '#ddd', '#ddd']} />

      {/* Mouse pozisyon göstergesi */}
      {tool !== 'select' && (
        <mesh position={[mousePos.x, 0.1, mousePos.z]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      )}

      {/* Geçici noktalar */}
      {tempPoints.map((point, index) => (
        <mesh key={point.id} position={[point.x, 0.2, point.z]}>
          <sphereGeometry args={[0.3]} />
          <meshBasicMaterial color="#ffd93d" />
        </mesh>
      ))}

      {/* Tamamlanmış noktalar */}
      {points.map((point, index) => (
        <group key={point.id}>
          <mesh position={[point.x, 0.3, point.z]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial color={index === 0 ? "#ff6b6b" : "#6bcf7f"} />
          </mesh>
          <Html position={[point.x, 0.8, point.z]} center>
            <div style={{
              background: index === 0 ? "#ff6b6b" : "#6bcf7f",
              color: 'white',
              padding: '2px 6px',
              borderRadius: '50%',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
          </Html>
        </group>
      ))}

      {/* Duvarlar */}
      {points.length > 1 && points.map((point, index) => {
        const nextPoint = points[(index + 1) % points.length];
        if (!nextPoint) return null;

        const midX = (point.x + nextPoint.x) / 2;
        const midZ = (point.z + nextPoint.z) / 2;
        const length = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.z - point.z, 2)
        );
        const angle = Math.atan2(nextPoint.z - point.z, nextPoint.x - point.x);

        return (
          <mesh
            key={`wall-${index}`}
            position={[midX, height / 2, midZ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[length, height, 0.3]} />
            <meshStandardMaterial color="#95a5a6" transparent opacity={0.8} />
          </mesh>
        );
      })}

      {/* Kapılar */}
      {doors.map(door => (
        <group key={door.id}>
          <mesh position={[door.x, door.height / 2, door.z]}>
            <boxGeometry args={[door.width, door.height, 0.1]} />
            <meshStandardMaterial color="#e67e22" />
          </mesh>
          <Html position={[door.x, door.height + 0.5, door.z]} center>
            <div style={{
              background: '#e67e22',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '10px'
            }}>
              🚪 {door.width}m
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};