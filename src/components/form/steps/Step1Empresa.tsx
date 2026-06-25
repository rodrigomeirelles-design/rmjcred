"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { PropostaFormData, UF_LIST } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskCNPJ, maskCPF, maskPhone, maskCEP, maskMoney, parseMoney, buscarCEP } from "@/lib/utils";

interface Step1Props {
  form: UseFormReturn<PropostaFormData>;
}

const UF_OPTIONS = UF_LIST.map((uf) => ({ value: uf, label: uf }));

const REGIME_TRIBUTARIO_OPTIONS = [
  { value: "Simples Nacional", label: "Simples Nacional" },
  { value: "Lucro Presumido", label: "Lucro Presumido" },
  { value: "Lucro Real", label: "Lucro Real" },
  { value: "MEI", label: "MEI" },
];

const IMOVEL_TIPO_OPTIONS = [
  { value: "IPTU", label: "IPTU" },
  { value: "Matrícula", label: "Matrícula" },
  { value: "Imposto de Renda", label: "Imposto de Renda" },
  { value: "Não possui", label: "Não possui" },
];

export default function Step1Empresa({ form }: Step1Props) {
  const { register, control, watch, setValue, formState: { errors } } = form;
  const temImovel = watch("emp_imovel");
  const imovelTipo = watch("emp_imovel_tipo");

  async function handleCEPBlur(value: string) {
    const result = await buscarCEP(value);
    if (result) {
      if (!form.getValues("emp_logradouro")) setValue("emp_logradouro", result.logradouro);
      if (!form.getValues("emp_bairro")) setValue("emp_bairro", result.bairro);
      if (!form.getValues("emp_cidade")) setValue("emp_cidade", result.cidade);
      if (!form.getValues("emp_uf")) setValue("emp_uf", result.uf);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Identificação da Empresa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Razão Social"
              required
              error={errors.emp_razao?.message}
              {...register("emp_razao", { required: "Razão Social é obrigatória" })}
            />
          </div>
          <Input
            label="Nome Fantasia"
            error={errors.emp_fantasia?.message}
            {...register("emp_fantasia")}
          />
          <Controller
            name="emp_cnpj"
            control={control}
            rules={{
              required: "CNPJ é obrigatório",
              validate: (v) => {
                const { validarCNPJ } = require("@/lib/utils");
                return validarCNPJ(v) || "CNPJ inválido";
              },
            }}
            render={({ field }) => (
              <Input
                label="CNPJ"
                required
                placeholder="00.000.000/0000-00"
                error={errors.emp_cnpj?.message}
                value={field.value || ""}
                onChange={(e) => field.onChange(maskCNPJ(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
          <Input
            label="Nº de Funcionários"
            type="number"
            min={1}
            required
            error={errors.emp_funcionarios?.message}
            {...register("emp_funcionarios", {
              required: "Obrigatório",
              min: { value: 1, message: "Mínimo 1 funcionário" },
              valueAsNumber: true,
            })}
          />
          <div className="sm:col-span-2">
            <Controller
              name="emp_regime_tributario"
              control={control}
              rules={{ required: "Regime tributário é obrigatório" }}
              render={({ field }) => (
                <Select
                  label="Regime Tributário"
                  required
                  placeholder="Selecione o regime tributário"
                  options={REGIME_TRIBUTARIO_OPTIONS}
                  error={errors.emp_regime_tributario?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Representante Legal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Nome do Representante Legal"
              required
              error={errors.emp_repr_nome?.message}
              {...register("emp_repr_nome", { required: "Obrigatório" })}
            />
          </div>
          <Controller
            name="emp_repr_cpf"
            control={control}
            rules={{
              required: "CPF é obrigatório",
              validate: (v) => {
                const { validarCPF } = require("@/lib/utils");
                return validarCPF(v) || "CPF inválido";
              },
            }}
            render={({ field }) => (
              <Input
                label="CPF do Representante"
                required
                placeholder="000.000.000-00"
                error={errors.emp_repr_cpf?.message}
                value={field.value || ""}
                onChange={(e) => field.onChange(maskCPF(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
          <Input
            label="E-mail"
            type="email"
            required
            error={errors.emp_email?.message}
            {...register("emp_email", {
              required: "E-mail é obrigatório",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
            })}
          />
          <Controller
            name="emp_telefone"
            control={control}
            rules={{
              required: "Telefone é obrigatório",
              validate: (v) => v.replace(/\D/g, "").length >= 10 || "Número incompleto",
            }}
            render={({ field }) => (
              <Input
                label="Telefone / WhatsApp"
                required
                placeholder="(11) 90000-0000"
                error={errors.emp_telefone?.message}
                value={field.value || ""}
                onChange={(e) => field.onChange(maskPhone(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Endereço da Empresa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Controller
            name="emp_cep"
            control={control}
            rules={{ required: "CEP é obrigatório", validate: (v) => v.replace(/\D/g, "").length === 8 || "CEP inválido" }}
            render={({ field }) => (
              <Input
                label="CEP"
                required
                placeholder="00000-000"
                error={errors.emp_cep?.message}
                value={field.value || ""}
                onChange={(e) => field.onChange(maskCEP(e.target.value))}
                onBlur={(e) => { field.onBlur(); handleCEPBlur(e.target.value); }}
              />
            )}
          />
          <div className="sm:col-span-2">
            <Input
              label="Logradouro"
              required
              error={errors.emp_logradouro?.message}
              {...register("emp_logradouro", { required: "Obrigatório" })}
            />
          </div>
          <Input
            label="Número"
            required
            error={errors.emp_numero?.message}
            {...register("emp_numero", { required: "Obrigatório" })}
          />
          <Input
            label="Complemento"
            error={errors.emp_complemento?.message}
            {...register("emp_complemento")}
          />
          <Input
            label="Bairro"
            required
            error={errors.emp_bairro?.message}
            {...register("emp_bairro", { required: "Obrigatório" })}
          />
          <div className="sm:col-span-2">
            <Input
              label="Cidade"
              required
              error={errors.emp_cidade?.message}
              {...register("emp_cidade", { required: "Obrigatório" })}
            />
          </div>
          <Controller
            name="emp_uf"
            control={control}
            rules={{ required: "UF é obrigatória" }}
            render={({ field }) => (
              <Select
                label="UF"
                required
                placeholder="Selecione"
                options={UF_OPTIONS}
                error={errors.emp_uf?.message}
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Patrimônio da Empresa
        </h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700">
            <strong>Dica:</strong> Declarar bens favorece a análise de crédito. Os bens informados <strong>não entram como garantia</strong> da operação.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="label-base mb-2">
              Possui imóvel no CNPJ? <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-4">
              {(["sim", "nao"] as const).map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={val}
                    className="accent-[var(--color-brand-primary)] w-4 h-4"
                    {...register("emp_imovel", { required: "Selecione uma opção" })}
                  />
                  <span className="text-sm">{val === "sim" ? "Sim" : "Não"}</span>
                </label>
              ))}
            </div>
            {errors.emp_imovel && (
              <p className="text-xs text-red-500 mt-1">{errors.emp_imovel.message}</p>
            )}
          </div>

          {temImovel === "sim" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
              <Controller
                name="emp_imovel_tipo"
                control={control}
                rules={{ required: temImovel === "sim" ? "Selecione o tipo de comprovação" : false }}
                render={({ field }) => (
                  <Select
                    label="Comprovação do Imóvel"
                    required
                    placeholder="Selecione"
                    options={IMOVEL_TIPO_OPTIONS}
                    error={errors.emp_imovel_tipo?.message}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {imovelTipo && imovelTipo !== "Não possui" && (
                <Controller
                  name="emp_imovel_valor"
                  control={control}
                  rules={{ required: "Informe o valor estimado", validate: (v) => Number(v) > 0 || "Valor deve ser maior que zero" }}
                  render={({ field }) => (
                    <Input
                      label="Valor Estimado do Imóvel (R$)"
                      required
                      placeholder="R$ 0,00"
                      error={errors.emp_imovel_valor?.message}
                      value={field.value ? maskMoney(String(Math.round(Number(field.value) * 100))) : ""}
                      onChange={(e) => field.onChange(parseMoney(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
