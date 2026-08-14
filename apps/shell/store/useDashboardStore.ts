import { create } from "zustand";

// MODÜL 3 · Zustand: Selector Bazlı Optimize Global State
// - Provider gerektirmez, store herhangi bir component'ten doğrudan import edilir.
// - Asenkron aksiyonlar (API çağrıları) doğrudan store içinde tanımlanabilir.
// - Component'ler useDashboardStore(s => s.count) gibi bir selector ile
//   sadece ilgilendikleri alan değiştiğinde render olur.

type DashboardData = {
  orders: number;
  payments: number;
  users: number;
} | null;

interface DashboardState {
  count: number;
  data: DashboardData;
  isLoading: boolean;
  increment: () => void;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  count: 0,
  data: null,
  isLoading: false,

  increment: () => set((state) => ({ count: state.count + 1 })),

  // Asenkron aksiyon örneği: BFF API route'undan (pages/api/dashboard) veri çeker.
  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      set({ data, isLoading: false });
    } catch (err) {
      console.error("Dashboard verisi alınamadı", err);
      set({ isLoading: false });
    }
  },
}));
