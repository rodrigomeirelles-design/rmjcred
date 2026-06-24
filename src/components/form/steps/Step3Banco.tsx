"use client";

import { UseFormReturn } from "react-hook-form";
import { PropostaFormData } from "@/types";
import Input from "@/components/ui/Input";
import { Landmark } from "lucide-react";

interface Step3Props {
  form: UseFormReturn<PropostaFormData>;
}

export default function Step3Banco({ form }: Step3Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="card-base space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Landmark className="w-5 h-5 text-[var(--color-brand-primary)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Conta para Liberação do Crédito</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Conta bancária da empresa onde o recurso será creditado após aprovação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Banco"
            required
            error={errors.banco_nome?.message}
            placeholder="Nome do banco"
            {...register("banco_nome", { required: "Nome do banco é obrigatório" })}
          />
        </div>

        <Input
          label="Código do Banco"
          required
          hint="Código de compensação de 3 dígitos (001 = Banco do Brasil, 033 = Santander, 341 = Itaú)"
          placeholder="000"
          maxLength={3}
          error={errors.banco_numero?.message}
          {...register("banco_numero", {
            required: "Código é obrigatório",
            pattern: { value: /^\d{1,3}$/, message: "Somente números (até 3 dígitos)" },
          })}
        />

        <Input
          label="Agência"
          required
          placeholder="0000"
          error={errors.banco_agencia?.message}
          {...register("banco_agencia", { required: "Agência é obrigatória" })}
        />

        <Input
          label="Conta"
          required
          placeholder="00000-0"
          error={errors.banco_conta?.message}
          {...register("banco_conta", { required: "Conta é obrigatória" })}
        />

        <Input
          label="Dígito"
          required
          maxLength={2}
          placeholder="0"
          error={errors.banco_digito?.message}
          {...register("banco_digito", { required: "Dígito é obrigatório" })}
        />
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
        <p className="text-sm font-medium text-amber-800 mb-1">Atenção</p>
        <p className="text-xs text-amber-700">
          A conta informada deve estar em nome da empresa (CNPJ) e ser uma conta corrente ativa.
          Certifique-se de que os dados bancários estão corretos — erros podem atrasar a liberação do crédito.
        </p>
      </div>
    </div>
  );
}
