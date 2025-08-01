import React from 'react';
import { Html } from '@react-three/drei';
import { Rack } from '../../../hooks/useAdvancedWarehouseBuilder';
import { Cargo } from '../../../types/warehouse';
import { modernTheme } from '../UI/ModernTheme';

interface CargoVisualizationProps {
  rack: Rack;
  cargos: Cargo[];
  selectedCargo: string | null;
  onCargoClick: (cargoId: string) => void;
  showDetails: boolean;
}

export const CargoVisualization: React.FC<CargoVisualizationProps> = ({
  rack,
  cargos,
  selectedCargo,
  onCargoClick,
  showDetails
}) => {
  const getStatusColor = (status: Cargo['status']) => {
    switch (status) {
      case 'stored': return modernTheme.colors.success;
      case 'picking': return modernTheme.colors.warning;
      case 'shipped': return modernTheme.colors.text.secondary;
      case 'damaged': return modernTheme.colors.error;
      default: return modernTheme.colors.text.primary;
    }
  };

  const getPriorityIntensity = (priority: Cargo['priority']) => {
    switch (priority) {
      case 'urgent': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.6;
      case 'low': return 0.4;
      default: return 0.5;
    }
  };

  // Pozisyon hesaplama - her seviyede 4 pozisyon (2x2 grid)
  const getCargoPosition = (level: number, position: number) => {
    const levelHeight = (rack.dimensions.height / rack.levels) * (level - 0.5);
    const baseX = -rack.dimensions.width / 4;
    const baseZ = -rack.dimensions.depth / 4;
    
    let x = 0, z = 0;
    
    switch (position) {
      case 1: // Sol-Ön
        x = baseX;
        z = baseZ;
        break;
      case 2: // Sağ-Ön  
        x = -baseX;
        z = baseZ;
        break;
      case 3: // Sağ-Arka
        x = -baseX;
        z = -baseZ;
        break;
      case 4: // Sol-Arka
        x = baseX;
        z = -baseZ;
        break;
    }
    
    return { x, y: levelHeight, z };
  };

  return (
    <group position={[rack.position.x, rack.position.y, rack.position.z]} rotation={[0, (rack.rotation * Math.PI) / 180, 0]}>
      {cargos.map((cargo) => {
        const cargoPos = getCargoPosition(cargo.level, cargo.position);
        const isSelected = selectedCargo === cargo.id;
        const statusColor = getStatusColor(cargo.status);
        const priorityIntensity = getPriorityIntensity(cargo.priority);
        
        // Kargo boyutlarını cm'den m'ye çevir ve raf boyutlarına göre sınırla
        const maxCargoWidth = rack.dimensions.width / 2.2;
        const maxCargoDepth = rack.dimensions.depth / 2.2;
        const maxCargoHeight = (rack.dimensions.height / rack.levels) * 0.8;
        
        const cargoWidth = Math.min((cargo.dimensions.width / 100), maxCargoWidth);
        const cargoHeight = Math.min((cargo.dimensions.height / 100), maxCargoHeight);
        const cargoDepth = Math.min((cargo.dimensions.depth / 100), maxCargoDepth);

        return (
          <group key={cargo.id}>
            {/* Ana kargo kutusu */}
            <mesh
              position={[cargoPos.x, cargoPos.y, cargoPos.z]}
              onClick={(e) => {
                e.stopPropagation();
                onCargoClick(cargo.id);
              }}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[cargoWidth, cargoHeight, cargoDepth]} />
              <meshStandardMaterial
                color={statusColor}
                transparent
                opacity={priorityIntensity}
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>

            {/* Seçim outline */}
            {isSelected && (
              <mesh position={[cargoPos.x, cargoPos.y, cargoPos.z]}>
                <boxGeometry args={[cargoWidth + 0.05, cargoHeight + 0.05, cargoDepth + 0.05]} />
                <meshBasicMaterial
                  color={modernTheme.colors.primary}
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </mesh>
            )}

            {/* Öncelik göstergesi */}
            {cargo.priority === 'urgent' && (
              <Html position={[cargoPos.x, cargoPos.y + cargoHeight/2 + 0.1, cargoPos.z]} center>
                <div style={{
                  background: modernTheme.colors.error,
                  color: 'white',
                  padding: '2px 4px',
                  borderRadius: modernTheme.borderRadius.sm,
                  fontSize: '8px',
                  fontWeight: '700',
                  animation: 'blink 1s infinite'
                }}>
                  🚨 ACİL
                </div>
              </Html>
            )}

            {/* Detay bilgileri */}
            {showDetails && isSelected && (
              <Html position={[cargoPos.x, cargoPos.y + cargoHeight/2 + 0.3, cargoPos.z]} center>
                <div style={{
                  background: modernTheme.colors.background.panel,
                  border: `2px solid ${statusColor}`,
                  borderRadius: modernTheme.borderRadius.md,
                  padding: '6px 8px',
                  fontSize: '10px',
                  color: modernTheme.colors.text.primary,
                  textAlign: 'center',
                  minWidth: '120px',
                  maxWidth: '200px',
                  boxShadow: modernTheme.shadows.lg
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                    📦 {cargo.name}
                  </div>
                  <div style={{ fontSize: '9px', color: modernTheme.colors.text.secondary, marginBottom: '4px' }}>
                    📍 Seviye {cargo.level}, Pozisyon {cargo.position}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', fontSize: '8px' }}>
                    <div><strong>Ağırlık:</strong> {cargo.weight}kg</div>
                    <div><strong>Durum:</strong> <span style={{ color: statusColor }}>
                      {cargo.status === 'stored' ? 'Depolandı' :
                       cargo.status === 'picking' ? 'Hazırlanıyor' :
                       cargo.status === 'shipped' ? 'Gönderildi' : 'Hasarlı'}
                    </span></div>
                    <div><strong>Öncelik:</strong> <span style={{ color: getPriorityIntensity(cargo.priority) > 0.7 ? modernTheme.colors.error : modernTheme.colors.text.secondary }}>
                      {cargo.priority === 'urgent' ? 'Acil' :
                       cargo.priority === 'high' ? 'Yüksek' :
                       cargo.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span></div>
                    <div><strong>Kategori:</strong> {cargo.category}</div>
                  </div>
                  {cargo.dateExpiry && (
                    <div style={{ 
                      fontSize: '8px', 
                      color: new Date(cargo.dateExpiry) < new Date() ? modernTheme.colors.error : modernTheme.colors.text.secondary,
                      marginTop: '2px'
                    }}>
                      📅 SKT: {new Date(cargo.dateExpiry).toLocaleDateString('tr-TR')}
                    </div>
                  )}
                </div>
              </Html>
            )}

            {/* Pozisyon numarası (küçük etiket) */}
            {!showDetails && (
              <Html position={[cargoPos.x, cargoPos.y + cargoHeight/2 + 0.05, cargoPos.z]} center>
                <div style={{
                  background: statusColor,
                  color: 'white',
                  padding: '1px 4px',
                  borderRadius: modernTheme.borderRadius.sm,
                  fontSize: '7px',
                  fontWeight: '600'
                }}>
                  {cargo.position}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Boş pozisyon göstergeleri (sadece seçili rafta) */}
      {rack.id === selectedCargo && Array.from({ length: rack.levels }, (_, levelIndex) =>
        Array.from({ length: 4 }, (_, posIndex) => {
          const level = levelIndex + 1;
          const position = posIndex + 1;
          
          const hasCargoInPosition = cargos.some(c => c.level === level && c.position === position);
          
          if (hasCargoInPosition) return null;
          
          const emptyPos = getCargoPosition(level, position);
          
          return (
            <group key={`empty-${level}-${position}`}>
              <mesh position={[emptyPos.x, emptyPos.y, emptyPos.z]}>
                <boxGeometry args={[0.3, 0.05, 0.3]} />
                <meshBasicMaterial
                  color={modernTheme.colors.border.light}
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </mesh>
              
              <Html position={[emptyPos.x, emptyPos.y + 0.1, emptyPos.z]} center>
                <div style={{
                  background: modernTheme.colors.background.secondary,
                  border: `1px dashed ${modernTheme.colors.border.medium}`,
                  borderRadius: modernTheme.borderRadius.sm,
                  padding: '2px 4px',
                  fontSize: '7px',
                  color: modernTheme.colors.text.secondary
                }}>
                  📍 {position}
                </div>
              </Html>
            </group>
          );
        })
      )}
    </group>
  );
};

// CSS animasyon için (eğer global CSS yoksa)
const style = document.createElement('style');
style.textContent = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
`;
document.head.appendChild(style);