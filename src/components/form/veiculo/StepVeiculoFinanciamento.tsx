"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { useEffect } from "react";
import {
  PropostaVeiculoFormData,
  CATEGORIA_VEICULO_OPTIONS,
  PARCELAS_VEICULO_OPTIONS,
} from "@/types/veiculo";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { maskMoney, parseMoney } from "@/lib/utils";
import { useFipe, parseFipeValue } from "@/hooks/useFipe";
import { Loader2 } from "lucide-react";

interface Props {
  form: UseFormReturn<PropostaVeiculoFormData>;
  isGarantia: boolean;
}

const fipeSelectClass = [
  "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
  "border-[var(--color-border)] bg-[var(--color-surface-subtle)]",
  "text-[var(--color-text)] focus:border-[#234469]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export default function StepVeiculoFinanciamento({ form, isGarantia }: Props) {
  const { register, control, setValue, watch, formState: { errors } } = form;

  const veiculo_tipo      = watch("veiculo_tipo");
  const veiculo_categoria = watch("veiculo_categoria") || "carros";
  const valor_veiculo     = watch("valor_veiculo");
  const valor_entrada     = watch("valor_entrada");
  const veiculo_tem_divida = watch("veiculo_tem_divida");

  const fipe = useFipe(veiculo_categoria);

  // Reset FIPE cascade when categoria changes
  useEffect(() => {
    setValue("veiculo_marca",          "");
    setValue("veiculo_marca_id",       "");
    setValue("veiculo_modelo",         "");
    setValue("veiculo_modelo_id",      "");
    setValue("veiculo_ano_fabricacao", "");
    setValue("veiculo_ano_id",         "");
    setValue("veiculo_valor_fipe",     0);
  }, [veiculo_categoria]);

  // Auto-fill valor_veiculo from FIPE
  useEffect(() => {
    if (fipe.precoFipe) {
      const v = parseFipeValue(fipe.precoFipe.Valor);
      setValue("veiculo_valor_fipe", v);
      if (!valor_veiculo || valor_veiculo === 0) {
        setValue("valor_veiculo", v);
      }
    }
  }, [fipe.precoFipe]);

  // Auto-calculate valor_financiamento
  useEffect(() => {
    const fin = Math.max(0, (valor_veiculo || 0) - (valor_entrada || 0));
    setValue("valor_financiamento", fin);
  }, [valor_veiculo, valor_entrada]);

  function handleMarcaChange(id: string) {
    fipe.setMarcaId(id);
    const marca = fipe.marcas.find(m => m.codigo === id);
    setValue("veiculo_marca_id", id);
    setValue("veiculo_marca",    marca?.nome || "", { shouldValidate: !!id });
    setValue("veiculo_modelo",   "");
    setValue("veiculo_modelo_id","");
    setValue("veiculo_ano_fabricacao", "");
    setValue("veiculo_ano_id",   "");
    setValue("veiculo_valor_fipe", 0);
    fipe.setModeloId("");
    fipe.setAnoId("");
  }

  function handleModeloChange(id: string) {
    fipe.setModeloId(id);
    const modelo = fipe.modelos.find(m => String(m.codigo) === id);
    setValue("veiculo_modelo_id", id);
    setValue("veiculo_modelo",    modelo?.nome || "", { shouldValidate: !!id });
    setValue("veiculo_ano_fabricacao", "");
    setValue("veiculo_ano_id",    "");
    setValue("veiculo_valor_fipe", 0);
    fipe.setAnoId("");
  }

  function handleAnoChange(id: string) {
    fipe.setAnoId(id);
    const ano = fipe.anos.find(a => a.codigo === id);
    setValue("veiculo_ano_id",         id);
    setValue("veiculo_ano_fabricacao", id.split("-")[0] || "", { shouldValidate: !!id });
  }

  return (
    <div className="space-y-6">
      {/* Dados do Veículo */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Dados do Veículo
        </h2>

        {/* Novo / Usado */}
        <div className="mb-5">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">
            Veículo <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-3">
            {(["novo", "usado"] as const).map((v) => {
              const active = veiculo_tipo === v;
              return (
                <label
                  key={v}
                  className="flex-1 flex items-center gap-2 cursor-pointer rounded-xl border-2 px-4 py-3 transition-all"
                  style={{
                    borderColor: active ? "#234469" : "#D8E2EE",
                    background:  active ? "rgb(35 68 105 / 0.07)" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    value={v}
                    className="accent-[#234469]"
                    {...register("veiculo_tipo", { required: "Selecione novo ou usado" })}
                  />
                  <span className="text-sm font-semibold capitalize" style={{ color: active ? "#234469" : "#5A6E88" }}>
                    {v === "novo" ? "Veículo Novo" : "Veículo Usado"}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.veiculo_tipo && (
            <p className="text-xs text-red-500 mt-1">{errors.veiculo_tipo.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoria"
            required
            options={CATEGORIA_VEICULO_OPTIONS}
            placeholder="Selecione"
            error={errors.veiculo_categoria?.message}
            {...register("veiculo_categoria", { required: "Categoria é obrigatória" })}
          />

          {/* Marca — FIPE cascade */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Marca <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className={fipeSelectClass}
                value={fipe.marcaId}
                onChange={e => handleMarcaChange(e.target.value)}
                disabled={fipe.loadingMarcas || fipe.marcas.length === 0}
              >
                <option value="">
                  {fipe.loadingMarcas ? "Carregando marcas..." : "Selecione a marca"}
                </option>
                {fipe.marcas.map(m => (
                  <option key={m.codigo} value={m.codigo}>{m.nome}</option>
                ))}
              </select>
              {fipe.loadingMarcas && (
                <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-[#5A6E88]" />
              )}
            </div>
            {/* hidden registered field for validation */}
            <input type="hidden" {...register("veiculo_marca", { required: "Marca é obrigatória" })} />
            {errors.veiculo_marca && (
              <p className="text-xs text-red-500 mt-1">{errors.veiculo_marca.message}</p>
            )}
          </div>

          {/* Modelo — FIPE cascade */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Modelo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className={fipeSelectClass}
                value={fipe.modeloId}
                onChange={e => handleModeloChange(e.target.value)}
                disabled={fipe.loadingModelos || fipe.modelos.length === 0}
              >
                <option value="">
                  {fipe.loadingModelos ? "Carregando modelos..." : !fipe.marcaId ? "Selecione a marca primeiro" : "Selecione o modelo"}
                </option>
                {fipe.modelos.map(m => (
                  <option key={m.codigo} value={String(m.codigo)}>{m.nome}</option>
                ))}
              </select>
              {fipe.loadingModelos && (
                <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-[#5A6E88]" />
              )}
            </div>
            <input type="hidden" {...register("veiculo_modelo", { required: "Modelo é obrigatório" })} />
            {errors.veiculo_modelo && (
              <p className="text-xs text-red-500 mt-1">{errors.veiculo_modelo.message}</p>
            )}
          </div>

          {/* Ano — FIPE cascade */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Ano / Versão <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className={fipeSelectClass}
                value={fipe.anoId}
                onChange={e => handleAnoChange(e.target.value)}
                disabled={fipe.loadingAnos || fipe.anos.length === 0}
              >
                <option value="">
                  {fipe.loadingAnos ? "Carregando anos..." : !fipe.modeloId ? "Selecione o modelo primeiro" : "Selecione o ano"}
                </option>
                {fipe.anos.map(a => (
                  <option key={a.codigo} value={a.codigo}>{a.nome}</option>
                ))}
              </select>
              {fipe.loadingAnos && (
                <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-[#5A6E88]" />
              )}
            </div>
            <input type="hidden" {...register("veiculo_ano_fabricacao", { required: "Ano é obrigatório" })} />
            {errors.veiculo_ano_fabricacao && (
              <p className="text-xs text-red-500 mt-1">{errors.veiculo_ano_fabricacao.message}</p>
            )}
          </div>

          {/* Placa (apenas para usados) */}
          {veiculo_tipo === "usado" && (
            <Input
              label="Placa"
              placeholder="ABC-1234"
              {...register("veiculo_placa")}
            />
          )}
        </div>

        {/* Badge FIPE */}
        {fipe.precoFipe && (
          <div className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgb(35 68 105 / 0.06)", border: "1px solid rgb(35 68 105 / 0.15)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#5A6E88" }}>
                Tabela FIPE — {fipe.precoFipe.MesReferencia}
              </p>
              <p className="text-lg font-bold font-mono" style={{ color: "#234469" }}>
                {fipe.precoFipe.Valor}
              </p>
              <p className="text-xs" style={{ color: "#5A6E88" }}>
                {fipe.precoFipe.Marca} {fipe.precoFipe.Modelo} · Cód. {fipe.precoFipe.CodigoFipe}
              </p>
            </div>
            {fipe.loadingPreco && (
              <Loader2 className="w-4 h-4 animate-spin text-[#234469] ml-auto" />
            )}
          </div>
        )}
        {fipe.loadingPreco && !fipe.precoFipe && (
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: "#5A6E88" }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            Consultando tabela FIPE...
          </div>
        )}
      </div>

      {/* Dados do Financiamento */}
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Dados do Financiamento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="valor_veiculo"
            control={control}
            rules={{ required: "Valor do veículo é obrigatório", min: { value: 1, message: "Informe o valor" } }}
            render={({ field }) => (
              <Input
                label="Valor do veículo"
                required
                inputMode="numeric"
                placeholder="R$ 0,00"
                error={errors.valor_veiculo?.message}
                hint={fipe.precoFipe ? `FIPE: ${fipe.precoFipe.Valor}` : undefined}
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <Controller
            name="valor_entrada"
            control={control}
            render={({ field }) => (
              <Input
                label="Valor da entrada"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <Controller
            name="valor_financiamento"
            control={control}
            render={({ field }) => (
              <Input
                label="Valor a financiar"
                inputMode="numeric"
                placeholder="R$ 0,00"
                hint="Calculado automaticamente"
                value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                onChange={(e) => field.onChange(parseMoney(e.target.value))}
              />
            )}
          />
          <Select
            label="Parcelas desejadas"
            required
            options={PARCELAS_VEICULO_OPTIONS}
            placeholder="Selecione"
            error={errors.parcelas?.message}
            {...register("parcelas", { required: "Selecione a quantidade de parcelas" })}
          />
        </div>
      </div>

      {/* Situação do veículo — apenas para Garantia */}
      {isGarantia && (
        <div className="card-form" style={{ borderColor: "rgb(238 102 27 / 0.25)", background: "rgb(238 102 27 / 0.03)" }}>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1 pb-3 border-b border-[var(--color-border)]">
            Situação do Veículo
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4 mt-3">
            Informe se este veículo ainda possui financiamento em andamento.
          </p>

          <div className="flex gap-3 mb-4">
            {([
              { value: "nao", label: "Veículo quitado" },
              { value: "sim", label: "Com financiamento ativo" },
            ] as const).map((opt) => {
              const active = veiculo_tem_divida === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex-1 flex items-center gap-2 cursor-pointer rounded-xl border-2 px-4 py-3 transition-all"
                  style={{
                    borderColor: active ? "#ee661b" : "#D8E2EE",
                    background:  active ? "rgb(238 102 27 / 0.06)" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    className="accent-[#ee661b]"
                    {...register("veiculo_tem_divida")}
                  />
                  <span className="text-sm font-medium" style={{ color: active ? "#ee661b" : "#5A6E88" }}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>

          {veiculo_tem_divida === "sim" && (
            <Controller
              name="veiculo_saldo_devedor"
              control={control}
              render={({ field }) => (
                <Input
                  label="Saldo devedor aproximado"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  hint="Valor aproximado do financiamento restante"
                  value={field.value ? maskMoney(Math.round(field.value * 100).toString()) : ""}
                  onChange={(e) => field.onChange(parseMoney(e.target.value))}
                />
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
