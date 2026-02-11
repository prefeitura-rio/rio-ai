import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Optional fallback component to render when an error occurs */
    fallback?: ReactNode;
    /** Optional callback when an error is caught */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    /** Name of the boundary for logging purposes */
    name?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * A generic error boundary component that catches JavaScript errors
 * in its child component tree and displays a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        const { onError, name } = this.props;

        // Log error to console with boundary name for debugging
        console.error(
            `[ErrorBoundary${name ? `: ${name}` : ''}] Caught error:`,
            error,
            errorInfo
        );

        // Call optional error handler
        onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;
        const isEnglish =
            typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('en');

        if (hasError) {
            // Use custom fallback if provided
            if (fallback) {
                return fallback;
            }

            // Default fallback UI
            return (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                    <h3 className="mt-4 text-lg font-semibold text-red-800">
                        {isEnglish ? 'Something went wrong' : 'Algo deu errado'}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-red-600">
                        {isEnglish
                            ? 'An unexpected error occurred. Please try again.'
                            : 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
                    </p>
                    {error && (
                        <details className="mt-4 max-w-md text-left">
                            <summary className="cursor-pointer text-xs text-red-500 hover:text-red-700">
                                {isEnglish ? 'Technical details' : 'Detalhes técnicos'}
                            </summary>
                            <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                                {error.message}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={this.handleRetry}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {isEnglish ? 'Try again' : 'Tentar novamente'}
                    </button>
                </div>
            );
        }

        return children;
    }
}

/**
 * A section-specific error boundary with a more subtle fallback UI
 * suitable for non-critical sections of the page.
 */
export const SectionErrorBoundary: React.FC<{
    children: ReactNode;
    sectionName?: string;
}> = ({ children, sectionName }) => {
    const { isEnglish } = useLocale();

    return (
        <ErrorBoundary
            name={sectionName}
            fallback={
                <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-500">
                        {isEnglish
                            ? 'Unable to load this section.'
                            : 'Não foi possível carregar esta seção.'}
                    </p>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
};

/**
 * A chat-specific error boundary with a fallback that maintains
 * the chat container layout.
 */
export const ChatErrorBoundary: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { isEnglish } = useLocale();

    return (
        <ErrorBoundary
            name="Chat"
            fallback={
                <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">
                        {isEnglish ? 'Chat unavailable' : 'Chat indisponível'}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-600">
                        {isEnglish
                            ? 'An error occurred while loading the chat. Please reload the page.'
                            : 'Ocorreu um erro ao carregar o chat. Por favor, recarregue a página.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-rio-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-rio-primary focus:ring-offset-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {isEnglish ? 'Reload page' : 'Recarregar página'}
                    </button>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
};
