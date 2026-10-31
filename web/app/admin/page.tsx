import { AdminDashboard } from "@/components/AdminDashboard";
import { currentAdmin } from "@/lib/current-admin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await currentAdmin();
  if (!email) redirect("/admin/login");
  return (
    <main className="page admin">
      <AdminDashboard />
    </main>
  );
}
