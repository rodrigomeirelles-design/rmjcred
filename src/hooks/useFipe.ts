"use client";

import { useState, useEffect } from "react";

const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1";

export type FipeMarca  = { codigo: string; nome: string };
export type FipeModelo = { codigo: number; nome: string };
export type FipeAno    = { codigo: string; nome: string };
export type FipePreco  = {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  FuelType: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
};

export function parseFipeValue(valor: string): number {
  return parseFloat(valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()) || 0;
}

export function useFipe(categoria: string) {
  const cat = categoria || "carros";

  const [marcas,   setMarcas]   = useState<FipeMarca[]>([]);
  const [modelos,  setModelos]  = useState<FipeModelo[]>([]);
  const [anos,     setAnos]     = useState<FipeAno[]>([]);
  const [precoFipe, setPrecoFipe] = useState<FipePreco | null>(null);

  const [marcaId,  setMarcaId]  = useState("");
  const [modeloId, setModeloId] = useState("");
  const [anoId,    setAnoId]    = useState("");

  const [loadingMarcas,  setLoadingMarcas]  = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingAnos,    setLoadingAnos]    = useState(false);
  const [loadingPreco,   setLoadingPreco]   = useState(false);

  useEffect(() => {
    setLoadingMarcas(true);
    setMarcas([]);
    setModelos([]);
    setAnos([]);
    setPrecoFipe(null);
    setMarcaId("");
    setModeloId("");
    setAnoId("");
    fetch(`${FIPE_BASE}/${cat}/marcas`)
      .then(r => r.json())
      .then((data: FipeMarca[]) => setMarcas(Array.isArray(data) ? data : []))
      .catch(() => setMarcas([]))
      .finally(() => setLoadingMarcas(false));
  }, [cat]);

  useEffect(() => {
    if (!marcaId) {
      setModelos([]);
      setAnos([]);
      setPrecoFipe(null);
      return;
    }
    setLoadingModelos(true);
    setModelos([]);
    setAnos([]);
    setPrecoFipe(null);
    setModeloId("");
    setAnoId("");
    fetch(`${FIPE_BASE}/${cat}/marcas/${marcaId}/modelos`)
      .then(r => r.json())
      .then((data: { modelos: FipeModelo[] }) => setModelos(data?.modelos || []))
      .catch(() => setModelos([]))
      .finally(() => setLoadingModelos(false));
  }, [marcaId, cat]);

  useEffect(() => {
    if (!marcaId || !modeloId) {
      setAnos([]);
      setPrecoFipe(null);
      return;
    }
    setLoadingAnos(true);
    setAnos([]);
    setPrecoFipe(null);
    setAnoId("");
    fetch(`${FIPE_BASE}/${cat}/marcas/${marcaId}/modelos/${modeloId}/anos`)
      .then(r => r.json())
      .then((data: FipeAno[]) => setAnos(Array.isArray(data) ? data : []))
      .catch(() => setAnos([]))
      .finally(() => setLoadingAnos(false));
  }, [modeloId, marcaId, cat]);

  useEffect(() => {
    if (!marcaId || !modeloId || !anoId) {
      setPrecoFipe(null);
      return;
    }
    setLoadingPreco(true);
    setPrecoFipe(null);
    fetch(`${FIPE_BASE}/${cat}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`)
      .then(r => r.json())
      .then((data: FipePreco) => setPrecoFipe(data))
      .catch(() => setPrecoFipe(null))
      .finally(() => setLoadingPreco(false));
  }, [anoId, modeloId, marcaId, cat]);

  function resetAll() {
    setMarcaId("");
    setModeloId("");
    setAnoId("");
    setModelos([]);
    setAnos([]);
    setPrecoFipe(null);
  }

  return {
    marcas, modelos, anos, precoFipe,
    marcaId, setMarcaId,
    modeloId, setModeloId,
    anoId, setAnoId,
    loadingMarcas, loadingModelos, loadingAnos, loadingPreco,
    resetAll,
  };
}
