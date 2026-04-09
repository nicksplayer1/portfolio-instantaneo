import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-zinc-900">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.45em] text-zinc-500">
            Convite interativo
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            Crie um convite bonito, rápido e pronto para compartilhar.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Monte uma página especial para aniversário, casamento, chá revelação,
            formatura ou qualquer evento em poucos minutos.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Criar convite
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Entrar
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-400">
            Exemplo
          </p>

          <div className="overflow-hidden rounded-[1.75rem] bg-[#fbf6f6] p-6">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Convite especial
              </p>

              <h2 className="mt-4 text-3xl font-semibold text-zinc-950">
                Aniversário da Helena
              </h2>

              <p className="mt-2 text-zinc-600">Sábado, 18 de outubro • 19h</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
                    Local
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">
                    Espaço Jardim das Flores
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
                    Tema
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">
                    Elegante • Floral • Noite
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700">
                  Confirmar presença
                </span>
                <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700">
                  Ver mapa
                </span>
                <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700">
                  Lista de presentes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
