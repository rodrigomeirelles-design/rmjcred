import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Dados da Empresa" },
  { number: 2, label: "Sócios" },
  { number: 3, label: "Conta Bancária" },
  { number: 4, label: "Envio" },
];

interface FormStepperProps {
  currentStep: number;
}

export default function FormStepper({ currentStep }: FormStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-[var(--color-border)] -z-10" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-[var(--color-brand-primary)] -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step) => {
          const done = step.number < currentStep;
          const active = step.number === currentStep;
          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ring-4",
                done && "bg-[var(--color-brand-primary)] text-white ring-blue-100",
                active && "bg-[var(--color-brand-primary)] text-white ring-blue-100 scale-110",
                !done && !active && "bg-white text-[var(--color-text-muted)] border-2 border-[var(--color-border)] ring-transparent"
              )}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.number}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                active ? "text-[var(--color-brand-primary)]" : "text-[var(--color-text-muted)]"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-[var(--color-text-muted)] mt-4 sm:hidden">
        Etapa {currentStep}: {STEPS[currentStep - 1]?.label}
      </p>
    </div>
  );
}
