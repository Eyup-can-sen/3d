import React, { Component, ReactNode } from 'react';
import { modernTheme } from './ModernTheme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: modernTheme.colors.background.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 9999
        }}>
          <div style={{
            background: modernTheme.colors.error,
            color: 'white',
            padding: '20px',
            borderRadius: modernTheme.borderRadius.lg,
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <h2 style={{ margin: '0 0 16px 0' }}>⚠️ 3D Görünümde Hata</h2>
            <p style={{ margin: '0 0 16px 0' }}>
              3D sahne yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'white',
                color: modernTheme.colors.error,
                border: 'none',
                padding: '10px 20px',
                borderRadius: modernTheme.borderRadius.md,
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔄 Sayfayı Yenile
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '20px', 
              padding: '10px',
              background: modernTheme.colors.background.secondary,
              borderRadius: modernTheme.borderRadius.md,
              maxWidth: '500px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                🔧 Geliştirici Detayları
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto',
                marginTop: '10px',
                color: modernTheme.colors.text.secondary
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}