import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Permitir rotas de login e recuperação de senha
    if (pathname === "/admin/login" || pathname === "/admin/esqueci-senha") {
      return NextResponse.next();
    }

    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
