import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCheckoutStore } from "../store/useCheckoutStore";

// MODÜL 6 · Checkout Step 2 - Ödeme Bilgileri (React Hook Form + Zod)
// Form validation ile güvenli ve tip-safe form yönetimi + Zustand state

// Zod validation şeması
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(19, "Kart numarası 16 haneli olmalıdır")
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Geçerli bir kart numarası giriniz"),
  cardName: z
    .string()
    .min(3, "İsim en az 3 karakter olmalıdır")
    .max(50, "İsim en fazla 50 karakter olabilir")
    .regex(/^[A-ZÇĞİÖŞÜ\s]+$/, "Sadece büyük harfler kullanınız"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY formatında giriniz")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    }, "Geçerli bir son kullanma tarihi giriniz"),
  cvv: z
    .string()
    .length(3, "CVV 3 haneli olmalıdır")
    .regex(/^\d{3}$/, "Sadece rakam giriniz"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CheckoutStep2Props {
  onNext?: (data: { cardNumber: string; name: string }) => void;
  onBack?: () => void;
  total?: number;
  items?: string[];
}

export default function CheckoutStep2({
  onNext,
  onBack,
  total = 0,
  items = [],
}: CheckoutStep2Props) {
  const setPaymentInfo = useCheckoutStore((state) => state.setPaymentInfo);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PaymentFormData) => {
    // Zustand store'a kaydet
    setPaymentInfo({
      cardNumber: data.cardNumber,
      cardName: data.cardName,
      cvv: data.cvv,
      expiry: data.expiry,
    });
    
    // Callback'i çağır
    if (onNext) {
      onNext({ cardNumber: data.cardNumber, name: data.cardName });
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + "/" + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  // Random data generator (React Hook Form versiyonu)
  const fillRandomData = () => {
    const names = [
      "AHMET YILMAZ",
      "AYŞE KAYA",
      "MEHMET DEMİR",
      "FATMA ÇELİK",
      "ALİ YILDIZ",
      "ZEYNEP AKIN",
      "MUSTAFA ÖZTÜRK",
      "ELİF ARSLAN",
    ];

    // Random kart numarası (4 grup x 4 digit)
    const randomCard = Array(4)
      .fill(0)
      .map(() => Math.floor(1000 + Math.random() * 9000).toString())
      .join(" ");

    // Random isim
    const randomName = names[Math.floor(Math.random() * names.length)];

    // Random CVV (3 digit)
    const randomCvv = Math.floor(100 + Math.random() * 900).toString();

    // Random expiry (gelecek 1-5 yıl arası)
    const currentYear = new Date().getFullYear() % 100;
    const randomMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, "0");
    const randomYear = String(currentYear + Math.floor(1 + Math.random() * 5)).padStart(2, "0");
    const randomExpiry = `${randomMonth}/${randomYear}`;

    // React Hook Form ile değerleri set et
    setValue("cardNumber", randomCard, { shouldValidate: true });
    setValue("cardName", randomName, { shouldValidate: true });
    setValue("cvv", randomCvv, { shouldValidate: true });
    setValue("expiry", randomExpiry, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "600px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#00B4D8", fontSize: 24 }}>
          Ödeme Bilgileri
        </h2>
        <button
          type="button"
          onClick={fillRandomData}
          style={{
            background: "rgba(0, 180, 216, 0.2)",
            color: "#00B4D8",
            border: "1px solid rgba(0, 180, 216, 0.3)",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          🎲 Random Doldur
        </button>
      </div>

      {/* Sipariş Özeti */}
      <div style={{
        background: "rgba(0, 180, 216, 0.1)",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "24px",
      }}>
        <p style={{ margin: "0 0 8px", color: "#8BAAB8", fontSize: "12px", textTransform: "uppercase", letterSpacing: 1 }}>
          Sipariş Özeti
        </p>
        <p style={{ margin: "0 0 4px", color: "#E8F4FD" }}>
          {items.length} ürün
        </p>
        <p style={{ margin: 0, color: "#00B4D8", fontSize: "20px", fontWeight: 700 }}>
          Toplam: ₺{total.toLocaleString()}
        </p>
      </div>

      {/* Kart Bilgileri Formu - React Hook Form ile */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#8BAAB8", fontSize: "14px" }}>
          Kart Numarası *
        </label>
        <input
          type="text"
          {...register("cardNumber")}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value);
            setValue("cardNumber", formatted, { shouldValidate: true });
          }}
          placeholder="1234 5678 9012 3456"
          style={{
            width: "100%",
            padding: "12px",
            background: "rgba(15, 25, 35, 0.8)",
            border: errors.cardNumber 
              ? "1px solid #FF6B6B" 
              : "1px solid rgba(139, 170, 184, 0.3)",
            borderRadius: "8px",
            color: "#E8F4FD",
            fontSize: "16px",
            fontFamily: "monospace",
            letterSpacing: "1px",
          }}
        />
        {errors.cardNumber && (
          <p style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px", marginBottom: 0 }}>
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#8BAAB8", fontSize: "14px" }}>
          Kart Üzerindeki İsim *
        </label>
        <input
          type="text"
          {...register("cardName")}
          onChange={(e) => {
            const upper = e.target.value.toUpperCase();
            setValue("cardName", upper, { shouldValidate: true });
          }}
          placeholder="AHMET YILMAZ"
          style={{
            width: "100%",
            padding: "12px",
            background: "rgba(15, 25, 35, 0.8)",
            border: errors.cardName
              ? "1px solid #FF6B6B"
              : "1px solid rgba(139, 170, 184, 0.3)",
            borderRadius: "8px",
            color: "#E8F4FD",
            fontSize: "16px",
            textTransform: "uppercase",
          }}
        />
        {errors.cardName && (
          <p style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px", marginBottom: 0 }}>
            {errors.cardName.message}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#8BAAB8", fontSize: "14px" }}>
            Son Kullanma *
          </label>
          <input
            type="text"
            {...register("expiry")}
            onChange={(e) => {
              const formatted = formatExpiry(e.target.value);
              setValue("expiry", formatted, { shouldValidate: true });
            }}
            placeholder="MM/YY"
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(15, 25, 35, 0.8)",
              border: errors.expiry
                ? "1px solid #FF6B6B"
                : "1px solid rgba(139, 170, 184, 0.3)",
              borderRadius: "8px",
              color: "#E8F4FD",
              fontSize: "16px",
              fontFamily: "monospace",
            }}
          />
          {errors.expiry && (
            <p style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px", marginBottom: 0 }}>
              {errors.expiry.message}
            </p>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#8BAAB8", fontSize: "14px" }}>
            CVV *
          </label>
          <input
            type="text"
            {...register("cvv")}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").substr(0, 3);
              setValue("cvv", cleaned, { shouldValidate: true });
            }}
            placeholder="123"
            maxLength={3}
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(15, 25, 35, 0.8)",
              border: errors.cvv
                ? "1px solid #FF6B6B"
                : "1px solid rgba(139, 170, 184, 0.3)",
              borderRadius: "8px",
              color: "#E8F4FD",
              fontSize: "16px",
              fontFamily: "monospace",
            }}
          />
          {errors.cvv && (
            <p style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px", marginBottom: 0 }}>
              {errors.cvv.message}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              flex: 1,
              background: "transparent",
              color: "#8BAAB8",
              fontWeight: 700,
              fontSize: "16px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid rgba(139, 170, 184, 0.3)",
              cursor: "pointer",
            }}
          >
            ← Geri
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid}
          style={{
            flex: 2,
            background: isValid ? "#00B4D8" : "#555",
            color: isValid ? "#0F1923" : "#888",
            fontWeight: 700,
            fontSize: "16px",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Ödemeyi Tamamla →
        </button>
      </div>
    </form>
  );
}
