import { NextRequest, NextResponse } from "next/server";

// MODÜL 4 · Middleware: Route Öncesi İstek Ön İşleme
// Edge Runtime'da çalışır — auth kontrolü, i18n, A/B testing, rate limiting
// gibi hafif kararlar için tasarlanmıştır. Ağır iş mantığını burada
// çalıştırmayın; route handler veya Server Component'e taşıyın.

export function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const token = request.cookies.get("session_token");

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-app-name", "react-nextjs-enterprise-starter");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
