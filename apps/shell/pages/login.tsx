// Middleware, session_token cookie'si olmayan kullanıcıları /dashboard
// altındaki route'lardan buraya yönlendirir (bkz. middleware.ts).

export default function LoginPage() {
  return (
    <main className="px-6 py-16 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-3">Giriş Yap</h1>
      <p className="text-muted text-sm">
        Bu bir placeholder sayfadır. Gerçek bir auth akışı burada
        uygulanmalıdır.
      </p>
    </main>
  );
}
