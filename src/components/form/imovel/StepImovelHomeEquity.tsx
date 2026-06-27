"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import {
  PropostaImovelFormData,
  TIPO_IMOVEL_OPTIONS,
  ESTADO_CONSERVACAO_OPTIONS,
  PRAZO_IMOVEL_OPTIONS,
  SITUACAO_IMOVEL_OPTIONS,
} from "@/types/imovel";
import { UF_LIST } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskMoney, parseMoney, maskCEP, buscarCEP } from "@/lib/utils";

interface StepImovelHomeEquityProps {
  form: UseFormReturn<PropostaImovelFormData>;
}

const UF_OPTIONS = UF_LIST.map((uf) => ({ value: uf, label: uf }));

export default function StepImovelHomeEquity({ form }: StepImovelHomeEquityProps) {
  const { register, control, setValue, getValues, formState: { errors } } = form;

  async function handleImovelCEPBlur(value: string) {
    const result = await buscarCEP(value);
    if (result) {
      if (!getValues("imovel_logradouro")) setValue("imovel_logradouro", result.logradouro);
      if (!getValues("imovel_bairro"))     setValue("imovel_bairro",     result.bairro);
      if (!getValues("imovel_cidade"))     setValue("imovel_cidade",     result.cidade);
      if (!getValues("imovel_uf"))         setValue("imovel_uf",         result.uf);
    }
  }

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
            label="Situação do Imóvel"
            required
            options={SITUACAO_IMOVEL_OPTIONS}
            placeholder="Selecione"
            error={errors.situacaoImovel?.message}
            {...register("situacaoImovel", { required: "Situação do imóvel é obrigatória" })}
          />
          <Input
            label="Matrícula / IPTU"
            placeholder="Número da matrícula ou IPTU"
            {...register("matriculaIptu")}
          />
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Endereço do Imóvel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="CEP do Imóvel"
            required
            inputMode="numeric"
            placeholder="00000-000"
            error={errors.imovel_cep?.message}
            {...register("imovel_cep", {
              required: "CEP do imóvel é obrigatório",
              onChange: (e) => { e.target.value = maskCEP(e.target.value); },
              onBlur: (e) => handleImovelCEPBlur(e.target.value),
            })}
          />
          <div className="sm:col-span-2">
            <Input
              label="Logradouro"
              required
              placeholder="Rua, Avenida, etc."
              error={errors.imovel_logradouro?.message}
              {...register("imovel_logradouro", { required: "Logradouro é obrigatório" })}
            />
          </div>
          <Input
            label="Número"
            required
            error={errors.imovel_numero?.message}
            {...register("imovel_numero", { required: "Número é obrigatório" })}
          />
          <Input
            label="Complemento"
            placeholder="Apto, Bloco, etc."
            {...register("imovel_complemento")}
          />
          <Input
            label="Bairro"
            required
            error={errors.imovel_bairro?.message}
            {...register("imovel_bairro", { required: "Bairro é obrigatório" })}
          />
          <Input
            label="Cidade"
            required
            error={errors.imovel_cidade?.message}
            {...register("imovel_cidade", { required: "Cidade é obrigatória" })}
          />
          <Select
            label="UF do Imóvel"
            required
            options={UF_OPTIONS}
            placeholder="UF"
            error={errors.imovel_uf?.message}
            {...register("imovel_uf", { required: "UF é obrigatória" })}
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
            rules={{ required: "Valor do crédito é obrigatório", min: { value: 1, message: "Informe o valor" } }}
            render={({ field }) => (
              <Input
                label="Valor do Crédito Desejado"
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
    </div>
  );
}
