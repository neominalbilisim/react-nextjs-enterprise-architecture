import { useEffect } from "react";
import type { ReactElement } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import RemoteWidgets from "@/components/RemoteWidgets";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardErrorBoundary from "@/components/DashboardErrorBoundary";
import type { NextPageWithLayout } from "./_app";

const DashboardPage: NextPageWithLayout = function DashboardPage() {
  const count = useDashboardStore((s) => s.count);
  const increment = useDashboardStore((s) => s.increment);
  const data = useDashboardStore((s) => s.data);
  const isLoading = useDashboardStore((s) => s.isLoading);
  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);

  // MODÜL 1 · useEffect + boş dependency array → sadece mount'ta bir kez çalışır
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-3">Zustand Selector Örneği</h2>
        <div className="rounded-xl bg-card p-5 flex items-center justify-between">
          <p className="text-muted">
            Sayaç: <span className="text-yellow font-bold">{count}</span>
          </p>
          <button
            onClick={increment}
            className="rounded-full bg-cyan text-bg font-bold px-4 py-2 text-sm"
          >
            Artır
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">
          BFF Route Handler'dan Gelen Veri
        </h2>
        <div className="rounded-xl bg-card2 p-5">
          {isLoading && <p className="text-muted">Dashboard yükleniyor...</p>}
          {!isLoading && data && (
            <ul className="text-sm space-y-1">
              <li>Siparişler: {data.orders}</li>
              <li>Ödemeler: {data.payments}</li>
              <li>Kullanıcılar: {data.users}</li>
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">
          Modül 5 · Remote Micro-Frontend Widget'ları
        </h2>
        <RemoteWidgets />
      </section>
    </main>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      <DashboardErrorBoundary>{page}</DashboardErrorBoundary>
    </DashboardLayout>
  );
};

export default DashboardPage;
