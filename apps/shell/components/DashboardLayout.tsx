import type { ReactNode } from "react";

// Pages Router nested layout: App Router'daki (dashboard)/layout.tsx karşılığı.
// URL'e yansımaz; _app.tsx içindeki getLayout ile /dashboard sayfasına sarılır.

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-card px-6 py-4">
        <p className="text-cyan text-sm font-bold tracking-widest">
          DASHBOARD ALANI
        </p>
      </header>
      {children}
    </div>
  );
}
