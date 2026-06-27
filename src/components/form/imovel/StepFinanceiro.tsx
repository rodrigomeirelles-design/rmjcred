"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import {
  PropostaImovelFormData,
  FONTE_RENDA_OPTIONS,
  BANCO_IMOVEL_OPTIONS,
  SEXO_OPTIONS,
} from "@/types/imovel";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskCPF, maskPhone, maskMoney, parseMoney } from "@/lib/utils";

interface StepFinanceiroProps {
  form: UseFormReturn<PropostaImovelFormData>;
}

export default function StepFinanceiro({ form }: StepFinanceiroProps) {
  const { register, control, watch, formState: { errors } } = form;
  const temSP = watch("temSegundoProponente");

  return (
    <div className="space-y-6">
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Renda e Profissão
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Fonte de Renda"
            required
            options={FONTE_RENDA_OPTIONS}
            placeholder="Selecione"
            error={errors.fonteRenda?.message}
            {...register("fonteRenda", { required: "Fonte de renda é obrigatória" })}
          />
          <Controller
            name="rendaMensal"
            control={control}
            rules={{ required: "Renda mensal é obrigatória", min: { value: 1, message: "Informe a renda" } }}
            render={({ field }) => (
              <Input
                label="Renda Mensal Bruta"
                required
                inputMode="numeric"
                placeholder="R$ 0,00"
                error={errors.rendaMensal?.message}
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <div className="sm:col-span-2">
            <Input
              label="Profissão"
              placeholder="Ex: Engenheiro, Professora..."
              {...register("profissao")}
            />
          </div>
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Dados Bancários
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Banco de Preferência"
            required
            options={BANCO_IMOVEL_OPTIONS}
            placeholder="Selecione"
            error={errors.banco?.message}
            {...register("banco", { required: "Banco é obrigatório" })}
          />
          <Input
            label="Agência"
            placeholder="0000"
            inputMode="numeric"
            {...register("agencia")}
          />
          <Input
            label="Conta Corrente"
            placeholder="00000-0"
            {...register("conta")}
          />
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1 pb-3 border-b border-[var(--color-border)]">
          Segundo Proponente
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Cônjuge, sócio ou familiar que comporá renda ou será co-titular do financiamento.
        </p>

        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            className="w-4 h-4 accent-[#ee661b]"
            {...register("temSegundoProponente")}
          />
          <span className="text-sm font-medium text-[var(--color-text)]">
            Incluir segundo proponente
          </span>
        </label>

        {temSP && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Nome Completo"
                  placeholder="Nome do segundo proponente"
                  {...register("sp_nome")}
                />
              </div>
              <Input
                label="CPF"
                inputMode="numeric"
                placeholder="000.000.000-00"
                {...register("sp_cpf", {
                  onChange: (e) => { e.target.value = maskCPF(e.target.value); },
                })}
              />
              <Input
                label="Celular"
                inputMode="tel"
                placeholder="(00) 00000-0000"
                {...register("sp_celular", {
                  onChange: (e) => { e.target.value = maskPhone(e.target.value); },
                })}
              />
              <Input
                label="E-mail"
                type="email"
                {...register("sp_email")}
              />
              <Input
                label="Data de Nascimento"
                type="date"
                {...register("sp_nascimento")}
              />
              <Select
                label="Sexo"
                options={SEXO_OPTIONS}
                placeholder="Selecione"
                {...register("sp_sexo")}
              />
              <Input
                label="RG / CNH"
                {...register("sp_rgCnh")}
              />
              <Input
                label="Órgão Emissor"
                placeholder="SSP/MG"
                {...register("sp_orgaoEmissor")}
              />
              <Input
                label="Nome da Mãe"
                {...register("sp_nomeMae")}
              />
              <Input
                label="Nome do Pai"
                placeholder="Opcional"
                {...register("sp_nomePai")}
              />
              <Select
                label="Fonte de Renda"
                options={FONTE_RENDA_OPTIONS}
                placeholder="Selecione"
                {...register("sp_fonteRenda")}
              />
              <Controller
                name="sp_rendaMensal"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Renda Mensal Bruta"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                    onChange={(e) => field.onChange(parseMoney(e.target.value))}
                  />
                )}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Profissão"
                  {...register("sp_profissao")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
