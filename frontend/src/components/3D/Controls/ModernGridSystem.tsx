import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { modernTheme } from '../UI/ModernTheme';

interface ModernGridSystemProps {
  show: boolean;
  size: number;
  extent: number;
  opacity?: number;
}

type LinePoints = [number, number, number][];

export const ModernGridSystem: React.FC<ModernGridSystemProps> = ({
  show,
  size,
  extent = 50,
  opacity = 0.3
}) => {
  const gridLines = useMemo(() => {
    if (!show) return { majorLines: [], minorLines: [] };
    
    const majorLines: LinePoints[] = [];
    const minorLines: LinePoints[] = [];
    const halfExtent = extent / 2;
    
    for (let i = -halfExtent; i <= halfExtent; i += size) {
      const isMajor = i % (size * 5) === 0;
      const lineData = isMajor ? majorLines : minorLines;
      
      // Vertical lines
      lineData.push([
        [i, 0, -halfExtent],
        [i, 0, halfExtent]
      ]);
      
      // Horizontal lines
      lineData.push([
        [-halfExtent, 0, i],
        [halfExtent, 0, i]
      ]);
    }
    
    return { majorLines, minorLines };
  }, [show, size, extent]);

  if (!show) return null;

  return (
    <group>
      {/* Minor grid lines */}
      {gridLines.minorLines.map((points: LinePoints, index: number) => (
        <Line
          key={`minor-${index}`}
          points={points}
          color={modernTheme.colors.grid.sub}
          lineWidth={1}
          transparent
          opacity={opacity * 0.5}
        />
      ))}
      
      {/* Major grid lines */}
      {gridLines.majorLines.map((points: LinePoints, index: number) => (
        <Line
          key={`major-${index}`}
          points={points}
          color={modernTheme.colors.grid.main}
          lineWidth={2}
          transparent
          opacity={opacity}
        />
      ))}
      
      {/* Origin axes */}
      <Line
        points={[[-extent/2, 0, 0], [extent/2, 0, 0]]}
        color={modernTheme.colors.grid.accent}
        lineWidth={3}
        transparent
        opacity={opacity * 1.5}
      />
      <Line
        points={[[0, 0, -extent/2], [0, 0, extent/2]]}
        color={modernTheme.colors.grid.accent}
        lineWidth={3}
        transparent
        opacity={opacity * 1.5}
      />
    </group>
  );
};