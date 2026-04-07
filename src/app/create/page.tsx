import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createResume } from "./actions";

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function CreatePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};
  const errorMessage = params.error ? decodeURIComponent(params.error) : "";

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Novo currículo</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Preencha os dados abaixo para gerar seu currículo por link.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Voltar ao dashboard
          </Link>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <form action={createResume} className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-800">
                Nome completo *
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Ex.: João da Silva"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-zinc-800">
                Cargo / área
              </label>
              <input
                id="role"
                name="role"
                placeholder="Ex.: Assistente administrativo"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-zinc-800">
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                placeholder="(64) 99999-9999"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-zinc-800">
                Cidade
              </label>
              <input
                id="city"
                name="city"
                placeholder="Ex.: Rio Verde - GO"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="mb-2 block text-sm font-medium text-zinc-800">
                LinkedIn
              </label>
              <input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/seu-link"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="portfolio" className="mb-2 block text-sm font-medium text-zinc-800">
                Portfólio / site
              </label>
              <input
                id="portfolio"
                name="portfolio"
                placeholder="https://seusite.com"
                className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-zinc-900"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <label htmlFor="summary" className="mb-2 block text-sm font-medium text-zinc-800">
                Resumo profissional
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                placeholder="Fale rapidamente sobre você, sua experiência e objetivo."
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="experience" className="mb-2 block text-sm font-medium text-zinc-800">
                Experiência
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={6}
                placeholder={"Ex.:\n• Empresa X - Cargo - 2023 a 2025\n• Atividades principais..."}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="education" className="mb-2 block text-sm font-medium text-zinc-800">
                Formação
              </label>
              <textarea
                id="education"
                name="education"
                rows={4}
                placeholder={"Ex.:\n• Curso X - Instituição Y\n• Ensino médio / faculdade / cursos"}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="skills" className="mb-2 block text-sm font-medium text-zinc-800">
                Habilidades
              </label>
              <textarea
                id="skills"
                name="skills"
                rows={4}
                placeholder="Ex.: Excel, atendimento ao cliente, organização, vendas..."
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Criar currículo
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
