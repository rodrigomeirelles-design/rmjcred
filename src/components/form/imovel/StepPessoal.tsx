"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import {
  PropostaImovelFormData,
  ESTADO_CIVIL_OPTIONS,
  SEXO_OPTIONS,
  REGIME_UNIAO_OPTIONS,
  FONTE_RENDA_OPTIONS,
} from "@/types/imovel";
import { UF_LIST } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskCPF, maskPhone, maskCEP, maskMoney, parseMoney, buscarCEP } from "@/lib/utils";

interface StepPessoalProps {
  form: UseFormReturn<PropostaImovelFormData>;
}

const UF_OPTIONS = UF_LIST.map((uf) => ({ value: uf, label: uf }));
const EXIGE_CONJUGE = ["Casado(a)", "União Estável"];

export default function StepPessoal({ form }: StepPessoalProps) {
  const { register, control, setValue, getValues, watch, formState: { errors } } = form;
  const estadoCivil = watch("estadoCivil");
  const exigeConjuge = EXIGE_CONJUGE.includes(estadoCivil);
  const isCasado = estadoCivil === "Casado(a)";

  async function handleCEPBlur(value: string) {
    const result = await buscarCEP(value);
    if (result) {
      if (!getValues("logradouro")) setValue("logradouro", result.logradouro);
      if (!getValues("bairro"))     setValue("bairro",     result.bairro);
      if (!getValues("cidade"))     setValue("cidade",     result.cidade);
      if (!getValues("uf"))         setValue("uf",         result.uf as PropostaImovelFormData["uf"]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Identificação */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Identificação do Proponente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Nome Completo"
              required
              error={errors.nome?.message}
              {...register("nome", { required: "Nome é obrigatório" })}
            />
          </div>
          <Input
            label="CPF"
            required
            inputMode="numeric"
            placeholder="000.000.000-00"
            error={errors.cpf?.message}
            {...register("cpf", {
              required: "CPF é obrigatório",
              onChange: (e) => { e.target.value = maskCPF(e.target.value); },
            })}
          />
          <Input
            label="Celular / WhatsApp"
            required
            inputMode="tel"
            placeholder="(00) 00000-0000"
            error={errors.celular?.message}
            {...register("celular", {
              required: "Celular é obrigatório",
              onChange: (e) => { e.target.value = maskPhone(e.target.value); },
            })}
          />
          <Input
            label="E-mail"
            type="email"
            required
            error={errors.email?.message}
            {...register("email", {
              required: "E-mail é obrigatório",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
            })}
          />
          <Input
            label="Data de Nascimento"
            type="date"
            required
            error={errors.nascimento?.message}
            {...register("nascimento", { required: "Data de nascimento é obrigatória" })}
          />
          <Select
            label="Sexo"
            options={SEXO_OPTIONS}
            placeholder="Selecione"
            {...register("sexo")}
          />
          <Select
            label="Estado Civil"
            required
            options={ESTADO_CIVIL_OPTIONS}
            placeholder="Selecione"
            error={errors.estadoCivil?.message}
            {...register("estadoCivil", { required: "Estado civil é obrigatório" })}
          />
        </div>
      </div>

      {/* Documentos */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Documentos e Filiação
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="RG / CNH"
            required
            placeholder="Número do documento"
            error={errors.rgCnh?.message}
            {...register("rgCnh", { required: "RG ou CNH é obrigatório" })}
          />
          <Input
            label="Órgão Emissor"
            placeholder="Ex: SSP/MG"
            {...register("orgaoEmissor")}
          />
          <Input
            label="Nome da Mãe"
            required
            error={errors.nomeMae?.message}
            {...register("nomeMae", { required: "Nome da mãe é obrigatório" })}
          />
          <Input
            label="Nome do Pai"
            placeholder="Opcional"
            {...register("nomePai")}
          />
          <Input
            label="Naturalidade"
            placeholder="Ex: Belo Horizonte/MG"
            {...register("naturalidade")}
          />
          <Input
            label="Nacionalidade"
            placeholder="Ex: Brasileira"
            {...register("nacionalidade")}
          />
        </div>
      </div>

      {/* Cônjuge — aparece automaticamente quando casado ou união estável */}
      {exigeConjuge && (
        <div className="card-form border-[#234469]/20" style={{ background: "rgb(35 68 105 / 0.03)" }}>
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Dados do Cônjuge
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {isCasado ? "Casado(a)" : "União Estável"}
            </span>
          </div>

          {isCasado && (
            <div className="mb-4">
              <Select
                label="Regime de Comunhão"
                required
                options={REGIME_UNIAO_OPTIONS}
                placeholder="Selecione o regime"
                error={errors.regimeUniao?.message}
                {...register("regimeUniao", { required: "Regime de comunhão é obrigatório para casados" })}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome Completo do Cônjuge"
                required
                error={errors.conjuge_nome?.message}
                {...register("conjuge_nome", { required: "Nome do cônjuge é obrigatório" })}
              />
            </div>
            <Input
              label="CPF do Cônjuge"
              required
              inputMode="numeric"
              placeholder="000.000.000-00"
              error={errors.conjuge_cpf?.message}
              {...register("conjuge_cpf", {
                required: "CPF do cônjuge é obrigatório",
                onChange: (e) => { e.target.value = maskCPF(e.target.value); },
              })}
            />
            <Input
              label="Celular do Cônjuge"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              {...register("conjuge_celular", {
                onChange: (e) => { e.target.value = maskPhone(e.target.value); },
              })}
            />
            <Input
              label="E-mail do Cônjuge"
              type="email"
              {...register("conjuge_email")}
            />
            <Input
              label="Data de Nascimento"
              type="date"
              {...register("conjuge_nascimento")}
            />
            <Select
              label="Sexo"
              options={SEXO_OPTIONS}
              placeholder="Selecione"
              {...register("conjuge_sexo")}
            />
            <Input
              label="Profissão"
              {...register("conjuge_profissao")}
            />
            <Select
              label="Fonte de Renda"
              options={FONTE_RENDA_OPTIONS}
              placeholder="Selecione"
              {...register("conjuge_fonteRenda")}
            />
            <Controller
              name="conjuge_rendaMensal"
              control={control}
              render={({ field }) => (
                <Input
                  label="Renda Mensal do Cônjuge"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                  onChange={(e) => field.onChange(parseMoney(e.target.value))}
                />
              )}
            />
          </div>
        </div>
      )}

      {/* Endereço */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Endereço do Proponente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="CEP"
            required
            inputMode="numeric"
            placeholder="00000-000"
            error={errors.cep?.message}
            {...register("cep", {
              required: "CEP é obrigatório",
              onChange: (e) => { e.target.value = maskCEP(e.target.value); },
              onBlur: (e) => handleCEPBlur(e.target.value),
            })}
          />
          <div className="sm:col-span-2">
            <Input
              label="Logradouro"
              required
              placeholder="Rua, Avenida, etc."
              error={errors.logradouro?.message}
              {...register("logradouro", { required: "Logradouro é obrigatório" })}
            />
          </div>
          <Input
            label="Número"
            required
            error={errors.numero?.message}
            {...register("numero", { required: "Número é obrigatório" })}
          />
          <Input
            label="Complemento"
            placeholder="Apto, Bloco, etc."
            {...register("complemento")}
          />
          <Input
            label="Bairro"
            required
            error={errors.bairro?.message}
            {...register("bairro", { required: "Bairro é obrigatório" })}
          />
          <Input
            label="Cidade"
            required
            error={errors.cidade?.message}
            {...register("cidade", { required: "Cidade é obrigatória" })}
          />
          <Select
            label="UF"
            required
            options={UF_OPTIONS}
            placeholder="UF"
            error={errors.uf?.message}
            {...register("uf", { required: "UF é obrigatória" })}
          />
        </div>
      </div>
    </div>
  );
}
