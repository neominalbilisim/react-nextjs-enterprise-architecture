import ProfileWidget from "../components/ProfileWidget";

export default function ProfileStandalonePage() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", background: "#0F1923", minHeight: "100vh", color: "#E8F4FD" }}>
      <p style={{ color: "#00B4D8", fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>
        PROFILE-APP · STANDALONE
      </p>
      <h1>Profile Remote — Bağımsız Çalışma Modu</h1>
      <div style={{ marginTop: 24 }}>
        <ProfileWidget userName="Ayşe Yılmaz" />
      </div>
    </main>
  );
}
