import { Component, type ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";

type Props = { name: string; onReset: () => void; children: ReactNode };
type State = { error: Error | null };

// A component that throws takes down the stage, not the shell: the error
// shows where the component would, and the next hot update (the fix, most
// likely) or a retry renders it again. `onReset` runs first — the stage
// reloads the page there when the module itself failed to load.
export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: unknown): State {
        return {
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }

    componentDidMount() {
        import.meta.hot?.on("vite:afterUpdate", this.reset);
    }

    componentWillUnmount() {
        import.meta.hot?.off("vite:afterUpdate", this.reset);
    }

    reset = () => {
        if (!this.state.error) return;
        this.props.onReset();
        this.setState({ error: null });
    };

    render() {
        const { error } = this.state;
        if (!error) return this.props.children;
        return (
            <div
                role="alert"
                className="palette-danger flex w-full flex-col items-start gap-3 rounded-md border border-palette-line bg-palette-soft p-4 text-palette-accent"
            >
                <p className="text-sm font-semibold">
                    {this.props.name} threw: {error.message}
                </p>
                <pre
                    dir="ltr"
                    className="w-full overflow-auto text-start font-mono text-xs"
                >
                    {error.stack}
                </pre>
                <Clickable.Button
                    variant="outline"
                    size="sm"
                    onClick={this.reset}
                >
                    Retry
                </Clickable.Button>
            </div>
        );
    }
}
