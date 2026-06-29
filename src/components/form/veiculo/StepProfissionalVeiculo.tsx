"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import {
  PropostaVeiculoFormData,
  BANCO_VEICULO_OPTIONS,
  TIPO_CONTA_OPTIONS,
  AUTONOMO_TEMPO_OPTIONS,
} from "@/types/veiculo";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskPhone, maskMoney, parseMoney } from "@/lib/utils";

interface Props {
  form: UseFormReturn<PropostaVeiculoFormData>;
}

const SITUACAO_OPTIONS = [
  { value: "assalariado", label: "Assalariado / CLT" },
  { value: "autonomo",    label: "Autônomo / Empresário" },
  { value: "aposentado",  label: "Aposentado / Pensionista" },
] as const;

export default function StepProfissionalVeiculo({ form }: Props) {
  const { register, control, watch, formState: { errors } } = form;
  const situacao = watch("situacao_profissional");
  const isAssalariado = situacao === "assalariado";
  const isAutonomo    = situacao === "autonomo";

  return (
    <div className="space-y-6">
      {/* Situação profissional */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Situação Profissional
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {SITUACAO_OPTIONS.map((opt) => {
            const active = situacao === opt.value;
            return (
              <label
                key={opt.value}
                className="flex-1 flex items-center gap-3 cursor-pointer rounded-xl border-2 px-4 py-3 transition-all"
                style={{
                  borderColor: active ? "#ee661b" : "#D8E2EE",
                  background:  active ? "rgb(238 102 27 / 0.06)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="accent-[#ee661b]"
                  {...register("situacao_profissional", { required: "Selecione a situação profissional" })}
                />
                <span className="text-sm font-medium" style={{ color: active ? "#ee661b" : "#5A6E88" }}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.situacao_profissional && (
          <p className="text-xs text-red-500 -mt-3 mb-3">{errors.situacao_profissional.message}</p>
        )}

        {/* Assalariado */}
        {isAssalariado && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Empresa onde trabalha"
                required
                error={errors.empresa?.message}
                {...register("empresa", { required: isAssalariado ? "Empresa é obrigatória" : false })}
              />
            </div>
            <Input
              label="CNPJ da empresa"
              placeholder="00.000.000/0000-00"
              {...register("empresa_cnpj")}
            />
            <Input
              label="Cargo"
              required
              error={errors.cargo?.message}
              {...register("cargo", { required: isAssalariado ? "Cargo é obrigatório" : false })}
            />
            <Input
              label="Data de admissão"
              type="date"
              required
              error={errors.data_admissao?.message}
              {...register("data_admissao", { required: isAssalariado ? "Data de admissão é obrigatória" : false })}
            />
          </div>
        )}

        {/* Autônomo / Empresário */}
        {isAutonomo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome da empresa / negócio"
                placeholder="Opcional"
                {...register("autonomo_empresa")}
              />
            </div>
            <Input
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              {...register("autonomo_cnpj")}
            />
            <Input
              label="Atividade exercida"
              required
              error={errors.autonomo_atividade?.message}
              {...register("autonomo_atividade", { required: isAutonomo ? "Atividade é obrigatória" : false })}
            />
            <Select
              label="Tempo de atividade"
              required
              options={AUTONOMO_TEMPO_OPTIONS}
              placeholder="Selecione"
              error={errors.autonomo_tempo?.message}
              {...register("autonomo_tempo", { required: isAutonomo ? "Tempo de atividade é obrigatório" : false })}
            />
          </div>
        )}

        {/* Renda — comum a todos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Controller
            name="renda_mensal"
            control={control}
            rules={{ required: "Renda mensal é obrigatória", min: { value: 1, message: "Informe a renda" } }}
            render={({ field }) => (
              <Input
                label="Renda mensal bruta"
                required
                inputMode="numeric"
                placeholder="R$ 0,00"
                error={errors.renda_mensal?.message}
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <Input
            label="Outras rendas"
            placeholder="Ex: aluguel, pensão..."
            {...register("outras_rendas")}
          />
          <Controller
            name="outras_rendas_valor"
            control={control}
            render={({ field }) => (
              <Input
                label="Valor total de outras rendas"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
        </div>
      </div>

      {/* Dados bancários */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Dados Bancários
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Banco principal"
            required
            options={BANCO_VEICULO_OPTIONS}
            placeholder="Selecione"
            error={errors.banco?.message}
            {...register("banco", { required: "Banco é obrigatório" })}
          />
          <Select
            label="Tipo de conta"
            options={TIPO_CONTA_OPTIONS}
            placeholder="Selecione"
            {...register("banco_tipo_conta")}
          />
          <Input
            label="Agência"
            placeholder="0000"
            inputMode="numeric"
            {...register("banco_agencia")}
          />
          <Input
            label="Conta"
            placeholder="00000-0"
            {...register("banco_conta")}
          />
        </div>
      </div>
    </div>
  );
}
