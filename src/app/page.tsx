import { LeadForm } from "../features/lead-form/LeadForm";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-16">
      <section className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Hotel Bastion
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Landing page placeholder
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Здесь будет страница бронирования отеля. Пока что мы собираем базовый
          каркас для MVP.
        </p>
        <div>
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Оставить заявку
          </a>
        </div>
      </section>

      <section
        id="lead-form"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Мы вам перезвоним
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Оставьте заявку на подбор номера
          </h2>
          <p className="text-base text-slate-600">
            Уточним детали поездки и предложим лучший вариант размещения.
          </p>
        </div>
        <LeadForm />
      </section>

      <div className="text-xs text-slate-400">
        <a className="hover:text-slate-600" href="/admin/leads">
          Admin
        </a>
      </div>
    </main>
  );
}
