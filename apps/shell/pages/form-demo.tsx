import ContactForm from "@/components/ContactForm";

export default function FormDemoPage() {
  return (
    <main className="px-6 py-16 max-w-md mx-auto">
      <p className="text-cyan text-sm font-bold tracking-widest mb-2">
        MODÜL 2 · RHF + ZOD
      </p>
      <h1 className="text-2xl font-bold mb-6">İletişim Formu Örneği</h1>
      <ContactForm />
    </main>
  );
}
