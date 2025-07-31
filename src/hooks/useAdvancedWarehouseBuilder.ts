// useAdvancedWarehouseBuilder.ts - TAM KOD
import { useState, useCallback, useRef } from 'react';

export interface Point {
  x: number;
  z: number;
  id: string;
}

export type Point2D = Point;

export interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height: number;
  material: string;
  color: string;
  length: number;
  angle: number;
}

export type WallSegment = Wall;

export interface WarehousePlan {
  id: string;
  name: string;
  points: Point[];
  walls: Wall[];
  height: number;
  isCompleted: boolean;
  area?: number;
  createdAt: string;
  lastModified: string;
}

export type DrawingMode = 'draw' | 'edit' | 'view' | 'wall-edit' | 'rack';
export type RackType = 'pallet' | 'shelf' | 'cantilever';
export type DrawingShape = 'polygon' | 'circle' | 'line';

export interface Rack {
  id: string;
  type: RackType;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  rotation: number;
  levels: number;
  capacity: number;
  material: string;
  color: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  notes: string;
}

export interface MousePosition {
  x: number;
  z: number;
  distance?: number;
  angle?: number;
}

export interface DrawingInfo {
  distance: number;
  angle: number;
  position: { x: number, z: number };
  isClosing: boolean;
  canClose: boolean;
}

export interface DoorOpening {
  id: string;
  wallId: string;
  startPosition: number;
  width: number;
  height: number;
  type: 'door' | 'window' | 'gate';
}

