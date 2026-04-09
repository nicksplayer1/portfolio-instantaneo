import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhotoUploadField from "@/components/portfolio/photo-upload-field";
import { updatePortfolioAction } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-zinc-900">{children}</label>;
}

function inputClassName() {
  return "w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500";
}

function textareaClassName() {
  return "min-h-[140px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500";
}

export default async function EditPortfolioPage({ params, searchParams }: Props) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const { id } = await params;
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (!portfolio) {
    notFound();
  }

  const query = await searchParams;
  const error = query?.error;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                editar portfólio
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Ajustar página pública
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
                Atualize foto, bio, links e projetos sem precisar recriar do zero.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/portfolio/${portfolio.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Ver página
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Voltar ao dashboard
              </Link>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form action={updatePortfolioAction} className="space-y-6">
          <input type="hidden" name="id" value={portfolio.id} />

          <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Identidade</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Mantenha sua apresentação clara e fácil de bater o olho.
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel>Nome completo *</FieldLabel>
                      <input
                        name="name"
                        type="text"
                        required
                        defaultValue={portfolio.name ?? ""}
                        className={inputClassName()}
                        placeholder="Seu nome"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Título profissional</FieldLabel>
                      <input
                        name="title"
                        type="text"
                        defaultValue={portfolio.title ?? ""}
                        className={inputClassName()}
                        placeholder="Designer, desenvolvedor, social media..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Bio</FieldLabel>
                      <textarea
                        name="bio"
                        defaultValue={portfolio.bio ?? ""}
                        className={textareaClassName()}
                        placeholder="Descreva quem você é, no que trabalha e o que entrega."
                      />
                    </div>

                    <div>
                      <FieldLabel>Cidade</FieldLabel>
                      <input
                        name="city"
                        type="text"
                        defaultValue={portfolio.city ?? ""}
                        className={inputClassName()}
                        placeholder="Sua cidade"
                      />
                    </div>

                    <div>
                      <FieldLabel>Email</FieldLabel>
                      <input
                        name="email"
                        type="email"
                        defaultValue={portfolio.email ?? ""}
                        className={inputClassName()}
                        placeholder="voce@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Contato e links</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Deixe só os botões que você realmente quer mostrar.
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel>WhatsApp</FieldLabel>
                      <input
                        name="whatsapp"
                        type="text"
                        defaultValue={portfolio.whatsapp ?? ""}
                        className={inputClassName()}
                        placeholder="(64) 99999-9999"
                      />
                    </div>

                    <div>
                      <FieldLabel>LinkedIn</FieldLabel>
                      <input
                        name="linkedin"
                        type="text"
                        defaultValue={portfolio.linkedin ?? ""}
                        className={inputClassName()}
                        placeholder="linkedin.com/in/seu-link"
                      />
                    </div>

                    <div>
                      <FieldLabel>GitHub</FieldLabel>
                      <input
                        name="github"
                        type="text"
                        defaultValue={portfolio.github ?? ""}
                        className={inputClassName()}
                        placeholder="github.com/seuusuario"
                      />
                    </div>

                    <div>
                      <FieldLabel>Site</FieldLabel>
                      <input
                        name="website"
                        type="text"
                        defaultValue={portfolio.website ?? ""}
                        className={inputClassName()}
                        placeholder="seusite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Foto e conteúdo</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Agora você pode enviar a imagem direto sem precisar hospedar em outro lugar.
                  </p>

                  <div className="mt-5 space-y-5">
                    <PhotoUploadField
                      name="photo_url"
                      userName={portfolio.name}
                      initialUrl={portfolio.photo_url}
                    />

                    <div>
                      <FieldLabel>Projetos</FieldLabel>
                      <textarea
                        name="projects"
                        defaultValue={portfolio.projects ?? ""}
                        className={textareaClassName()}
                        placeholder={"Um projeto por linha\nLanding page para X\nApp para Y\nLoja virtual para Z"}
                      />
                    </div>

                    <div>
                      <FieldLabel>Habilidades</FieldLabel>
                      <textarea
                        name="skills"
                        defaultValue={portfolio.skills ?? ""}
                        className={textareaClassName()}
                        placeholder={"Uma habilidade por linha\nUI Design\nNext.js\nCopywriting"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Visibilidade pública</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Quando estiver ligado, qualquer pessoa com o link pode abrir sua página.
                </p>
              </div>

              <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-900">
                <input
                  name="is_public"
                  type="checkbox"
                  defaultChecked={portfolio.is_public ?? true}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                Deixar portfólio público
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-6">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Salvar alterações
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
