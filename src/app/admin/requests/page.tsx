import { Prisma } from "@prisma/client";
import Link from "next/link";

import { RequestStatusForm } from "../../../features/admin/RequestStatusForm";
import { prisma } from "../../../shared/lib/prisma";

export const dynamic = "force-dynamic";

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

const STATUS_OPTIONS = [
  "ALL",
  "NEW",
  "IN_PROGRESS",
  "CONFIRMED",
  "DECLINED",
  "SPAM"
] as const;

export default async function AdminRequestsPage({
  searchParams
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = STATUS_OPTIONS.includes(
    (searchParams.status ?? "ALL") as (typeof STATUS_OPTIONS)[number]
  )
    ? (searchParams.status ?? "ALL")
    : "ALL";

  const where =
    statusFilter === "ALL"
      ? undefined
      : {
          status: statusFilter
        };

  type RequestWithRoom = Prisma.BookingRequestGetPayload<{
    include: { room: true };
  }>;
  let requests: RequestWithRoom[] = [];
  let loadError: string | null = null;

  try {
    requests = await prisma.bookingRequest.findMany({
      where,
      take: 100,
      orderBy: { createdAt: "desc" },
      include: { room: true }
    });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Неизвестная ошибка";
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Заявки на бронирование
          </h1>
          <p className="text-sm text-slate-600">
            Показано {requests.length} из 100
          </p>
        </div>
        <Link className="text-sm text-slate-500 hover:text-slate-900" href="/">
          ← На главную
        </Link>
      </header>

      <div className="flex flex-wrap gap-2 text-sm">
        {STATUS_OPTIONS.map((option) => {
          const label = option === "ALL" ? "Все" : option;
          const active = statusFilter === option;
          return (
            <Link
              key={option}
              href={
                option === "ALL"
                  ? "/admin/requests"
                  : `/admin/requests?status=${option}`
              }
              className={`rounded-full border px-4 py-1 ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Не удалось загрузить заявки: {loadError}
        </div>
      ) : null}

      <div className="grid gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {request.status}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {request.phone}
                </p>
                <p className="text-sm text-slate-600">
                  {request.name ?? "Без имени"}
                </p>
              </div>
              <div className="text-sm text-slate-600">
                {formatDateTime(request.createdAt)}
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Номер
                </dt>
                <dd>{request.room?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Даты
                </dt>
                <dd>{formatDateRange(request.checkIn, request.checkOut)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Гостей
                </dt>
                <dd>{request.guests ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Сумма
                </dt>
                <dd>
                  {request.totalPrice
                    ? `${request.totalPrice} ${request.currency ?? "RUB"}`
                    : "—"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Комментарий
                </dt>
                <dd>{request.comment ?? "—"}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <RequestStatusForm
                id={request.id}
                currentStatus={request.status}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
