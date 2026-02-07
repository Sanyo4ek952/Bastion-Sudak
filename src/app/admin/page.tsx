import Link from "next/link";

export default function AdminHomePage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
      </div>
      <div className="flex flex-col gap-3 text-sm text-slate-700">
        <Link className="hover:text-slate-900" href="/admin/rooms">
          Номера
        </Link>
        <Link className="hover:text-slate-900" href="/admin/prices">
          Сезонные цены
        </Link>
        <Link className="hover:text-slate-900" href="/admin/requests">
          Заявки
        </Link>
      </div>
    </section>
  );
}
