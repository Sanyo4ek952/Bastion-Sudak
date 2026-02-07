import { redirect } from "next/navigation";

export default async function LeadDetailsPage() {
  redirect("/admin/requests");
}
