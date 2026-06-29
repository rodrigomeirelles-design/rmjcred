"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { PropostaVeiculoFormData, TEMPO_RESIDENCIA_OPTIONS } from "@/types/veiculo";
import { ESTADO_CIVIL_OPTIONS } from "@/types/imovel";
import { UF_LIST } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskCPF, maskPhone, maskCEP, buscarCEP } from "@/lib/utils";
import { Heart } from "lucide-react";

interface Props {
  form: UseFormReturn<PropostaVeiculoFormData>;
}

const UF_OPTIONS = UF_LIST.map((uf) => ({ value: uf, label: uf }));

// CPF validation — Módulo 11
function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10 || check === 11) check = 0;
  if (check !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10 || check === 11) check = 0;
  return check === parseInt(digits[10]);
}

export default function StepPessoalVeiculo({ form }: Props) {
  const { register, setValue, getValues, control, formState: { errors } } = form;

  const estadoCivil = useWatch({ control, name: "estado_civil" });
  const isCasado = estadoCivil === "casado";

  async function handleCEPBlur(value: string) {
    const result = await buscarCEP(value);
    if (result) {
      if (!getValues("logradouro")) setValue("logradouro", result.logradouro);
      if (!getValues("bairro"))     setValue("bairro",     result.bairro);
      if (!getValues("cidade"))     setValue("cidade",     result.cidade);
      if (!getValues("uf"))         setValue("uf",         result.uf as any);
    }
  }

  return (
    <div className="space-y-6">
      {/* Identificação */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Identificação
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
              validate: (v) => validarCPF(v) || "CPF inválido",
              onChange: (e) => { e.target.value = maskCPF(e.target.value); },
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
            label="Estado Civil"
            required
            options={ESTADO_CIVIL_OPTIONS}
            placeholder="Selecione"
            error={errors.estado_civil?.message}
            {...register("estado_civil", { required: "Estado civil é obrigatório" })}
          />
          <Input
            label="Nacionalidade"
            placeholder="Ex: Brasileira"
            {...register("nacionalidade")}
          />
        </div>
      </div>

      {/* Dados do Cônjuge — aparece apenas quando Casado */}
      {isCasado && (
        <div
          className="card-form"
          style={{ borderColor: "rgb(35 68 105 / 0.25)", background: "rgb(35 68 105 / 0.03)" }}
        >
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--color-border)]">
            <Heart className="w-4 h-4" style={{ color: "#234469" }} />
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Dados do Cônjuge</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome Completo do Cônjuge"
                required
                error={errors.conjugeNome?.message}
                {...register("conjugeNome", { required: isCasado ? "Nome do cônjuge é obrigatório" : false })}
              />
            </div>
            <Input
              label="CPF do Cônjuge"
              required
              inputMode="numeric"
              placeholder="000.000.000-00"
              error={errors.conjugeCpf?.message}
              {...register("conjugeCpf", {
                required: isCasado ? "CPF do cônjuge é obrigatório" : false,
                validate: (v) => !v || validarCPF(v) || "CPF inválido",
                onChange: (e) => { e.target.value = maskCPF(e.target.value); },
              })}
            />
            <Input
              label="Data de Nascimento do Cônjuge"
              type="date"
              required
              error={errors.conjugeNascimento?.message}
              {...register("conjugeNascimento", { required: isCasado ? "Data de nascimento é obrigatória" : false })}
            />
            <Input
              label="Celular do Cônjuge"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              error={errors.conjugeCelular?.message}
              {...register("conjugeCelular", {
                onChange: (e) => { e.target.value = maskPhone(e.target.value); },
              })}
            />
            <Input
              label="E-mail do Cônjuge"
              type="email"
              error={errors.conjugeEmail?.message}
              {...register("conjugeEmail", {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
              })}
            />
          </div>
        </div>
      )}

      {/* Documentos */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Documentos e Filiação
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="RG"
            required
            placeholder="Número do RG"
            error={errors.rg?.message}
            {...register("rg", { required: "RG é obrigatório" })}
          />
          <Input
            label="Órgão Emissor"
            placeholder="Ex: SSP/MG"
            {...register("rg_orgao_emissor")}
          />
          <Input
            label="Nome da Mãe"
            required
            error={errors.nome_mae?.message}
            {...register("nome_mae", { required: "Nome da mãe é obrigatório" })}
          />
        </div>
      </div>

      {/* Contato */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Contato
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Telefone fixo"
            inputMode="tel"
            placeholder="(00) 0000-0000"
            {...register("telefone", {
              onChange: (e) => { e.target.value = maskPhone(e.target.value); },
            })}
          />
          <div className="sm:col-span-2">
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
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Endereço Residencial
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
              onBlur:   (e) => handleCEPBlur(e.target.value),
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
          <Select
            label="Tempo de residência"
            options={TEMPO_RESIDENCIA_OPTIONS}
            placeholder="Selecione"
            {...register("tempo_residencia")}
          />
        </div>
      </div>
    </div>
  );
}
