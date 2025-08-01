import React from 'react';
import { Html, useProgress } from '@react-three/drei';

export const LoadingFallback: React.FC = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3>Depo Yükleniyor...</h3>
        <div style={{
          width: '200px',
          height: '4px',
          background: '#333',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#4CAF50',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
};