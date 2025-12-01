"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Link from "next/link";

type VideoDecodeControls = {
  stop: () => void;
};

export default function Home() {
  const [codLido, setCodLido] = useState("");
  const [lendo, setLendo] = useState(false);
  const [enviando, setEnviando] = useState("Enviar para planilha");
  const [identifyCode, setIdentifyCode] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<VideoDecodeControls | null>(null);

  // Função para iniciar a leitura
  const iniciarLeitura = useCallback(() => {
    if (!videoRef.current) return;

    setCodLido("");
    setLendo(true);

    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err, controls) => {
          // salva o controls usado por este scan
          if (!streamRef.current) streamRef.current = controls;

          if (result) {
            const texto = result.getText();
            setCodLido(texto);
            console.log("Código lido:", texto);

            // para a câmera após ler
            controls.stop();
            setLendo(false);
          }
        }
      )
      .catch((err) => {
        console.error("Erro ao iniciar leitura:", err);
      });
  }, []);

  // Parar leitura manualmente
  const pararLeitura = useCallback(() => {
    try {
      streamRef.current?.stop();
    } catch (e) {
      console.warn("Erro ao parar leitura manual:", e);
    }
    setLendo(false);
  }, []);

  // Para a câmera ao desmontar
  useEffect(() => {
    return () => {
      try {
        streamRef.current?.stop();
      } catch {}
    };
  }, []);

  const enviarParaPlanilha = async () => {
    const SCRIPT_URL = process.env.NEXT_PUBLIC_URL_PLANILHA;
    setEnviando("Enviando...");

    if (!codLido) {
      alert("Nenhum código lido!");
      return;
    }
    if (!identifyCode) {
      alert("Selecione uma categoria!");
      return;
    }

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // obrigatório com Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo: codLido,
          categoria: identifyCode,
        }),
      });

      alert("Informações enviadas para a planilha!");
    } catch (e) {
      console.error("Erro ao enviar:", e);
      alert("Erro ao enviar para a planilha!");
    }
    setCodLido("");
    setEnviando("Enviar para Planilha");
  };

  return (
    <section className="bg-slate-100 h-screen w-screen flex flex-col  items-center p-5">
      <div className="container bg-slate-100 flex flex-col justify-center items-center gap-5">
        <h1 className="font-semibold text-lg">Leitor de Código de Barras</h1>

        <div className="w-full border border-slate-400 rounded-2xl h-32 bg-slate-200">
          <video ref={videoRef} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-row gap-5 justify-center w-full">
          <button
            onClick={iniciarLeitura}
            className="bg-green-300 px-7 py-4 w-1/2 rounded-4xl text-sm hover:cursor-pointer"
            disabled={lendo}
          >
            {lendo ? "Lendo..." : "Ler código"}
          </button>

          <button
            onClick={pararLeitura}
            disabled={!lendo}
            className="bg-red-300 px-7 py-4 w-1/2 rounded-4xl text-sm hover:cursor-pointer"
          >
            Parar leitura
          </button>
        </div>

        <h2>
          Código lido: <b>{codLido || "Aguardando leitura"}</b>
        </h2>

        <div
          className={`${
            codLido != "" ? "block" : "hidden"
          }  px-7 py-4 gap-5 my-7 w-full flex flex-col justify-center items-center`}
        >
          <h4 className="font-semibold">O código lido pertence à:</h4>
          <select
            className="border border-slate-300 w-2/3 text-center focus:border-slate-300"
            value={identifyCode}
            onChange={(e) => setIdentifyCode(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Cartão de Garantia">Cartão de Garantia</option>
            <option value="Bateria">Bateria</option>
          </select>
          <div className=" relative">
            <div
              className={`${
                identifyCode != "" ? "-z-10" : "z-10"
              } absolute bg-slate-500/50 w-full h-full rounded-2xl`}
            ></div>
            <button
              className="bg-blue-300 px-7 py-2 rounded-2xl hover:cursor-pointer z-20"
              onClick={() => enviarParaPlanilha()}
            >
              {enviando}
            </button>
          </div>
        </div>
        <Link
          href="/"
          className="bg-blue-800 text-white px-5 py-2 rounded-2xl hover:cursor-pointer"
        >
          Voltar
        </Link>
      </div>
    </section>
  );
}