export const useAdvancedWarehouseBuilder = () => {
  const [currentPlan, setCurrentPlan] = useState<WarehousePlan>({
    id: 'default',
    name: 'Yeni Depo',
    points: [],
    walls: [],
    height: 4,
    isCompleted: false,
    area: 0,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const [mode, setMode] = useState<DrawingMode>('view');
  const [selectedWall, setSelectedWall] = useState<Wall | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [selectedRack, setSelectedRack] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, z: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewLine, setPreviewLine] = useState<{
    start: Point;
    end: MousePosition;
    distance: number;
    angle: number;
  } | null>(null);

  const [racks, setRacks] = useState<Rack[]>([]);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(50);

  // Yeni state'ler
  const [drawingShape, setDrawingShape] = useState<DrawingShape>('polygon');
  const [drawingInfo, setDrawingInfo] = useState<DrawingInfo | null>(null);
  const [doorOpenings, setDoorOpenings] = useState<DoorOpening[]>([]);
  const [circleRadius, setCircleRadius] = useState(0);

  const drawingStateRef = useRef({ isDrawing: false, startPoint: null as Point | null });

  const calculateArea = useCallback((points: Point[]) => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].z;
      area -= points[j].x * points[i].z;
    }
    return Math.abs(area) / 2;
  }, []);

  const updateMousePosition = useCallback((x: number, z: number) => {
    setMousePosition({ x, z });

    if (mode === 'draw' && currentPlan.points.length > 0 && isDrawing) {
      const lastPoint = currentPlan.points[currentPlan.points.length - 1];
      const firstPoint = currentPlan.points[0];
      const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(z - lastPoint.z, 2));
      const angle = Math.atan2(z - lastPoint.z, x - lastPoint.x) * (180 / Math.PI);

      // Başlangıç noktasına yakınlık kontrolü
      const distanceToStart = Math.sqrt(
        Math.pow(x - firstPoint.x, 2) + Math.pow(z - firstPoint.z, 2)
      );
      const canClose = distanceToStart < 1.0 && currentPlan.points.length >= 3;

      // Daire modu için yarıçap
      if (drawingShape === 'circle' && currentPlan.points.length === 1) {
        setCircleRadius(distance);
      }

      // Preview line güncellemesi
      setPreviewLine({
        start: lastPoint,
        end: { x, z, distance, angle },
        distance,
        angle: angle >= 0 ? angle : angle + 360
      });

      // Dinamik bilgi güncelleme
      setDrawingInfo({
        distance,
        angle: angle >= 0 ? angle : angle + 360,
        position: { x, z },
        isClosing: canClose,
        canClose
      });
    }
  }, [mode, currentPlan.points, isDrawing, drawingShape]);

  const completeCircle = useCallback((endX: number, endZ: number) => {
    const centerPoint = currentPlan.points[0];
    const radius = Math.sqrt(
      Math.pow(endX - centerPoint.x, 2) + Math.pow(endZ - centerPoint.z, 2)
    );
    
    const segments = Math.max(12, Math.floor(radius * 8));
    const points: Point[] = [];
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const x = centerPoint.x + radius * Math.cos(angle);
      const z = centerPoint.z + radius * Math.sin(angle);
      points.push({
        x, z,
        id: `circle-point-${i}-${Date.now()}`
      });
    }
    
    setCurrentPlan(prev => ({
      ...prev,
      points: points,
      walls: createWallsFromPoints(points, prev.height),
      isCompleted: true,
      area: Math.PI * radius * radius,
      lastModified: new Date().toISOString()
    }));
    
    setIsDrawing(false);
    setDrawingShape('polygon');
    setDrawingInfo(null);
    setMode('view');
    setCircleRadius(0);
  }, [currentPlan.points]);

  const addPoint = useCallback((x: number, z: number) => {
    if (mode !== 'draw') return;

    const newPoint: Point = {
      x,
      z,
      id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Daire modu
    if (drawingShape === 'circle') {
      if (currentPlan.points.length === 0) {
        // Merkez noktası
        setCurrentPlan(prev => ({
          ...prev,
          points: [newPoint],
          lastModified: new Date().toISOString()
        }));
        setIsDrawing(true);
        drawingStateRef.current.isDrawing = true;
        drawingStateRef.current.startPoint = newPoint;
        return;
      } else if (currentPlan.points.length === 1) {
        // Daire tamamlama
        completeCircle(x, z);
        return;
      }
    }

    // Polygon modu
    if (currentPlan.points.length === 0) {
      setCurrentPlan(prev => ({
        ...prev,
        points: [newPoint],
        lastModified: new Date().toISOString()
      }));
      setIsDrawing(true);
      drawingStateRef.current.isDrawing = true;
      drawingStateRef.current.startPoint = newPoint;
      return;
    }

    const firstPoint = currentPlan.points[0];
    const distanceToStart = Math.sqrt(
      Math.pow(x - firstPoint.x, 2) + Math.pow(z - firstPoint.z, 2)
    );

    if (distanceToStart < 1.0 && currentPlan.points.length >= 3) {
      completeDrawing();
      return;
    }

    setCurrentPlan(prev => {
      const updatedPoints = [...prev.points, newPoint];
      const walls = createWallsFromPoints(updatedPoints, prev.height);
      
      return {
        ...prev,
        points: updatedPoints,
        walls,
        lastModified: new Date().toISOString()
      };
    });
  }, [mode, currentPlan.points, drawingShape, completeCircle]);

  const createWallsFromPoints = useCallback((points: Point[], height: number) => {
    if (points.length < 2) return [];

    const walls: Wall[] = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const startPoint = points[i];
      const endPoint = points[i + 1];
      
      const dx = endPoint.x - startPoint.x;
      const dz = endPoint.z - startPoint.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx) * (180 / Math.PI);

      walls.push({
        id: `wall-${i}-${Date.now()}`,
        startPoint,
        endPoint,
        thickness: 0.25,
        height,
        material: 'concrete',
        color: '#8e9aaf',
        length,
        angle: angle >= 0 ? angle : angle + 360
      });
    }

    return walls;
  }, []);

  const completeDrawing = useCallback(() => {
    if (currentPlan.points.length < 3) {
      alert('⚠️ En az 3 nokta gerekli!');
      return;
    }

    const lastPoint = currentPlan.points[currentPlan.points.length - 1];
    const firstPoint = currentPlan.points[0];
    
    const dx = firstPoint.x - lastPoint.x;
    const dz = firstPoint.z - lastPoint.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx) * (180 / Math.PI);

    const closingWall: Wall = {
      id: `wall-closing-${Date.now()}`,
      startPoint: lastPoint,
      endPoint: firstPoint,
      thickness: 0.25,
      height: currentPlan.height,
      material: 'concrete',
      color: '#8e9aaf',
      length,
      angle: angle >= 0 ? angle : angle + 360
    };

    const area = calculateArea(currentPlan.points);

    setCurrentPlan(prev => ({
      ...prev,
      walls: [...prev.walls, closingWall],
      isCompleted: true,
      area,
      lastModified: new Date().toISOString()
    }));

    setMode('view');
    setIsDrawing(false);
    setPreviewLine(null);
    setDrawingInfo(null);
    drawingStateRef.current.isDrawing = false;
    drawingStateRef.current.startPoint = null;
  }, [currentPlan.points, currentPlan.height, calculateArea]);

  const cancelDrawing = useCallback(() => {
    setCurrentPlan(prev => ({
      ...prev,
      points: [],
      walls: [],
      isCompleted: false,
      area: 0,
      lastModified: new Date().toISOString()
    }));
    setMode('view');
    setIsDrawing(false);
    setPreviewLine(null);
    setDrawingInfo(null);
    setDrawingShape('polygon');
    setCircleRadius(0);
    drawingStateRef.current.isDrawing = false;
    drawingStateRef.current.startPoint = null;
  }, []);

  const startNewDrawing = useCallback(() => {
    setCurrentPlan({
      id: `plan-${Date.now()}`,
      name: 'Yeni Depo',
      points: [],
      walls: [],
      height: 4,
      isCompleted: false,
      area: 0,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });
    setMode('draw');
    setSelectedWall(null);
    setSelectedPoint(null);
    setIsDrawing(false);
    setPreviewLine(null);
    setDrawingInfo(null);
    setDrawingShape('polygon');
    setCircleRadius(0);
  }, []);

  const addDoorOpening = useCallback((wallId: string, position: number, width: number) => {
    const newDoor: DoorOpening = {
      id: `door-${Date.now()}`,
      wallId,
      startPosition: position,
      width,
      height: 2.5,
      type: 'door'
    };
    setDoorOpenings(prev => [...prev, newDoor]);
  }, []);

  const updateAllWallsHeight = useCallback((newHeight: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      height: newHeight,
      walls: prev.walls.map(wall => ({
        ...wall,
        height: newHeight
      })),
      lastModified: new Date().toISOString()
    }));
  }, []);

  const updateWallHeight = useCallback((wallId: string, newHeight: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      walls: prev.walls.map(wall =>
        wall.id === wallId ? { ...wall, height: newHeight } : wall
      ),
      lastModified: new Date().toISOString()
    }));
  }, []);

  const updateWallThickness = useCallback((wallId: string, newThickness: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      walls: prev.walls.map(wall =>
        wall.id === wallId ? { ...wall, thickness: newThickness } : wall
      ),
      lastModified: new Date().toISOString()
    }));
  }, []);

  const updateWallColor = useCallback((wallId: string, newColor: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      walls: prev.walls.map(wall =>
        wall.id === wallId ? { ...wall, color: newColor } : wall
      ),
      lastModified: new Date().toISOString()
    }));
  }, []);

  const addRack = useCallback((rackData: Omit<Rack, 'id' | 'createdAt' | 'lastModified'>) => {
    const newRack: Rack = {
      ...rackData,
      id: `rack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setRacks(prev => [...prev, newRack]);
    return newRack.id;
  }, []);

  const removeRack = useCallback((rackId: string) => {
    setRacks(prev => prev.filter(rack => rack.id !== rackId));
    if (selectedRack === rackId) {
      setSelectedRack(null);
    }
  }, [selectedRack]);

  const updateRack = useCallback((rackId: string, updates: Partial<Rack>) => {
    setRacks(prev => prev.map(rack =>
      rack.id === rackId 
        ? { ...rack, ...updates, lastModified: new Date().toISOString() }
        : rack
    ));
  }, []);

  const selectRack = useCallback((rackId: string | null) => {
    setSelectedRack(rackId);
  }, []);

  const deleteRack = useCallback((rackId: string) => {
    removeRack(rackId);
  }, [removeRack]);

  const isPointInside = useCallback((x: number, z: number) => {
    if (!currentPlan.isCompleted || currentPlan.points.length < 3) return false;
    
    let inside = false;
    const points = currentPlan.points;
    
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      if (((points[i].z > z) !== (points[j].z > z)) &&
          (x < (points[j].x - points[i].x) * (z - points[i].z) / (points[j].z - points[i].z) + points[i].x)) {
        inside = !inside;
      }
    }
    
    return inside;
  }, [currentPlan.isCompleted, currentPlan.points]);

  return {
    currentPlan,
    mode,
    selectedWall,
    selectedPoint,
    selectedRack,
    mousePosition,
    isDrawing,
    previewLine,
    racks,
    showMeasurements,
    setShowMeasurements,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    setGridSize,
    setMode,
    setSelectedWall,
    setSelectedPoint,
    setSelectedRack,
    updateMousePosition,
    addPoint,
    completeDrawing,
    cancelDrawing,
    startNewDrawing,
    startDrawing: startNewDrawing,
    updateAllWallsHeight,
    updateWallHeight,
    updateWallThickness,
    updateWallColor,
    addRack,
    removeRack,
    updateRack,
    selectRack,
    deleteRack,
    setCurrentPlan,
    isPointInside,
    // Yeni exports
    drawingShape,
    setDrawingShape,
    drawingInfo,
    doorOpenings,
    addDoorOpening,
    circleRadius,
    completeCircle
  };
};