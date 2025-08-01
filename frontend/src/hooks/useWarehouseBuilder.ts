import { useState, useCallback } from 'react';
import { Vector3 } from 'three';

export interface Point2D {
  x: number;
  z: number;
}

export interface WarehousePlan {
  id: string;
  name: string;
  points: Point2D[];
  height: number;
  isCompleted: boolean;
}

export const useWarehouseBuilder = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WarehousePlan>({
    id: 'new-warehouse',
    name: 'Yeni Depo',
    points: [],
    height: 8,
    isCompleted: false
  });
  const [savedPlans, setSavedPlans] = useState<WarehousePlan[]>([]);

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    setCurrentPlan(prev => ({
      ...prev,
      points: [],
      isCompleted: false
    }));
  }, []);

  const addPoint = useCallback((x: number, z: number) => {
    if (!isDrawing) return;
    
    setCurrentPlan(prev => ({
      ...prev,
      points: [...prev.points, { x, z }]
    }));
  }, [isDrawing]);

  const completeDrawing = useCallback(() => {
    if (currentPlan.points.length < 3) {
      alert('En az 3 nokta ekleymelisiniz!');
      return;
    }
    
    setCurrentPlan(prev => ({
      ...prev,
      isCompleted: true
    }));
    setIsDrawing(false);
  }, [currentPlan.points.length]);

  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setCurrentPlan(prev => ({
      ...prev,
      points: [],
      isCompleted: false
    }));
  }, []);

  const updateHeight = useCallback((height: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      height
    }));
  }, []);

  const savePlan = useCallback(() => {
    if (!currentPlan.isCompleted) return;
    
    const planToSave = {
      ...currentPlan,
      id: `warehouse-${Date.now()}`,
      name: currentPlan.name || `Depo ${savedPlans.length + 1}`
    };
    
    setSavedPlans(prev => [...prev, planToSave]);
    
    // Yeni plan için reset
    setCurrentPlan({
      id: 'new-warehouse',
      name: 'Yeni Depo',
      points: [],
      height: 8,
      isCompleted: false
    });
  }, [currentPlan, savedPlans.length]);

  return {
    isDrawing,
    currentPlan,
    savedPlans,
    startDrawing,
    addPoint,
    completeDrawing,
    cancelDrawing,
    updateHeight,
    savePlan
  };
};