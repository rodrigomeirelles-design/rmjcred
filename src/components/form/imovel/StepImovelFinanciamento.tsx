"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import {
  PropostaImovelFormData,
  TIPO_IMOVEL_OPTIONS,
  ESTADO_CONSERVACAO_OPTIONS,
  PRAZO_IMOVEL_OPTIONS,
} from "@/types/imovel";
import { UF_LIST } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskMoney, parseMoney } from "@/lib/utils";

interface StepImovelFinanciamentoProps {
  form: UseFormReturn<PropostaImovelFormData>;
}

const UF_OPTIONS = UF_LIST.map((uf) => ({ value: uf, label: uf }));

export default function StepImovelFinanciamento({ form }: StepImovelFinanciamentoProps) {
  const { register, control, watch, formState: { errors } } = form;
  const usarFgts = watch("usarFgts");

  return (
    <div className="space-y-6">
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Características do Imóvel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Tipo do Imóvel"
            required
            options={TIPO_IMOVEL_OPTIONS}
            placeholder="Selecione"
            error={errors.tipoImovel?.message}
            {...register("tipoImovel", { required: "Tipo do imóvel é obrigatório" })}
          />
          <Select
            label="Estado de Conservação"
            required
            options={ESTADO_CONSERVACAO_OPTIONS}
            placeholder="Selecione"
            error={errors.estadoConservacao?.message}
            {...register("estadoConservacao", { required: "Estado de conservação é obrigatório" })}
          />
          <Select
            label="UF do Imóvel"
            required
            options={UF_OPTIONS}
            placeholder="Selecione"
            error={errors.ufImovel?.message}
            {...register("ufImovel", { required: "UF do imóvel é obrigatória" })}
          />
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Valores e Prazo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="valorImovel"
            control={control}
            rules={{ required: "Valor do imóvel é obrigatório", min: { value: 1, message: "Informe o valor" } }}
            render={({ field }) => (
              <Input
                label="Valor do Imóvel"
                required
                inputMode="numeric"
                placeholder="R$ 0,00"
                error={errors.valorImovel?.message}
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <Controller
            name="valorFinanciamento"
            control={control}
            rules={{ required: "Valor do financiamento é obrigatório", min: { value: 1, message: "Informe o valor" } }}
            render={({ field }) => (
              <Input
                label="Valor do Financiamento"
                required
                inputMode="numeric"
                placeholder="R$ 0,00"
                error={errors.valorFinanciamento?.message}
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <Select
            label="Prazo Desejado"
            required
            options={PRAZO_IMOVEL_OPTIONS}
            placeholder="Selecione"
            error={errors.prazo?.message}
            {...register("prazo", { required: "Prazo é obrigatório" })}
          />
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
          FGTS
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          O FGTS pode ser utilizado como parte da entrada no financiamento imobiliário.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Utilizar FGTS?"
            options={[
              { value: "nao", label: "Não" },
              { value: "sim", label: "Sim" },
            ]}
            placeholder="Selecione"
            {...register("usarFgts")}
          />
          {usarFgts === "sim" && (
            <Controller
              name="valorFgts"
              control={control}
              render={({ field }) => (
                <Input
                  label="Saldo FGTS Estimado"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                  onChange={(e) => field.onChange(parseMoney(e.target.value))}
                />
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
