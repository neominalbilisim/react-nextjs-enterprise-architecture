import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCheckoutStore, selectTotal } from "../store/useCheckoutStore";

// MODÜL 6 · Checkout Step 1 - Sepet Görüntüleme (Zustand + React Hook Form)
// Zustand ile state management + Form validation

// Yeni ürün ekleme için Zod şeması
const addItemSchema = z.object({
  itemName: z
    .string()
    .min(2, "Ürün adı en az 2 karakter olmalıdır")
    .max(50, "Ürün adı en fazla 50 karakter olabilir")
    .regex(/^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9\s]+$/, "Geçersiz karakter içeriyor"),
});

type AddItemFormData = z.infer<typeof addItemSchema>;

interface CheckoutStep1Props {
  onNext?: () => void;
  initialItems?: string[];
}

export default function CheckoutStep1({
  onNext,
  initialItems = ["Laptop", "Mouse", "Keyboard"],
}: CheckoutStep1Props) {
  const items = useCheckoutStore((state) => state.items);
  const total = useCheckoutStore(selectTotal);
  const addItem = useCheckoutStore((state) => state.addItem);
  const removeItem = useCheckoutStore((state) => state.removeItem);
  const updateItemQuantity = useCheckoutStore((state) => state.updateItemQuantity);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
    mode: "onChange",
  });

  // İlk yüklemede initial items'ı ekle (sadece items boşsa)
  useEffect(() => {
    if (items.length === 0 && initialItems.length > 0) {
      initialItems.forEach((name) => addItem(name));
    }
  }, []);

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const onSubmitItem = (data: AddItemFormData) => {
    addItem(data.itemName.trim());
    reset();
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };
  
  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + delta);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "600px" }}>
      <h2 style={{ margin: "0 0 20px", color: "#00B4D8", fontSize: 24 }}>
        Sepetim
      </h2>
      
      <div style={{ 
        background: "rgba(0, 180, 216, 0.1)", 
        padding: "16px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        {items.length === 0 ? (
          <p style={{ color: "#8BAAB8", margin: 0 }}>Sepetiniz boş</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {items.map((item, index) => (
              <li
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: index < items.length - 1 ? "1px solid rgba(139, 170, 184, 0.2)" : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#E8F4FD", marginBottom: "4px" }}>{item.name}</div>
                  <div style={{ color: "#8BAAB8", fontSize: "12px" }}>
                    ₺{item.price} x {item.quantity} = ₺{item.price * item.quantity}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    style={{
                      background: "rgba(0, 180, 216, 0.2)",
                      color: "#00B4D8",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    −
                  </button>
                  <span style={{ color: "#E8F4FD", minWidth: "20px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    style={{
                      background: "rgba(0, 180, 216, 0.2)",
                      color: "#00B4D8",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      background: "transparent",
                      color: "#FF6B6B",
                      border: "1px solid #FF6B6B",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Kaldır
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Yeni Ürün Ekleme Formu - React Hook Form ile */}
      <form onSubmit={handleSubmit(onSubmitItem)} style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              {...register("itemName")}
              placeholder="Yeni ürün ekle..."
              style={{
                flex: 1,
                padding: "10px",
                background: "rgba(15, 25, 35, 0.8)",
                border: errors.itemName
                  ? "1px solid #FF6B6B"
                  : "1px solid rgba(139, 170, 184, 0.3)",
                borderRadius: "4px",
                color: "#E8F4FD",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#00B4D8",
                color: "#0F1923",
                fontWeight: 700,
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Ekle
            </button>
          </div>
          {errors.itemName && (
            <p style={{ color: "#FF6B6B", fontSize: "12px", margin: 0 }}>
              {errors.itemName.message}
            </p>
          )}
        </div>
      </form>

      <div style={{
        background: "rgba(0, 180, 216, 0.15)",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#8BAAB8", fontSize: "16px" }}>Toplam:</span>
          <span style={{ color: "#00B4D8", fontSize: "24px", fontWeight: 700 }}>
            ₺{total}
          </span>
        </div>
      </div>

      {onNext && (
        <button
          onClick={handleNext}
          disabled={items.length === 0}
          style={{
            width: "100%",
            background: items.length === 0 ? "#555" : "#00B4D8",
            color: items.length === 0 ? "#888" : "#0F1923",
            fontWeight: 700,
            fontSize: "16px",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            cursor: items.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Ödemeye Geç →
        </button>
      )}
    </div>
  );
}
