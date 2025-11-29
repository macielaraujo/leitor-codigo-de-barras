import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-slate-100 w-screen h-screen flex flex-col items-center justify-center p-7">
      <div className="container w-full flex flex-col justify-center items-center gap-5">
        <div className="text-center">
          <h1 className="font-semibold text-lg">Leitor de Código de barras</h1>
          <p className="text-slate-700">
            Realizando o controle de produtos lidos
          </p>
        </div>
        <Link
          href="/lercodigo"
          className="bg-purple-700 text-white px-5 py-2 rounded-2xl hover:cursor-pointer"
        >
          Ler Código
        </Link>
      </div>
    </main>
  );
}
