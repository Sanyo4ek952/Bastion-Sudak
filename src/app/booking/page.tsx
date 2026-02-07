import { BookingForm } from "../../components/BookingForm";
import { Container } from "../../shared/ui/Container";
import { SectionHeader } from "../../shared/ui/SectionHeader";

export default function BookingPage() {
  return (
    <section className="py-12">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Бронирование"
          title="Соберите вашу поездку"
          subtitle="Пошагово выберите даты, количество гостей и дополнительные услуги."
        />
        <BookingForm />
      </Container>
    </section>
  );
}
