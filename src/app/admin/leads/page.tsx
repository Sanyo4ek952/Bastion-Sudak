import { redirect } from "next/navigation";

export default async function AdminLeadsPage() {
  redirect("/admin/requests");
}
