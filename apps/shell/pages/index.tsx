import Link from "next/link";

const modules = [
  {
    href: "/checkout/step1",
    title: "Modül 6 — Module Federation (Micro-Frontend)",
    desc: "checkout-app'ten federated pages kullanarak multi-step checkout flow. Shell üzerinden remote app sayfaları.",
    badge: "NEW",
    color: "cyan",
  },
  {
    href: "/dashboard",
    title: "Modül 3 & 4 — Zustand + BFF Dashboard",
    desc: "Zustand selector mimarisi ve /api/dashboard BFF route örneği (Middleware korumalı).",
  },
  {
    href: "/form-demo",
    title: "Modül 2 — React Hook Form + Zod",
    desc: "Uncontrolled form + runtime şema doğrulama örneği.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <p className="text-cyan text-sm font-bold tracking-widest mb-2">
        REACT &amp; NEXT.JS ENTERPRISE ARCHITECTURE
      </p>
      <h1 className="text-4xl font-bold mb-3">Başlangıç Projesi</h1>
      <p className="text-muted mb-10">
        Bu proje, Neominal Akademi eğitiminin 5 modülünde işlenen altyapıları
        (JSX/Props/State, Memoization &amp; RHF+Zod, Zustand, Next.js Pages
        Router/Middleware/BFF, Module Federation notları) barındıran boş bir
        iskelettir.
      </p>

      <ul className="space-y-4">
        {modules.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className={`block rounded-xl ${
                m.color === "cyan" 
                  ? "bg-cyan/10 border-2 border-cyan/30 hover:border-cyan/60" 
                  : "bg-card hover:bg-card2"
              } transition-colors p-5 relative`}
            >
              {m.badge && (
                <span className="absolute top-3 right-3 bg-cyan text-bg text-xs font-bold px-2 py-1 rounded">
                  {m.badge}
                </span>
              )}
              <p className={`font-bold text-lg ${m.color === "cyan" ? "text-cyan" : ""}`}>
                {m.title}
              </p>
              <p className="text-muted text-sm mt-1">{m.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Module Federation Info */}
      <div className="mt-10 p-5 rounded-xl bg-cyan/5 border border-cyan/20">
        <p className="text-cyan text-xs font-bold tracking-widest mb-2">
          💡 MODULE FEDERATION
        </p>
        <p className="text-muted text-sm mb-2">
          Modül 6'da, <strong className="text-cyan">checkout-app</strong> (port 3001) bağımsız çalışan bir remote uygulamadır. 
          Shell (bu uygulama), checkout-app'in sayfalarını runtime'da import eder. 
          Aynı route yapısı her iki uygulamada da çalışır!
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-purple-500/10 rounded border border-purple-500/30">
            <span className="text-purple-400 font-bold">✓ React Hook Form</span>
          </div>
          <div className="p-2 bg-cyan/10 rounded border border-cyan/30">
            <span className="text-cyan font-bold">✓ Zod Validation</span>
          </div>
          <div className="p-2 bg-yellow/10 rounded border border-yellow/30">
            <span className="text-yellow font-bold">✓ Zustand State</span>
          </div>
          <div className="p-2 bg-green-500/10 rounded border border-green-500/30">
            <span className="text-green-400 font-bold">✓ Type-Safe</span>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/checkout/step1" className="inline-flex px-4 py-2 bg-cyan text-bg rounded font-bold hover:bg-cyan/80 transition-colors">
            Checkout'a Git →
          </Link>
        </div>
      </div>
    </main>
  );
}
