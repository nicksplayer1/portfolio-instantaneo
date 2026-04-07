import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateResume } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

function inputClassName() {
  return "mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500";
}

export default async function EditResumePage({ params, searchParams }: Props) {
  const { id } = await params;
  const paramsSearch = await searchParams;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (error || !resume) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Editar currículo</h1>
            <p className="mt-2 text-zinc-600">
              Atualize os dados e salve as mudanças.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Voltar ao dashboard
          </Link>
        </div>

        {paramsSearch?.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paramsSearch.error}
          </div>
        ) : null}

        <form action={updateResume} className="mt-8 space-y-6">
          <input type="hidden" name="id" value={resume.id} />

          <div>
            <label htmlFor="name" className="text-sm font-medium text-zinc-900">
              Nome completo *
            </label>
            <input id="name" name="name" required defaultValue={resume.name ?? ""} placeholder="Seu nome completo" className={inputClassName()} />
          </div>

          <div>
            <label htmlFor="role" className="text-sm font-medium text-zinc-900">
              Cargo / área
            </label>
            <input id="role" name="role" defaultValue={resume.role ?? ""} placeholder="Ex.: Atendimento, design, vendas, suporte..." className={inputClassName()} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-zinc-900">
                Email
              </label>
              <input id="email" name="email" type="email" defaultValue={resume.email ?? ""} placeholder="seuemail@exemplo.com" className={inputClassName()} />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-zinc-900">
                Telefone
              </label>
              <input id="phone" name="phone" defaultValue={resume.phone ?? ""} placeholder="(00) 00000-0000" className={inputClassName()} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="text-sm font-medium text-zinc-900">
                Cidade
              </label>
              <input id="city" name="city" defaultValue={resume.city ?? ""} placeholder="Sua cidade" className={inputClassName()} />
            </div>

            <div>
              <label htmlFor="linkedin" className="text-sm font-medium text-zinc-900">
                LinkedIn
              </label>
              <input id="linkedin" name="linkedin" defaultValue={resume.linkedin ?? ""} placeholder="linkedin.com/in/seu-link" className={inputClassName()} />
            </div>
          </div>

          <div>
            <label htmlFor="portfolio" className="text-sm font-medium text-zinc-900">
              Portfólio / site
            </label>
            <input id="portfolio" name="portfolio" defaultValue={resume.portfolio ?? ""} placeholder="seusite.com" className={inputClassName()} />
          </div>

          <div>
            <label htmlFor="summary" className="text-sm font-medium text-zinc-900">
              Resumo profissional
            </label>
            <textarea id="summary" name="summary" rows={5} defaultValue={resume.summary ?? ""} placeholder="Fale rapidamente sobre você, sua experiência e seus objetivos." className={inputClassName()} />
          </div>

          <div>
            <label htmlFor="experience" className="text-sm font-medium text-zinc-900">
              Experiência
            </label>
            <textarea id="experience" name="experience" rows={6} defaultValue={resume.experience ?? ""} placeholder="Escreva uma experiência por linha." className={inputClassName()} />
          </div>

          <div>
            <label htmlFor="education" className="text-sm font-medium text-zinc-900">
              Formação
            </label>
            <textarea id="education" name="education" rows={5} defaultValue={resume.education ?? ""} placeholder="Escreva uma formação por linha." className={inputClassName()} />
          </div>

          <div>
            <label htmlFor="skills" className="text-sm font-medium text-zinc-900">
              Habilidades
            </label>
            <textarea id="skills" name="skills" rows={4} defaultValue={resume.skills ?? ""} placeholder="Escreva uma habilidade por linha." className={inputClassName()} />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-5 py-3 text-center text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
