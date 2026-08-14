// MODÜL 5 · Bu component 'exposes' ile dışarı açılmıştır.

export default function ProfileWidget({
  userName = "Misafir",
}: {
  userName?: string;
}) {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FFD166",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#0F1923",
          }}
        >
          {userName.charAt(0)}
        </div>
        <div>
          <p style={{ margin: 0, color: "#E8F4FD", fontSize: 14, fontWeight: 700 }}>
            {userName}
          </p>
          <p style={{ margin: 0, color: "#8BAAB8", fontSize: 12 }}>
            profile-app · Remote
          </p>
        </div>
      </div>
    </div>
  );
}
