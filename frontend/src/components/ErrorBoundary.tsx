import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Oops! Une erreur s'est produite
                            </h1>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Désolé, quelque chose s'est mal passé. Veuillez rafraîchir la page ou contacter le support.
                        </p>

                        {this.state.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-sm font-mono text-red-800 mb-2">
                                    <strong>Erreur:</strong> {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="text-xs font-mono text-red-700">
                                        <summary className="cursor-pointer hover:text-red-900">
                                            Détails techniques (cliquez pour voir)
                                        </summary>
                                        <pre className="mt-2 overflow-auto max-h-64 bg-white p-2 rounded">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-slate-700 hover:bg-slate-800"
                            >
                                Rafraîchir la page
                            </Button>
                            <Button
                                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                                variant="outline"
                            >
                                Réessayer
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
