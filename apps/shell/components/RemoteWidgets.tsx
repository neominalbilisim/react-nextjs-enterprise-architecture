"use client";

// MODÜL 5 · Remote Widget Yükleme
// Federated modüller sadece tarayıcıda çözülebildiği için next/dynamic
// ile ssr:false olarak import edilir. Host, Remote'un iç implementasyonundan
// habersizdir — sadece dışarı açılan (exposes) component'i tüketir.

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

export default function RemoteWidgets() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-xl bg-card2 p-5">
        <p className="text-cyan text-xs font-bold tracking-widest mb-2">
          REMOTE · CHECKOUT-APP
        </p>
        <CheckoutWidget itemCount={3} />
      </div>
      <div className="rounded-xl bg-card2 p-5">
        <p className="text-cyan text-xs font-bold tracking-widest mb-2">
          REMOTE · PROFILE-APP
        </p>
        <ProfileWidget userName="Ayşe Yılmaz" />
      </div>
    </div>
  );
}
