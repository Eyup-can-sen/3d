import { useState, useCallback, useRef } from 'react';

// --- Interfaces ---
export interface Point {
    x: number;
    z: number;
    id: string; // Unique identifier for the point
}

export type Point2D = Point; // Alias for clarity if needed elsewhere

export interface Wall {
    id: string; // Unique identifier for the wall
    startPoint: Point;
    endPoint: Point;
    thickness: number; // e.g., 0.25 meters
    height: number;    // Wall height
    material: string;  // e.g., 'concrete', 'steel', 'glass'
    color: string;     // Hex color code, e.g., '#8e9aaf'
    length: number;    // Calculated length of the wall
    angle: number;     // Angle in degrees (0-360) for consistent representation
}

export type WallSegment = Wall; // Alias for clarity if needed elsewhere

export interface WarehousePlan {
    id: string;
    name: string;
    points: Point[]; // Defines the perimeter of the warehouse on the ground plane
    walls: Wall[];   // Walls derived from the points
    height: number;  // Overall height of the warehouse
    isCompleted: boolean; // True if the drawing/plan is closed and valid
    area?: number;   // Calculated floor area
    createdAt: string;
    lastModified: string;
}

export type DrawingMode = 'draw' | 'edit' | 'view' | 'wall-edit' | 'rack';
export type RackType = 'pallet' | 'shelf' | 'cantilever';

export interface Rack {
    id: string;
    type: RackType;
    position: { x: number; y: number; z: number }; // Center position of the rack
    dimensions: { width: number; height: number; depth: number };
    rotation: number; // Y-axis rotation in degrees
    levels: number; // Number of storage levels
    capacity: number; // e.g., in kg or pallet count
    material: string;
    color: string;
    createdAt: string;
    lastModified: string;
    tags: string[]; // e.g., ['cold storage', 'heavy duty']
    notes: string;
}

export interface MousePosition {
    x: number;
    z: number;
    distance?: number; // Optional: distance from the last point in draw mode
    angle?: number;    // Optional: angle from the last point in draw mode
}

