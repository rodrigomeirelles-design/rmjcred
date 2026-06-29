import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Dados Pessoais" },
  { number: 2, label: "Profissão e Renda" },
  { number: 3, label: "Veículo" },
  { number: 4, label: "Envio" },
];

interface StepperVeiculoProps {
  currentStep: number;
}

export default function StepperVeiculo({ currentStep }: StepperVeiculoProps) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mb-8">
      <p className="text-center text-xs font-semibold uppercase tracking-widest mb-5 sm:hidden" style={{ color: "#ee661b" }}>
        Etapa {currentStep} de {STEPS.length} — {STEPS[currentStep - 1]?.label}
      </p>

      <div className="relative flex items-start justify-between">
        <div className="absolute left-0 right-0 top-4 h-0.5 -z-10" style={{ background: "#D8E2EE" }} />
        <div
          className="absolute left-0 top-4 h-0.5 -z-10 transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: "#ee661b" }}
        />

        {STEPS.map((step) => {
          const done   = step.number < currentStep;
          const active = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2.5 relative">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                done   && "text-white shadow-md",
                active && "text-white shadow-lg scale-110",
                !done && !active && "border-2 bg-white"
              )} style={{
                background: done || active ? "#ee661b" : undefined,
                borderColor: !done && !active ? "#D8E2EE" : undefined,
                color: !done && !active ? "#5A6E88" : undefined,
                boxShadow: active ? "0 0 0 4px rgb(238 102 27 / 0.18)" : undefined,
              }}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.number}
              </div>

              <span className={cn(
                "text-xs font-semibold hidden sm:block text-center leading-tight",
                active && "text-[#ee661b]",
                done   && "text-[#234469]",
                !done && !active && "text-[#5A6E88]"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
