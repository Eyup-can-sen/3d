import { useState, useCallback, useMemo } from 'react';
import { Cargo, CargoFilter, CargoStats } from '../types/warehouse';
import { Rack } from './useAdvancedWarehouseBuilder';

export const useCargoManager = (racks: Rack[]) => {
  // ... mevcut kod
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);
  const [filter, setFilter] = useState<CargoFilter>({});

  // ... rest of the code remains the same
  // Kargo ekleme
  const addCargo = useCallback((cargoData: Omit<Cargo, 'id' | 'dateAdded'>) => {
    const newCargo: Cargo = {
      ...cargoData,
      id: `cargo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString(),
    };
    
    setCargos(prev => [...prev, newCargo]);
    return newCargo.id;
  }, []);

  // Kargo güncelleme
  const updateCargo = useCallback((cargoId: string, updates: Partial<Cargo>) => {
    setCargos(prev => prev.map(cargo => 
      cargo.id === cargoId 
        ? { ...cargo, ...updates, dateLastAccessed: new Date().toISOString() }
        : cargo
    ));
  }, []);

  // Kargo silme
  const deleteCargo = useCallback((cargoId: string) => {
    setCargos(prev => prev.filter(cargo => cargo.id !== cargoId));
    if (selectedCargo === cargoId) {
      setSelectedCargo(null);
    }
  }, [selectedCargo]);

  // Rafa göre kargo getirme
  const getCargosByRack = useCallback((rackId: string) => {
    return cargos.filter(cargo => cargo.rackId === rackId);
  }, [cargos]);

  // Seviye ve pozisyona göre kargo getirme
  const getCargoByPosition = useCallback((rackId: string, level: number, position: number) => {
    return cargos.find(cargo => 
      cargo.rackId === rackId && 
      cargo.level === level && 
      cargo.position === position
    );
  }, [cargos]);

  // Raf kapasitesi kontrolü
  const getRackCapacity = useCallback((rackId: string) => {
    const rack = racks.find(r => r.id === rackId);
    if (!rack) return { total: 0, used: 0, available: 0 };

    const rackCargos = getCargosByRack(rackId);
    const totalPositions = rack.levels * 4; // Her seviyede 4 pozisyon varsayalım
    
    return {
      total: totalPositions,
      used: rackCargos.length,
      available: totalPositions - rackCargos.length
    };
  }, [racks, getCargosByRack]);

  // Filtrelenmiş kargolar
  const filteredCargos = useMemo(() => {
    return cargos.filter(cargo => {
      if (filter.status && cargo.status !== filter.status) return false;
      if (filter.priority && cargo.priority !== filter.priority) return false;
      if (filter.category && cargo.category !== filter.category) return false;
      
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        if (!cargo.name.toLowerCase().includes(searchLower) &&
            !cargo.description?.toLowerCase().includes(searchLower) &&
            !cargo.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      if (filter.dateRange) {
        const cargoDate = new Date(cargo.dateAdded);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (cargoDate < startDate || cargoDate > endDate) return false;
      }
      
      return true;
    });
  }, [cargos, filter]);

  // İstatistikler
  const stats: CargoStats = useMemo(() => {
    const total = cargos.length;
    
    const byStatus = cargos.reduce((acc, cargo) => {
      acc[cargo.status] = (acc[cargo.status] || 0) + 1;
      return acc;
    }, {} as Record<Cargo['status'], number>);

    const byPriority = cargos.reduce((acc, cargo) => {
      acc[cargo.priority] = (acc[cargo.priority] || 0) + 1;
      return acc;
    }, {} as Record<Cargo['priority'], number>);

    const byCategory = cargos.reduce((acc, cargo) => {
      acc[cargo.category] = (acc[cargo.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalWeight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
    
    const totalVolume = cargos.reduce((sum, cargo) => {
      const volume = (cargo.dimensions.width * cargo.dimensions.height * cargo.dimensions.depth) / 1000000; // cm³ to m³
      return sum + volume;
    }, 0);

    return {
      total,
      byStatus,
      byPriority,
      byCategory,
      totalWeight,
      totalVolume
    };
  }, [cargos]);

  // Boş pozisyon bulma
  const findEmptyPosition = useCallback((rackId: string) => {
    const rack = racks.find(r => r.id === rackId);
    if (!rack) return null;

    const rackCargos = getCargosByRack(rackId);
    
    for (let level = 1; level <= rack.levels; level++) {
      for (let position = 1; position <= 4; position++) {
        const occupied = rackCargos.some(cargo => 
          cargo.level === level && cargo.position === position
        );
        if (!occupied) {
          return { level, position };
        }
      }
    }
    
    return null; // Raf dolu
  }, [racks, getCargosByRack]);

  return {
    // State
    cargos: filteredCargos,
    allCargos: cargos,
    selectedCargo,
    filter,
    stats,

    // Actions
    addCargo,
    updateCargo,
    deleteCargo,
    setSelectedCargo,
    setFilter,

    // Utilities
    getCargosByRack,
    getCargoByPosition,
    getRackCapacity,
    findEmptyPosition
  };
};