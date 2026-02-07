export type StepperProps = {
  steps: string[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;
        return (
          <div key={step} className="flex items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                isActive
                  ? "bg-sea-500 text-sand-50"
                  : isComplete
                    ? "bg-gold-500 text-stone-900"
                    : "border border-sand-100 text-stone-600"
              ].join(" ")}
            >
              {index + 1}
            </span>
            <span
              className={
                isActive
                  ? "text-sm font-semibold text-stone-900"
                  : "text-sm text-stone-600"
              }
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
