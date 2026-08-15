"use client";

// MODÜL 5 & 6 · Remote Widget Yükleme
// Federated modüller sadece tarayıcıda çözülebildiği için next/dynamic
// ile ssr:false olarak import edilir. Host, Remote'un iç implementasyonundan
// habersizdir — sadece dışarı açılan (exposes) component'i tüketir.
//
// MODÜL 6 Eklentisi: METHOD 1 örneği olarak CheckoutStep1 de gösterilmiştir.

import dynamic from "next/dynamic";

const CheckoutWidget = dynamic(() => import("checkout/CheckoutWidget"), {
  ssr: false,
  loading: () => (
    <p className="text-muted text-sm">checkout-app widget'ı yükleniyor...</p>
  ),
});

const ProfileWidget = dynamic(() => import("profile/ProfileWidget"), {
  ssr: false,
  loading: () => (
    <p className="text-muted text-sm">profile-app widget'ı yükleniyor...</p>
  ),
});

// MODÜL 6 · METHOD 1 Örneği: Individual component import
const CheckoutStep1 = dynamic(() => import("checkout/CheckoutStep1"), {
  ssr: false,
  loading: () => (
    <p className="text-muted text-sm">checkout step yükleniyor...</p>
  ),
});

export default function RemoteWidgets() {
  return (
    <div className="space-y-4">
      {/* Existing Widgets - METHOD 1 Basit Örnekler */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-card2 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-cyan text-xs font-bold tracking-widest">
              REMOTE · CHECKOUT-APP
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan/20 text-cyan">
              METHOD 1
            </span>
          </div>
          <CheckoutWidget itemCount={3} />
        </div>
        <div className="rounded-xl bg-card2 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-cyan text-xs font-bold tracking-widest">
              REMOTE · PROFILE-APP
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan/20 text-cyan">
              METHOD 1
            </span>
          </div>
          <ProfileWidget userName="Ayşe Yılmaz" />
        </div>
      </div>

      {/* MODÜL 6 · METHOD 1 Detaylı Örnek */}
      <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-purple-400 text-xs font-bold tracking-widest">
            MODÜL 6 · METHOD 1 ÖRNEK
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
            Individual Component
          </span>
        </div>
        <p className="text-muted text-sm mb-4">
          checkout-app'ten <code className="text-purple-400">CheckoutStep1</code> component'i 
          doğrudan import edilip kullanılıyor. Shell istediği gibi render edebilir.
        </p>
        <div className="bg-slate-900 rounded-lg p-4">
          <CheckoutStep1 
            initialItems={["Macbook Pro", "AirPods"]}
            onNext={(data) => {
              console.log("Method 1: Step completed", data);
              alert(`Sepet: ${data.items.length} ürün, Toplam: ₺${data.total}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
