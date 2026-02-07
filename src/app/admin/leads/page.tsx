import Link from "next/link";

import { prisma } from "../../../shared/lib/prisma";

export const dynamic = "force-dynamic";

const WARNING_TEXT = "Временная страница без авторизации (dev only)";

const formatDateTime = (value: Date | null) => {
  if (!value) {
    return "—";
  }

  const formatted = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(value);

  return formatted.replace(",", "");
};

const formatDateRange = (checkIn: Date | null, checkOut: Date | null) => {
  if (!checkIn && !checkOut) {
    return "—";
  }

  const start = checkIn ? formatDateTime(checkIn) : "—";
  const end = checkOut ? formatDateTime(checkOut) : "—";

  return `${start} – ${end}`;
};

export default async function AdminLeadsPage() {
  let leads = [] as Awaited<ReturnType<typeof prisma.lead.findMany>>;
  let loadError: string | null = null;

  try {
    leads = await prisma.lead.findMany({
      take: 50,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Неизвестная ошибка";
  }

  return (
    <section className="flex flex-col gap-6">
      {/* TODO: Add auth later. */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {WARNING_TEXT}
      </div>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Последние заявки
          </h1>
          <p className="text-sm text-slate-600">Показано {leads.length} из 50</p>
        </div>
        <Link className="text-sm text-slate-500 hover:text-slate-900" href="/">
          ← На главную
        </Link>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Не удалось загрузить заявки: {loadError}
        </div>
      ) : null}

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Даты</th>
              <th className="px-4 py-3">Гости</th>
              <th className="px-4 py-3">Детали</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top">
                <td className="px-4 py-3 text-slate-700">
                  {formatDateTime(lead.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-700">{lead.status}</td>
                <td className="px-4 py-3 text-slate-700">{lead.phone}</td>
                <td className="px-4 py-3 text-slate-700">{lead.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">
                  {formatDateRange(lead.checkIn, lead.checkOut)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {lead.guests ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <Link
                    className="text-sm font-medium text-slate-900 hover:text-slate-600"
                    href={`/admin/leads/${lead.id}`}
                  >
                    Подробнее
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {lead.status}
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {lead.phone}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                {formatDateTime(lead.createdAt)}
              </p>
            </div>
            <dl className="mt-4 grid gap-2 text-sm text-slate-700">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Имя
                </dt>
                <dd>{lead.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Даты
                </dt>
                <dd>{formatDateRange(lead.checkIn, lead.checkOut)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Гости
                </dt>
                <dd>{lead.guests ?? "—"}</dd>
              </div>
            </dl>
            <Link
              className="mt-4 inline-flex text-sm font-medium text-slate-900 hover:text-slate-600"
              href={`/admin/leads/${lead.id}`}
            >
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
