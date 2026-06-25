import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  
  if (!token) {
    redirect("/admin/login");
  }
  
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    redirect("/admin/login");
  }
}
