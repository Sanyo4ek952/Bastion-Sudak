import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "../../../../shared/lib/prisma";

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

const formatJson = (value: unknown) => {
  if (!value) {
    return "—";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "—";
  }
};

type LeadDetailsPageProps = {
  params: { id: string };
};

export default async function LeadDetailsPage({
  params
}: LeadDetailsPageProps) {
  const { id } = params;

  let lead: Awaited<ReturnType<typeof prisma.lead.findUnique>> = null;
  let loadError: string | null = null;

  try {
    lead = await prisma.lead.findUnique({
      where: { id }
    });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Неизвестная ошибка";
  }

  if (!lead) {
    if (loadError) {
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
                Заявка недоступна
              </h1>
              <p className="text-sm text-slate-600">ID: {id}</p>
            </div>
            <Link
              className="text-sm text-slate-500 hover:text-slate-900"
              href="/"
            >
              ← На главную
            </Link>
          </header>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Не удалось загрузить заявку: {loadError}
          </div>
        </section>
      );
    }

    notFound();
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
            Заявка {lead.id}
          </h1>
          <p className="text-sm text-slate-600">
            Создана {formatDateTime(lead.createdAt)}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link
            className="text-slate-500 hover:text-slate-900"
            href="/admin/leads"
          >
            ← К списку
          </Link>
          <Link className="text-slate-500 hover:text-slate-900" href="/">
            На главную
          </Link>
        </div>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Статус
            </dt>
            <dd className="text-base text-slate-900">{lead.status}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Телефон
            </dt>
            <dd className="text-base text-slate-900">{lead.phone}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Имя
            </dt>
            <dd className="text-base text-slate-900">{lead.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Гости
            </dt>
            <dd className="text-base text-slate-900">{lead.guests ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Заезд
            </dt>
            <dd className="text-base text-slate-900">
              {formatDateTime(lead.checkIn)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Выезд
            </dt>
            <dd className="text-base text-slate-900">
              {formatDateTime(lead.checkOut)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Комментарий
            </dt>
            <dd className="text-base text-slate-900">
              {lead.comment ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Источник
            </dt>
            <dd className="text-base text-slate-900">
              {lead.source ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Страница
            </dt>
            <dd className="text-base text-slate-900">
              {lead.pageUrl ?? "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              User-Agent
            </dt>
            <dd className="text-base text-slate-900">
              {lead.userAgent ?? "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
              UTM
            </dt>
            <dd className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap text-xs text-slate-700">
                {formatJson(lead.utm)}
              </pre>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
