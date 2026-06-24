"use client";

import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { PropostaFormData, UF_LIST } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { maskCPF, maskPhone, maskCEP, validarCPF, buscarCEP } from "@/lib/utils";
import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const UF_OPTIONS = UF_LIST.map((u) => ({ value: u, label: u }));
const ESTADO_CIVIL_OPTIONS = [
  { value: "Solteiro(a)", label: "Solteiro(a)" },
  { value: "Casado(a)", label: "Casado(a)" },
  { value: "União estável", label: "União estável" },
  { value: "Divorciado(a)", label: "Divorciado(a)" },
  { value: "Viúvo(a)", label: "Viúvo(a)" },
  { value: "Separado(a)", label: "Separado(a)" },
];
const REGIME_OPTIONS = [
  { value: "Comunhão Parcial", label: "Comunhão Parcial" },
  { value: "Comunhão Universal", label: "Comunhão Universal" },
  { value: "Separação Total", label: "Separação Total" },
  { value: "Participação Final nos Aquestos", label: "Participação Final nos Aquestos" },
];
const IMOVEL_TIPO_OPTIONS = [
  { value: "IPTU", label: "IPTU" },
  { value: "Matrícula", label: "Matrícula" },
  { value: "Imposto de Renda", label: "Imposto de Renda" },
  { value: "Não possui", label: "Não possui" },
];

const EXIGE_CONJUGE = ["Casado(a)", "União estável"];

interface Step2Props {
  form: UseFormReturn<PropostaFormData>;
}

function PlacasInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((placa, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="input-base uppercase flex-1"
            value={placa}
            placeholder="AAA-1234 ou AAA1A23"
            onChange={(e) => {
              const arr = [...value];
              arr[i] = e.target.value.toUpperCase();
              onChange(arr);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="flex items-center gap-1 text-xs text-[var(--color-brand-primary)] hover:underline"
      >
        <Plus className="w-3 h-3" /> Adicionar placa
      </button>
    </div>
  );
}

function SocioCard({ form, index, onRemove, canRemove }: {
  form: UseFormReturn<PropostaFormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { register, control, watch, setValue, formState: { errors } } = form;
  const prefix = `socios.${index}` as const;
  const estadoCivil = watch(`socios.${index}.estado_civil`);
  const exigeConjuge = EXIGE_CONJUGE.includes(estadoCivil);
  const imovelTipo = watch(`socios.${index}.imovel_tipo`);
  const conjugeImovelTipo = watch(`socios.${index}.conjuge.imovel_tipo`);
  const socioErrors = errors.socios?.[index];

  async function handleCEP(cep: string) {
    const r = await buscarCEP(cep);
    if (r) {
      if (!form.getValues(`socios.${index}.logradouro`)) setValue(`socios.${index}.logradouro`, r.logradouro);
      if (!form.getValues(`socios.${index}.bairro`)) setValue(`socios.${index}.bairro`, r.bairro);
      if (!form.getValues(`socios.${index}.cidade`)) setValue(`socios.${index}.cidade`, r.cidade);
      if (!form.getValues(`socios.${index}.uf`)) setValue(`socios.${index}.uf`, r.uf);
    }
  }

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface-subtle)] cursor-pointer"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          <span className="font-medium text-sm">
            {watch(`socios.${index}.nome`) || `Sócio ${index + 1}`}
          </span>
          {watch(`socios.${index}.participacao`) > 0 && (
            <span className="text-xs text-[var(--color-text-muted)]">
              — {watch(`socios.${index}.participacao`)}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {collapsed ? <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" /> : <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />}
        </div>
      </div>

      {!collapsed && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome completo"
                required
                error={socioErrors?.nome?.message}
                {...register(`${prefix}.nome`, { required: "Obrigatório" })}
              />
            </div>
            <Controller
              name={`${prefix}.cpf`}
              control={control}
              rules={{
                required: "CPF é obrigatório",
                validate: (v) => validarCPF(v) || "CPF inválido",
              }}
              render={({ field }) => (
                <Input
                  label="CPF"
                  required
                  placeholder="000.000.000-00"
                  error={socioErrors?.cpf?.message}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(maskCPF(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Input
              label="RG"
              required
              error={socioErrors?.rg?.message}
              {...register(`${prefix}.rg`, { required: "Obrigatório" })}
            />
            <Input
              label="% Participação"
              type="number"
              min={0}
              max={100}
              required
              error={socioErrors?.participacao?.message}
              {...register(`${prefix}.participacao`, {
                required: "Obrigatório",
                min: { value: 0.01, message: "Mínimo 0,01%" },
                max: { value: 100, message: "Máximo 100%" },
                valueAsNumber: true,
              })}
            />
            <Input
              label="Data de Nascimento"
              type="date"
              required
              error={socioErrors?.nascimento?.message}
              {...register(`${prefix}.nascimento`, { required: "Obrigatório" })}
            />
            <Controller
              name={`${prefix}.estado_civil`}
              control={control}
              rules={{ required: "Obrigatório" }}
              render={({ field }) => (
                <Select
                  label="Estado Civil"
                  required
                  placeholder="Selecione"
                  options={ESTADO_CIVIL_OPTIONS}
                  error={socioErrors?.estado_civil?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {exigeConjuge && (
              <Controller
                name={`${prefix}.regime`}
                control={control}
                rules={{ required: exigeConjuge ? "Obrigatório" : false }}
                render={({ field }) => (
                  <Select
                    label="Regime de Casamento"
                    required
                    placeholder="Selecione"
                    options={REGIME_OPTIONS}
                    error={socioErrors?.regime?.message}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            )}
            <Input
              label="Profissão"
              required
              error={socioErrors?.profissao?.message}
              {...register(`${prefix}.profissao`, { required: "Obrigatório" })}
            />
            <Input
              label="Nacionalidade"
              required
              error={socioErrors?.nacionalidade?.message}
              {...register(`${prefix}.nacionalidade`, { required: "Obrigatório" })}
              defaultValue="Brasileira"
            />
            <Input
              label="E-mail"
              type="email"
              required
              error={socioErrors?.email?.message}
              {...register(`${prefix}.email`, {
                required: "Obrigatório",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
              })}
            />
            <Controller
              name={`${prefix}.telefone`}
              control={control}
              rules={{
                required: "Obrigatório",
                validate: (v) => v.replace(/\D/g, "").length >= 10 || "Número incompleto",
              }}
              render={({ field }) => (
                <Input
                  label="Telefone / Celular"
                  required
                  placeholder="(11) 90000-0000"
                  error={socioErrors?.telefone?.message}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Input
              label="Renda Mensal (conforme IR) R$"
              type="number"
              min={0}
              required
              error={socioErrors?.renda?.message}
              {...register(`${prefix}.renda`, { required: "Obrigatório", valueAsNumber: true })}
            />
          </div>

          <div>
            <p className="label-base mb-3 border-t border-[var(--color-border)] pt-4">Endereço Residencial</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Controller
                name={`${prefix}.cep`}
                control={control}
                rules={{ required: "Obrigatório", validate: (v) => v.replace(/\D/g, "").length === 8 || "CEP inválido" }}
                render={({ field }) => (
                  <Input
                    label="CEP"
                    required
                    placeholder="00000-000"
                    error={socioErrors?.cep?.message}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(maskCEP(e.target.value))}
                    onBlur={(e) => { field.onBlur(); handleCEP(e.target.value); }}
                  />
                )}
              />
              <div className="sm:col-span-2">
                <Input label="Logradouro" required error={socioErrors?.logradouro?.message} {...register(`${prefix}.logradouro`, { required: "Obrigatório" })} />
              </div>
              <Input label="Número" required error={socioErrors?.numero?.message} {...register(`${prefix}.numero`, { required: "Obrigatório" })} />
              <Input label="Complemento" {...register(`${prefix}.complemento`)} />
              <Input label="Bairro" required error={socioErrors?.bairro?.message} {...register(`${prefix}.bairro`, { required: "Obrigatório" })} />
              <div className="sm:col-span-2">
                <Input label="Cidade" required error={socioErrors?.cidade?.message} {...register(`${prefix}.cidade`, { required: "Obrigatório" })} />
              </div>
              <Controller
                name={`${prefix}.uf`}
                control={control}
                rules={{ required: "Obrigatório" }}
                render={({ field }) => (
                  <Select label="UF" required placeholder="UF" options={UF_OPTIONS} error={socioErrors?.uf?.message} value={field.value || ""} onChange={field.onChange} onBlur={field.onBlur} />
                )}
              />
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
            <p className="label-base">Patrimônio</p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-blue-700">Declarar bens favorece a análise. Eles <strong>não entram como garantia</strong>.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name={`${prefix}.imovel_tipo`}
                control={control}
                rules={{ required: "Selecione uma opção" }}
                render={({ field }) => (
                  <Select label="Imóvel em nome" required placeholder="Selecione" options={IMOVEL_TIPO_OPTIONS} error={socioErrors?.imovel_tipo?.message} value={field.value || ""} onChange={field.onChange} onBlur={field.onBlur} />
                )}
              />
              {imovelTipo && imovelTipo !== "Não possui" && (
                <Input
                  label="Valor estimado (R$)"
                  type="number"
                  min={0}
                  error={socioErrors?.imovel_valor?.message}
                  {...register(`${prefix}.imovel_valor`, { valueAsNumber: true })}
                />
              )}
            </div>
            <div>
              <p className="label-base mb-2">Veículo(s) — Placa(s)</p>
              <Controller
                name={`${prefix}.veiculo_placas`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <PlacasInput value={field.value || []} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          {exigeConjuge && (
            <div className="border-t-2 border-[var(--color-brand-primary)]/20 pt-5 bg-blue-50/30 -mx-5 px-5 pb-2 rounded-b-xl">
              <p className="text-sm font-semibold text-[var(--color-brand-primary)] mb-4">
                Dados do Cônjuge / Companheiro(a)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Nome do cônjuge"
                    required
                    error={socioErrors?.conjuge?.nome?.message}
                    {...register(`${prefix}.conjuge.nome`, { required: "Obrigatório" })}
                  />
                </div>
                <Controller
                  name={`${prefix}.conjuge.cpf`}
                  control={control}
                  rules={{
                    required: "Obrigatório",
                    validate: (v) => validarCPF(v || "") || "CPF inválido",
                  }}
                  render={({ field }) => (
                    <Input
                      label="CPF do cônjuge"
                      required
                      placeholder="000.000.000-00"
                      error={socioErrors?.conjuge?.cpf?.message}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(maskCPF(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <Input label="RG do cônjuge" required error={socioErrors?.conjuge?.rg?.message} {...register(`${prefix}.conjuge.rg`, { required: "Obrigatório" })} />
                <Input label="Data de nascimento" type="date" required error={socioErrors?.conjuge?.nascimento?.message} {...register(`${prefix}.conjuge.nascimento`, { required: "Obrigatório" })} />
                <Controller
                  name={`${prefix}.conjuge.telefone`}
                  control={control}
                  rules={{ required: "Obrigatório", validate: (v) => (v || "").replace(/\D/g, "").length >= 10 || "Incompleto" }}
                  render={({ field }) => (
                    <Input
                      label="Celular do cônjuge"
                      required
                      placeholder="(11) 90000-0000"
                      error={socioErrors?.conjuge?.telefone?.message}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(maskPhone(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <Input
                  label="E-mail do cônjuge"
                  type="email"
                  required
                  error={socioErrors?.conjuge?.email?.message}
                  {...register(`${prefix}.conjuge.email`, {
                    required: "Obrigatório",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
                  })}
                />
                <Input label="Renda Mensal (IR) R$" type="number" min={0} {...register(`${prefix}.conjuge.renda`, { valueAsNumber: true })} />
                <div className="sm:col-span-2">
                  <p className="label-base mb-2">
                    Incluir renda do cônjuge na proposta? <span className="text-red-500">*</span>
                  </p>
                  <div className="flex gap-4">
                    {(["sim", "nao"] as const).map((val) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={val} className="accent-[var(--color-brand-primary)] w-4 h-4" {...register(`${prefix}.conjuge.incluir_renda`, { required: "Obrigatório" })} />
                        <span className="text-sm">{val === "sim" ? "Sim" : "Não"}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Somar a renda pode expandir o limite de crédito aprovado.</p>
                </div>
                <div className="sm:col-span-2">
                  <Controller
                    name={`${prefix}.conjuge.imovel_tipo`}
                    control={control}
                    render={({ field }) => (
                      <Select label="Imóvel em nome do cônjuge" placeholder="Selecione" options={IMOVEL_TIPO_OPTIONS} value={field.value || ""} onChange={field.onChange} onBlur={field.onBlur} />
                    )}
                  />
                </div>
                {conjugeImovelTipo && conjugeImovelTipo !== "Não possui" && (
                  <Input label="Valor estimado (R$)" type="number" min={0} {...register(`${prefix}.conjuge.imovel_valor`, { valueAsNumber: true })} />
                )}
                <div className="sm:col-span-2">
                  <p className="label-base mb-2">Veículo(s) — Placa(s) do cônjuge</p>
                  <Controller
                    name={`${prefix}.conjuge.veiculo_placas`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => <PlacasInput value={field.value || []} onChange={field.onChange} />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Step2Socios({ form }: Step2Props) {
  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "socios" });

  const socios = watch("socios") || [];
  const totalParticipacao = socios.reduce((sum, s) => sum + (Number(s?.participacao) || 0), 0);

  function addSocio() {
    if (fields.length >= 5) return;
    append({
      nome: "", cpf: "", rg: "", participacao: 0,
      nascimento: "", estado_civil: "", profissao: "", nacionalidade: "Brasileira",
      email: "", telefone: "", renda: 0,
      cep: "", logradouro: "", numero: "", complemento: "",
      bairro: "", cidade: "", uf: "",
      imovel_tipo: "Não possui", imovel_valor: null, veiculo_placas: [],
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Sócios da Empresa</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Mínimo 1, máximo 5 sócios</p>
        </div>
        <div className={`text-sm font-mono font-medium px-3 py-1 rounded-full ${totalParticipacao > 100 ? "bg-red-100 text-red-700" : totalParticipacao === 100 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
          {totalParticipacao.toFixed(1)}% / 100%
        </div>
      </div>

      {totalParticipacao > 100 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">A soma das participações ({totalParticipacao.toFixed(1)}%) não pode ultrapassar 100%.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <SocioCard
          key={field.id}
          form={form}
          index={index}
          onRemove={() => remove(index)}
          canRemove={fields.length > 1}
        />
      ))}

      {fields.length < 5 && (
        <Button type="button" variant="outline" onClick={addSocio} className="w-full">
          <Plus className="w-4 h-4" /> Adicionar Sócio
        </Button>
      )}
    </div>
  );
}
