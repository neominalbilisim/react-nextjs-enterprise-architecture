import { Component, type ReactNode } from "react";

// App Router error.tsx karşılığı: route segment hatalarını yakalayan
// bir Error Boundary. Pages Router'da dosya kuralı yoktur; class component
// olarak sarmalanır.

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class DashboardErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="px-6 py-10">
          <p className="text-yellow font-bold mb-2">Bir şeyler ters gitti.</p>
          <p className="text-muted text-sm mb-4">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="rounded-full bg-cyan text-bg font-bold px-4 py-2 text-sm"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
