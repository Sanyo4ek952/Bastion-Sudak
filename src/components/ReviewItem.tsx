import { Badge, Card, CardContent, Muted, Text } from "../shared/ui";

export type ReviewItemProps = {
  name: string;
  rating: number;
  text: string;
};

export function ReviewItem({ name, rating, text }: ReviewItemProps) {
  return (
    <Card className="shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Text className="font-semibold">{name}</Text>
          <Badge className="bg-sand-100 text-xs text-stone-900">
            {rating.toFixed(1)} ★
          </Badge>
        </div>
        <Muted className="mt-3">{text}</Muted>
      </CardContent>
    </Card>
  );
}
