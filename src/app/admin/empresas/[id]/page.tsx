import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/utils/auth";
import EmpresaDetalheClient from "./EmpresaDetalheClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEmpresaDetalhePage({ params }: Props) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("rmj_admin_session")?.value;
  const adminEmail = verifySessionToken(sessionToken);

  if (!adminEmail) {
    redirect("/admin/login");
  }

  const { id } = await params;
  return <EmpresaDetalheClient id={id} />;
}
