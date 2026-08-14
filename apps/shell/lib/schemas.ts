import { z } from "zod";

// MODÜL 2 · Zod ile Schema Validation
// TypeScript tip çıkarımı (type inference) buradan otomatik türetilir —
// form verisinin tipi bu şemadan gelir, ayrıca elle bir interface yazmaya
// gerek kalmaz.

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
