import Link from "next/link";

const modules = [
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
              className="block rounded-xl bg-card hover:bg-card2 transition-colors p-5"
            >
              <p className="font-bold text-lg">{m.title}</p>
              <p className="text-muted text-sm mt-1">{m.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
