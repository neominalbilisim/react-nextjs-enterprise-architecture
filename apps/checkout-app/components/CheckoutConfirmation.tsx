import { useCheckoutStore } from "../store/useCheckoutStore";

// MODÜL 6 · Checkout Confirmation - Onay Sayfası (Enhanced)
// Detaylı sipariş bilgileri ve print-friendly dark theme

interface CheckoutConfirmationProps {
  orderNumber?: string;
  items?: string[];
  total?: number;
  cardNumber?: string;
  onReset?: () => void;
}

export default function CheckoutConfirmation({
  orderNumber = `ORD-${Date.now().toString().slice(-6)}`,
  items = [],
  total = 0,
  cardNumber = "",
  onReset,
}: CheckoutConfirmationProps) {
  const maskedCard = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : "";
  
  // Zustand'dan detaylı ürün bilgisi al
  const cartItems = useCheckoutStore((state) => state.items);
  const cardName = useCheckoutStore((state) => state.cardName);
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: #0F1923 !important;
            color: #E8F4FD !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          @page {
            margin: 1cm;
            background: #0F1923;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          button {
            display: none !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "600px" }}>
        {/* Success Icon */}
      <div style={{
        width: "80px",
        height: "80px",
        background: "rgba(0, 180, 216, 0.2)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
      }}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00B4D8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h2 style={{
        margin: "0 0 8px",
        color: "#00B4D8",
        fontSize: 28,
        textAlign: "center",
      }}>
        Siparişiniz Alındı!
      </h2>

      <p style={{
        margin: "0 0 32px",
        color: "#8BAAB8",
        textAlign: "center",
        fontSize: 16,
      }}>
        Ödemeniz başarıyla tamamlandı
      </p>

      {/* Customer Info */}
      {cardName && (
        <div style={{
          background: "rgba(0, 180, 216, 0.05)",
          border: "1px solid rgba(0, 180, 216, 0.2)",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <p style={{
            margin: "0 0 8px",
            color: "#00B4D8",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontWeight: 700,
          }}>
            👤 Müşteri Bilgileri
          </p>
          <div style={{ color: "#E8F4FD", fontSize: "16px", fontWeight: 600 }}>
            {cardName}
          </div>
          {maskedCard && (
            <div style={{ 
              color: "#8BAAB8", 
              fontSize: "14px", 
              marginTop: "4px",
              fontFamily: "monospace",
            }}>
              {maskedCard}
            </div>
          )}
        </div>
      )}

      {/* Order Details */}
      <div style={{
        background: "rgba(0, 180, 216, 0.1)",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px",
      }}>
        <p style={{
          margin: "0 0 16px",
          color: "#00B4D8",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 700,
        }}>
          📋 Sipariş Detayları
        </p>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(139, 170, 184, 0.2)",
          marginBottom: "16px",
        }}>
          <span style={{ color: "#8BAAB8", fontSize: "14px" }}>Sipariş Numarası</span>
          <span style={{ color: "#E8F4FD", fontWeight: 700, fontFamily: "monospace" }}>
            {orderNumber}
          </span>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(139, 170, 184, 0.2)",
          marginBottom: "16px",
        }}>
          <span style={{ color: "#8BAAB8", fontSize: "14px" }}>Sipariş Tarihi</span>
          <span style={{ color: "#E8F4FD", fontWeight: 700 }}>
            {new Date().toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ color: "#8BAAB8", fontSize: "16px" }}>Toplam Tutar</span>
          <span style={{ color: "#00B4D8", fontSize: "28px", fontWeight: 700 }}>
            ₺{total}
          </span>
        </div>
      </div>

      {/* Items List - Detailed */}
      {cartItems.length > 0 && (
        <div style={{
          background: "rgba(15, 25, 35, 0.5)",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <p style={{
            margin: "0 0 16px",
            color: "#00B4D8",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontWeight: 700,
          }}>
            🛒 Satın Alınan Ürünler
          </p>
          
          {/* Table Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "12px",
            paddingBottom: "12px",
            borderBottom: "2px solid rgba(0, 180, 216, 0.3)",
            marginBottom: "12px",
          }}>
            <span style={{ color: "#8BAAB8", fontSize: "12px", fontWeight: 700 }}>ÜRÜN</span>
            <span style={{ color: "#8BAAB8", fontSize: "12px", fontWeight: 700, textAlign: "right" }}>FİYAT</span>
            <span style={{ color: "#8BAAB8", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>ADET</span>
            <span style={{ color: "#8BAAB8", fontSize: "12px", fontWeight: 700, textAlign: "right" }}>TOPLAM</span>
          </div>

          {/* Items */}
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "12px",
                padding: "12px 0",
                borderBottom: index < cartItems.length - 1 
                  ? "1px solid rgba(139, 170, 184, 0.2)" 
                  : "none",
              }}
            >
              <span style={{ color: "#E8F4FD", fontSize: "14px" }}>{item.name}</span>
              <span style={{ color: "#E8F4FD", fontSize: "14px", textAlign: "right" }}>₺{item.price}</span>
              <span style={{ color: "#E8F4FD", fontSize: "14px", textAlign: "center" }}>x{item.quantity}</span>
              <span style={{ color: "#00B4D8", fontSize: "14px", fontWeight: 700, textAlign: "right" }}>
                ₺{item.price * item.quantity}
              </span>
            </div>
          ))}

          {/* Subtotal */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "12px",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "2px solid rgba(0, 180, 216, 0.3)",
          }}>
            <span></span>
            <span></span>
            <span style={{ color: "#8BAAB8", fontSize: "14px", fontWeight: 700, textAlign: "center" }}>
              TOPLAM:
            </span>
            <span style={{ color: "#00B4D8", fontSize: "18px", fontWeight: 700, textAlign: "right" }}>
              ₺{total}
            </span>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div style={{
        background: "rgba(0, 180, 216, 0.05)",
        border: "1px solid rgba(0, 180, 216, 0.2)",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "24px",
      }}>
        <p style={{ margin: "0 0 8px", color: "#00B4D8", fontSize: "14px", fontWeight: 700 }}>
          📧 E-posta gönderildi
        </p>
        <p style={{ margin: 0, color: "#8BAAB8", fontSize: "13px", lineHeight: 1.5 }}>
          Sipariş detaylarınız e-posta adresinize gönderilmiştir. Kargo takip numarası
          ürün hazırlandıktan sonra tarafınıza iletilecektir.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px" }} className="no-print">
        <button
          onClick={handlePrint}
          style={{
            flex: 1,
            background: "rgba(0, 180, 216, 0.2)",
            color: "#00B4D8",
            fontWeight: 700,
            fontSize: "14px",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid rgba(0, 180, 216, 0.3)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 180, 216, 0.3)";
            e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 180, 216, 0.2)";
            e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.3)";
          }}
        >
          🖨️ Yazdır / PDF
        </button>
        {onReset && (
          <button
            onClick={onReset}
            style={{
              flex: 2,
              background: "#00B4D8",
              color: "#0F1923",
              fontWeight: 700,
              fontSize: "14px",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00A5C8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#00B4D8";
            }}
          >
            🔄 Yeni Sipariş Ver
          </button>
        )}
      </div>
      </div>
    </>
  );
}
