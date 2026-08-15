import { Component, Fragment, type ReactNode } from "react";
import Link from "next/link";

// Pages Router'da App Router error.tsx yoktur. Federated checkout
// (dynamic import fail + remote içi render hatası) class boundary ile yakalanır.
// next/dynamic Promise reject ederse Error Boundary'ye düşmez; withRemoteLoadError
// reject'i render-time throw'a çevirir.

type Props = {
  children: ReactNode;
  /** Dashboard widget'ları için küçük kart; checkout route'ları için tam sayfa. */
  compact?: boolean;
};

type State = { error: Error | null; retryKey: number };

export function withRemoteLoadError<T>(loader: () => Promise<T>): () => Promise<T> {
  return () =>
    loader().catch((err: unknown) => {
      const error =
        err instanceof Error
          ? err
          : new Error("checkout-app yüklenemedi (http://localhost:3001).");
      return {
        default: function RemoteLoadFailed() {
          throw error;
        },
      } as T;
    });
}

export default class CheckoutErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retryKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  handleRetry = () => {
    this.setState((s) => ({ error: null, retryKey: s.retryKey + 1 }));
  };

  render() {
    if (this.state.error) {
      return this.props.compact
        ? this.renderCompact(this.state.error)
        : this.renderFullPage(this.state.error);
    }

    return (
      <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>
    );
  }

  private renderCompact(error: Error) {
    return (
      <div className="rounded-lg border border-yellow/30 bg-yellow/5 p-4">
        <p className="text-yellow font-bold text-sm mb-1">
          Checkout remote yüklenemedi
        </p>
        <p className="text-muted text-xs mb-3">{error.message}</p>
        <p className="text-muted text-xs mb-3">
          checkout-app&apos;in{" "}
          <span className="text-cyan">http://localhost:3001</span> adresinde
          çalıştığından emin olun.
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          className="rounded-full bg-cyan text-bg font-bold px-3 py-1.5 text-xs"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  private renderFullPage(error: Error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F1923",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "420px", textAlign: "center" }}>
          <p
            style={{
              color: "#00B4D8",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: "8px",
            }}
          >
            MODULE FEDERATION
          </p>
          <h1
            style={{
              color: "#E8F4FD",
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Checkout yüklenemedi
          </h1>
          <p style={{ color: "#8BAAB8", fontSize: "14px", marginBottom: "8px" }}>
            {error.message}
          </p>
          <p style={{ color: "#8BAAB8", fontSize: "13px", marginBottom: "24px" }}>
            Remote uygulamanın{" "}
            <span style={{ color: "#00B4D8" }}>http://localhost:3001</span>{" "}
            adresinde çalıştığını kontrol edin, ardından tekrar deneyin.
          </p>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                background: "#00B4D8",
                color: "#0F1923",
                fontWeight: 700,
                border: "none",
                borderRadius: "999px",
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              style={{
                color: "#8BAAB8",
                fontSize: "14px",
                padding: "10px 18px",
                textDecoration: "none",
              }}
            >
              Ana sayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
