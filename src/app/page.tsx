 import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Crie seu currículo por link
        </h1>

        <p className="mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
          Gere um currículo online bonito, profissional e fácil de compartilhar.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/create"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Criar currículo
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}