// --- Main Hook ---
export const useAdvancedWarehouseBuilder = () => {
    // State for the current warehouse plan
    const [currentPlan, setCurrentPlan] = useState<WarehousePlan>({
        id: 'default',
        name: 'Yeni Depo',
        points: [],
        walls: [],
        height: 4, // Default warehouse height
        isCompleted: false,
        area: 0,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
    });

    // Drawing/Interaction Modes
    const [mode, setModeInternal] = useState<DrawingMode>('view'); // Renamed for internal use
    const [selectedWall, setSelectedWall] = useState<Wall | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
    const [selectedRack, setSelectedRack] = useState<string | null>(null); // Stores ID of selected rack
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, z: 0 }); // Current mouse position in 3D world
    const [isDrawing, setIsDrawingInternal] = useState(false); // Renamed for internal use: true when actively drawing outline
    const [previewLine, setPreviewLine] = useState<{ // Line shown from last point to current mouse position
        start: Point;
        end: MousePosition;
        distance: number;
        angle: number;
    } | null>(null);

    // Rack Management
    const [racks, setRacks] = useState<Rack[]>([]);

    // Display and Grid Settings
    const [showMeasurements, setShowMeasurements] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [gridSize, setGridSize] = useState(50); // Size of the main grid helper

    // --- Custom Setters for Debugging and Controlled State Transitions ---
    // These allow us to add logging or other side effects when mode/isDrawing changes
    const setMode = useCallback((newMode: DrawingMode) => {
        console.log(`[useAdvancedWarehouseBuilder] Mode değişiyor: ${mode} -> ${newMode}`);
        setModeInternal(newMode);
    }, [mode]); // Dependency on `mode` allows logging the "old" mode

    const setIsDrawing = useCallback((drawingState: boolean) => {
        console.log(`[useAdvancedWarehouseBuilder] isDrawing değişiyor: ${isDrawing} -> ${drawingState}`);
        setIsDrawingInternal(drawingState);
    }, [isDrawing]); // Dependency on `isDrawing` allows logging the "old" state
    // --- End Custom Setters ---

    /**
     * Calculates the area of the polygon defined by the given points using the Shoelace formula.
     * @param points An array of Point objects defining the polygon vertices.
     * @returns The calculated area, or 0 if fewer than 3 points are provided.
     */
    const calculateArea = useCallback((points: Point[]) => {
        if (points.length < 3) return 0;

        let area = 0;
        // Shoelace formula for polygon area
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length; // Next point, wraps around to the first point
            area += points[i].x * points[j].z;
            area -= points[j].x * points[i].z;
        }
        return Math.abs(area) / 2;
    }, []);

    /**
     * Updates the global mouse position state and, if in drawing mode,
     * calculates and updates the preview line to the current mouse position.
     * @param x The X coordinate of the mouse in world space.
     * @param z The Z coordinate of the mouse in world space.
     */
    const updateMousePosition = useCallback((x: number, z: number) => {
        setMousePosition({ x, z });

        // Update preview line only if in draw mode, drawing is active, and there's at least one point
        if (mode === 'draw' && currentPlan.points.length > 0 && isDrawing) {
            const lastPoint = currentPlan.points[currentPlan.points.length - 1];
            const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(z - lastPoint.z, 2));
            // Calculate angle in radians and convert to degrees, then normalize to 0-360
            const angle = Math.atan2(z - lastPoint.z, x - lastPoint.x) * (180 / Math.PI);

            setPreviewLine({
                start: lastPoint,
                end: { x, z, distance, angle },
                distance,
                angle: angle >= 0 ? angle : angle + 360 // Normalize angle to 0-360 degrees
            });
        } else {
            setPreviewLine(null); // Remove preview line if not drawing
        }
    }, [mode, currentPlan.points, isDrawing]);

    /**
     * Creates wall objects from a given array of points.
     * Each wall connects two consecutive points.
     * @param points The array of Point objects.
     * @param height The height to assign to the walls.
     * @returns An array of Wall objects.
     */
    const createWallsFromPoints = useCallback((points: Point[], height: number) => {
        if (points.length < 2) return [];

        const walls: Wall[] = [];

        // Create walls for all segments except the closing one
        for (let i = 0; i < points.length - 1; i++) {
            const startPoint = points[i];
            const endPoint = points[i + 1];

            const dx = endPoint.x - startPoint.x;
            const dz = endPoint.z - startPoint.z;
            const length = Math.sqrt(dx * dx + dz * dz);
            const angle = Math.atan2(dz, dx) * (180 / Math.PI);

            walls.push({
                id: `wall-${startPoint.id}-${endPoint.id}`, // More descriptive ID
                startPoint,
                endPoint,
                thickness: 0.25,
                height,
                material: 'concrete',
                color: '#8e9aaf',
                length,
                angle: angle >= 0 ? angle : angle + 360 // Normalize angle
            });
        }

        return walls;
    }, []);

    /**
     * Completes the drawing process, adds the closing wall, calculates the area,
     * and sets the plan as completed.
     */
    const completeDrawing = useCallback(() => {
        console.log("[useAdvancedWarehouseBuilder] completeDrawing çağrıldı.");
        if (currentPlan.points.length < 3) {
            alert('⚠️ En az 3 nokta gerekli!');
            return;
        }

        const lastPoint = currentPlan.points[currentPlan.points.length - 1];
        const firstPoint = currentPlan.points[0];

        // Calculate closing wall properties
        const dx = firstPoint.x - lastPoint.x;
        const dz = firstPoint.z - lastPoint.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx) * (180 / Math.PI);

        const closingWall: Wall = {
            id: `wall-${lastPoint.id}-${firstPoint.id}`, // Descriptive ID for closing wall
            startPoint: lastPoint,
            endPoint: firstPoint,
            thickness: 0.25,
            height: currentPlan.height,
            material: 'concrete',
            color: '#8e9aaf',
            length,
            angle: angle >= 0 ? angle : angle + 360 // Normalize angle
        };

        const area = calculateArea(currentPlan.points);

        setCurrentPlan(prev => ({
            ...prev,
            walls: [...prev.walls, closingWall], // Add the closing wall
            isCompleted: true, // Mark plan as completed
            area, // Set calculated area
            lastModified: new Date().toISOString()
        }));

        setMode('view'); // Switch to view mode
        setIsDrawing(false); // Stop drawing
        setPreviewLine(null); // Clear preview line
        console.log("[useAdvancedWarehouseBuilder] Çizim başarıyla tamamlandı.");
    }, [currentPlan.points, currentPlan.height, calculateArea, setMode, setIsDrawing]);

    /**
     * Cancels the current drawing, clearing all points and walls, and resetting the mode.
     */
    const cancelDrawing = useCallback(() => {
        console.log("[useAdvancedWarehouseBuilder] cancelDrawing çağrıldı.");
        setCurrentPlan(prev => ({
            ...prev,
            points: [],
            walls: [],
            isCompleted: false,
            area: 0,
            lastModified: new Date().toISOString()
        }));
        setMode('view'); // Switch to view mode
        setIsDrawing(false); // Stop drawing
        setPreviewLine(null); // Clear preview line
        console.log("[useAdvancedWarehouseBuilder] Çizim iptal edildi.");
    }, [setMode, setIsDrawing]);

    /**
     * Adds a new point to the current plan. If it's the first point, it initializes drawing.
     * If the point is close to the starting point and there are at least 3 points, it completes the drawing.
     * @param x The X coordinate of the new point.
     * @param z The Z coordinate of the new point.
     */
    const addPoint = useCallback((x: number, z: number) => {
        console.log(`[useAdvancedWarehouseBuilder] addPoint çağrıldı. Mode: ${mode}, isDrawing: ${isDrawing}`);

        // Sadece 'draw' modunda ve çizim aktifken nokta eklemeye izin ver
        if (mode !== 'draw' || !isDrawing) {
            console.log("[useAdvancedWarehouseBuilder] Nokta eklenemedi: Çizim modunda veya aktif değil.");
            return;
        }

        const newPoint: Point = {
            x,
            z,
            id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Benzersiz ID
        };

        // Eğer ilk noktaysa, sadece ekle
        if (currentPlan.points.length === 0) {
            setCurrentPlan(prev => ({
                ...prev,
                points: [newPoint],
                lastModified: new Date().toISOString()
            }));
            console.log("[useAdvancedWarehouseBuilder] İlk nokta eklendi.");
            return;
        }

        const firstPoint = currentPlan.points[0];
        const distanceToStart = Math.sqrt(
            Math.pow(x - firstPoint.x, 2) + Math.pow(z - firstPoint.z, 2)
        );

        // Yeni nokta ilk noktaya yakınsa ve en az 3 nokta varsa, çizimi tamamla
        if (distanceToStart < 0.5 && currentPlan.points.length >= 3) {
            console.log("[useAdvancedWarehouseBuilder] Çizim tamamlanıyor (ilk noktaya yakın).");
            completeDrawing();
            return;
        }

        // Yeni noktayı ekle ve duvarları yeniden oluştur (kapanış duvarı hariç)
        setCurrentPlan(prev => {
            const updatedPoints = [...prev.points, newPoint];
            const walls = createWallsFromPoints(updatedPoints, prev.height); // Güncellenmiş noktalara göre duvarları yeniden oluştur
            console.log("[useAdvancedWarehouseBuilder] Yeni nokta eklendi, toplam nokta sayısı:", updatedPoints.length);

            return {
                ...prev,
                points: updatedPoints,
                walls,
                lastModified: new Date().toISOString()
            };
        });
    }, [mode, isDrawing, currentPlan.points, currentPlan.height, completeDrawing, createWallsFromPoints]);
    /**
     * Initiates a new warehouse drawing session, clearing previous data.
     */
    const startNewDrawing = useCallback(() => {
        console.log("[useAdvancedWarehouseBuilder] startNewDrawing çağrıldı.");
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
        setMode('draw'); // Set mode to 'draw'
        setSelectedWall(null); // Clear selections
        setSelectedPoint(null); // Clear selections
        setIsDrawing(true); // Activate drawing state
        setPreviewLine(null); // Clear any old preview line
        console.log("[useAdvancedWarehouseBuilder] Yeni çizim başlatıldı. Mod 'draw' ve isDrawing true.");
    }, [setMode, setIsDrawing]); // Dependencies on custom setters

    /**
     * Updates the height of all walls in the current plan.
     * @param newHeight The new height for all walls.
     */
    const updateAllWallsHeight = useCallback((newHeight: number) => {
        setCurrentPlan(prev => ({
            ...prev,
            height: newHeight,
            walls: prev.walls.map(wall => ({ // Update height for each existing wall
                ...wall,
                height: newHeight
            })),
            lastModified: new Date().toISOString()
        }));
    }, []);

    /**
     * Updates the height of a specific wall.
     * @param wallId The ID of the wall to update.
     * @param newHeight The new height for the wall.
     */
    const updateWallHeight = useCallback((wallId: string, newHeight: number) => {
        setCurrentPlan(prev => ({
            ...prev,
            walls: prev.walls.map(wall =>
                wall.id === wallId ? { ...wall, height: newHeight } : wall
            ),
            lastModified: new Date().toISOString()
        }));
    }, []);

    /**
     * Updates the thickness of a specific wall.
     * @param wallId The ID of the wall to update.
     * @param newThickness The new thickness for the wall.
     */
    const updateWallThickness = useCallback((wallId: string, newThickness: number) => {
        setCurrentPlan(prev => ({
            ...prev,
            walls: prev.walls.map(wall =>
                wall.id === wallId ? { ...wall, thickness: newThickness } : wall
            ),
            lastModified: new Date().toISOString()
        }));
    }, []);

    /**
     * Updates the color of a specific wall.
     * @param wallId The ID of the wall to update.
     * @param newColor The new color (hex string) for the wall.
     */
    const updateWallColor = useCallback((wallId: string, newColor: string) => {
        setCurrentPlan(prev => ({
            ...prev,
            walls: prev.walls.map(wall =>
                wall.id === wallId ? { ...wall, color: newColor } : wall
            ),
            lastModified: new Date().toISOString()
        }));
    }, []);

    /**
     * Adds a new rack to the plan.
     * @param rackData The data for the new rack, excluding ID and timestamps.
     * @returns The ID of the newly added rack.
     */
    const addRack = useCallback((rackData: Omit<Rack, 'id' | 'createdAt' | 'lastModified'>) => {
        const newRack: Rack = {
            ...rackData,
            id: `rack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID for the rack
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        setRacks(prev => [...prev, newRack]);
        console.log("[useAdvancedWarehouseBuilder] Yeni raf eklendi:", newRack.id);
        return newRack.id; // Return the new rack's ID for potential immediate selection/use
    }, []);

    /**
     * Removes a rack from the plan by its ID.
     * If the removed rack was selected, deselects it.
     * @param rackId The ID of the rack to remove.
     */
    const removeRack = useCallback((rackId: string) => {
        setRacks(prev => prev.filter(rack => rack.id !== rackId));
        if (selectedRack === rackId) { // Deselect if the removed rack was selected
            setSelectedRack(null);
        }
        console.log("[useAdvancedWarehouseBuilder] Raf silindi:", rackId);
    }, [selectedRack]);

    /**
     * Updates properties of an existing rack.
     * @param rackId The ID of the rack to update.
     * @param updates An object containing the properties to update.
     */
    const updateRack = useCallback((rackId: string, updates: Partial<Rack>) => {
        setRacks(prev => prev.map(rack =>
            rack.id === rackId
                ? { ...rack, ...updates, lastModified: new Date().toISOString() } // Apply updates and refresh timestamp
                : rack
        ));
        console.log("[useAdvancedWarehouseBuilder] Raf güncellendi:", rackId, updates);
    }, []);

    /**
     * Sets the currently selected rack by its ID. Pass `null` to deselect.
     * @param rackId The ID of the rack to select, or `null`.
     */
    const selectRack = useCallback((rackId: string | null) => {
        setSelectedRack(rackId);
        console.log("[useAdvancedWarehouseBuilder] Raf seçildi:", rackId);
    }, []);

    /**
     * Alias for `removeRack`. Deletes a rack from the plan.
     * @param rackId The ID of the rack to delete.
     */
    const deleteRack = useCallback((rackId: string) => {
        removeRack(rackId);
        console.log("[useAdvancedWarehouseBuilder] Raf silme eylemi:", rackId);
    }, [removeRack]);

    /**
     * Checks if a given 2D point (x, z) is inside the completed warehouse polygon.
     * Uses the ray-casting algorithm (also known as the even-odd rule).
     * @param x The X coordinate of the point to check.
     * @param z The Z coordinate of the point to check.
     * @returns True if the point is inside the polygon, false otherwise.
     */
    const isPointInside = useCallback((x: number, z: number) => {
        // Can only check if the plan is completed and has at least 3 points (a valid polygon)
        if (!currentPlan.isCompleted || currentPlan.points.length < 3) return false;

        let inside = false;
        const points = currentPlan.points; // The polygon vertices

        // Loop through each edge of the polygon
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const pi = points[i];
            const pj = points[j];

            // Check if the ray from (x, z) to the right crosses the edge (pi, pj)
            // The condition checks if the horizontal ray intersects the edge,
            // ensuring the intersection is to the right of the point (x, z)
            if (((pi.z > z) !== (pj.z > z)) &&
                (x < (pj.x - pi.x) * (z - pi.z) / (pj.z - pi.z) + pi.x)) {
                inside = !inside; // Toggle `inside` status
            }
        }

        return inside;
    }, [currentPlan.isCompleted, currentPlan.points]);

    // --- Return Values ---
    return {
        currentPlan,
        mode,
        selectedWall,
        selectedPoint,
        selectedRack,
        mousePosition,
        isDrawing,
        previewLine,
        racks, // Expose racks state
        showMeasurements,
        setShowMeasurements,
        snapToGrid,
        setSnapToGrid,
        gridSize,
        setGridSize,
        // Publicly exposed setters and actions
        setMode,
        setIsDrawing,
        setSelectedWall,
        setSelectedPoint,
        setSelectedRack,
        updateMousePosition,
        addPoint,
        completeDrawing,
        cancelDrawing,
        startNewDrawing,
        startDrawing: startNewDrawing, // Alias for convenience
        updateAllWallsHeight,
        updateWallHeight,
        updateWallThickness,
        updateWallColor,
        addRack,
        removeRack,
        updateRack,
        selectRack,
        deleteRack,
        setCurrentPlan, // Allow external components to fully replace the plan
        isPointInside // Expose point-in-polygon check
    };
};