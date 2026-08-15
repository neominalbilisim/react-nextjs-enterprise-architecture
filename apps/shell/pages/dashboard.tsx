import { useEffect } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
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
          Modül 6 · Checkout Akışı
        </h2>
        <Link href="/checkout/step1" className="block mb-6">
          <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan/10 border-2 border-purple-500/30 p-6 hover:border-purple-500/60 transition-all hover:scale-[1.02] cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🛒</span>
              <div>
                <h3 className="text-purple-400 font-bold text-lg">Checkout Sayfasına Git</h3>
                <p className="text-muted text-sm">
                  Stepli checkout akışı (Sepet → Ödeme → Onay)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">React Hook Form</span>
              <span className="px-2 py-1 bg-cyan/20 text-cyan rounded">Zod Validation</span>
              <span className="px-2 py-1 bg-yellow/20 text-yellow rounded">Zustand</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Module Federation</span>
            </div>
          </div>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">
          Modül 5 & 6 · Remote Widget'lar & Component Örnekleri
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
