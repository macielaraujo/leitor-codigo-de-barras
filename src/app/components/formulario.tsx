"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

const user = process.env.NEXT_PUBLIC_USER;
const pass = process.env.NEXT_PUBLIC_PASS;

type FormData = {
  nome: string;
  senha: string;
};

export function Formulario() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [erro, setErro] = useState("");
  const router = useRouter();

  function onSubmit(data: FormData) {
    const { nome, senha } = data;
    if (nome == user && senha == pass) {
      router.push("/lercodigo");
    } else {
      setErro("Usuário ou senha incorreto!");
      reset();
    }
  }

  return (
    <section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-50 rounded-2xl p-5 flex flex-col gap-5 border border-slate-300 shadow-md shadow-slate-300 text-sm items-center"
      >
        <div className="bg-white px-3 py-2 rounded-xl mr-1">
          <label htmlFor="nome">Usuário</label>
          <input
            type="text"
            id="nome"
            required
            {...register("nome")}
            className=" ml-1 focus:border-0 px-1 text-slate-600 focus:outline-0"
          />
        </div>
        <div className="bg-white px-3 py-2 rounded-xl mr-1">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            required
            {...register("senha")}
            className=" ml-1 focus:border-0 px-1 text-slate-600 focus:outline-0"
          />
        </div>
        {erro && (
          <p className="text-red-600 text-sm font-medium text-center">{erro}</p>
        )}
        <button
          type="submit"
          className="bg-purple-700 text-white px-5 py-2 rounded-2xl hover:cursor-pointer"
        >
          Acessar
        </button>
      </form>
    </section>
  );
}
