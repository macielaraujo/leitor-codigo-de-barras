"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type VideoDecodeControls = {
  stop: () => void;
};

export default function Home() {
  const [codLido, setCodLido] = useState("");
  const [lendo, setLendo] = useState(false);
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

  return (
    <section className="bg-slate-200 h-screen w-screen flex flex-col  items-center p-5">
      <div className="container bg-slate-100 flex flex-col justify-center items-center gap-5">
        <h1 className="font-semibold text-lg">Leitor de Código de Barras</h1>

        <div className="w-full border border-slate-400 rounded-2xl h-32 bg-amber-50">
          <video ref={videoRef} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-row gap-5 justify-center w-full">
          <button
            onClick={iniciarLeitura}
            className="bg-green-300 px-7 py-4 max-w-1/2 rounded-4xl text-sm hover:cursor-pointer"
            disabled={lendo}
          >
            {lendo ? "Lendo..." : "Ler código"}
          </button>

          <button
            onClick={pararLeitura}
            disabled={!lendo}
            className="bg-red-300 px-7 py-4 max-w-1/2 rounded-4xl text-sm hover:cursor-pointer"
          >
            Parar leitura
          </button>
        </div>

        <h2>
          Código lido: <b>{codLido || "Aguardando leitura"}</b>
        </h2>

        <div
          className={`${
            codLido != "" ? "block" : "block"
          }  px-7 py-4 gap-5 my-7 w-full flex flex-col justify-center items-center`}
        >
          <h4 className="font-semibold">O código lido pertence à:</h4>
          <select
            className="border border-slate-200 w-1/2 text-center"
            value={identifyCode}
            onChange={(e) => setIdentifyCode(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Nota Fiscal">Nota fiscal</option>
            <option value="Bateria">Bateria</option>
          </select>
          <p>{identifyCode}</p>
          <button className="bg-blue-300 px-7 py-2 rounded-2xl">
            Enviar para planilha
          </button>
        </div>
      </div>
    </section>
  );
}
