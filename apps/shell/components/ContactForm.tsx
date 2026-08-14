"use client";

// MODÜL 2 · React Hook Form (RHF) + Zod
// Uncontrolled (ref tabanlı) yaklaşım: her tuş vuruşunda React state
// güncellenmez, DOM'dan değer doğrudan okunur → minimum re-render.
// Zod resolver, submit anında (veya alan bazlı) otomatik doğrulama yapar.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "@/lib/schemas";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // örnek gecikme
    console.log("Form gönderildi:", values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm mb-1 text-muted">Ad Soyad</label>
        <input
          {...register("fullName")}
          className="w-full rounded-lg bg-card2 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan"
        />
        {errors.fullName && (
          <p className="text-yellow text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1 text-muted">E-posta</label>
        <input
          {...register("email")}
          className="w-full rounded-lg bg-card2 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan"
        />
        {errors.email && (
          <p className="text-yellow text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1 text-muted">Mesaj</label>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full rounded-lg bg-card2 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan"
        />
        {errors.message && (
          <p className="text-yellow text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-cyan text-bg font-bold px-5 py-2 text-sm disabled:opacity-50"
      >
        {isSubmitting ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
