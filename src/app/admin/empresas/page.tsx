import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/utils/auth";
import EmpresasClient from "./EmpresasClient";

export default async function AdminEmpresasPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("rmj_admin_session")?.value;
  const adminEmail = verifySessionToken(sessionToken);

  if (!adminEmail) {
    redirect("/admin/login");
  }

  return <EmpresasClient />;
}
