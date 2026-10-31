import { AdminLoginForm } from "@/components/AdminLoginForm";
import { currentAdmin } from "@/lib/current-admin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const email = await currentAdmin();
  if (email) redirect("/admin");
  return (
    <main className="page admin">
      <AdminLoginForm />
    </main>
  );
}
