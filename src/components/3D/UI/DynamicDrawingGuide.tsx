import React from 'react';
import { Html } from '@react-three/drei';
import { Wall, Point } from '../../../hooks/useAdvancedWarehouseBuilder';

export interface MeasurementDisplayProps {
    walls: Wall[];
    points: Point[];
    showMeasurements: boolean;
}

export const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({
    walls,
    points,
    showMeasurements
}) => {
    if (!showMeasurements) return null;

    return (
        <group>
            {walls.map((wall, index) => {
                const midX = (wall.startPoint.x + wall.endPoint.x) / 2;
                const midZ = (wall.startPoint.z + wall.endPoint.z) / 2;

                return (
                    <Html
                        key={wall.id}
                        position={[midX, 0.5, midZ]}
                        center
                    >
                        <div style={{
                            background: 'rgba(74, 144, 226, 0.9)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textAlign: 'center',
                            minWidth: '60px'
                        }}>
                            {wall.length.toFixed(2)}m
                        </div>
                    </Html>
                );
            })}
        </group>
    );
};

export {};