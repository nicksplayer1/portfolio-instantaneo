import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteResume } from "./actions";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import LogoutButton from "@/components/auth/logout-button";

type Props = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();
  const params = await searchParams;

  if (authError || !data.user) {
    redirect("/login");
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("id, slug, name, role, city, created_at")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
            <p className="mt-2 text-zinc-600">
              Gerencie os currículos criados na sua conta.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Novo currículo
            </Link>

            <LogoutButton />
          </div>
        </div>

        {params?.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        {params?.success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {params.success}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
          Usuário autenticado: {data.user.email}
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Erro ao buscar currículos: {error.message}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4">
          {!resumes?.length ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
              <h2 className="text-xl font-semibold text-zinc-900">
                Você ainda não criou nenhum currículo
              </h2>
              <p className="mt-2 text-zinc-600">
                Crie o primeiro agora para gerar seu link público.
              </p>
              <Link
                href="/create"
                className="mt-5 inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Criar primeiro currículo
              </Link>
            </div>
          ) : (
            resumes.map((resume) => {
              const publicUrl = `https://curriculo-link.vercel.app/cv/${resume.slug}`;

              return (
                <div
                  key={resume.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">
                        {resume.name}
                      </h2>
                      <p className="mt-1 text-zinc-600">
                        {resume.role || "Sem cargo informado"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
                        <span>Slug: {resume.slug}</span>
                        <span>{resume.city || "Cidade não informada"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/cv/${resume.slug}`}
                        className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/edit/${resume.id}`}
                        className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>

                      <CopyLinkButton url={publicUrl} />

                      <form action={deleteResume}>
                        <input type="hidden" name="id" value={resume.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
