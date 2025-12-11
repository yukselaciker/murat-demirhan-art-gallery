import React from 'react';
import { Alert } from './Alert'; // Updated path

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem' }}>
                    <Alert variant="danger" title="Bir şeyler yanlış gitti">
                        Uygulama beklenmeyen bir hata ile karşılaştı. Lütfen sayfayı yenileyin.
                        <br />
                        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.8 }}>
                            {this.state.error?.toString()}
                        </small>
                    </Alert>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--color-neutral-800)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Sayfayı Yenile
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
