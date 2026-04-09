import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteInvite, duplicateInvite } from "./actions";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import LogoutButton from "@/components/auth/logout-button";

type SearchParams = Promise<{ success?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: invites } = await supabase
    .from("invites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-zinc-500">
                Painel de controle
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-600">
                Gerencie seus convites, copie links, duplique versões e edite a página
                sempre que quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Novo convite
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Usuário autenticado: <span className="font-medium">{user.email}</span>
          </div>
        </section>

        {params?.success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Ação concluída com sucesso.
          </div>
        ) : null}

        <section className="mt-6 space-y-4">
          {!invites?.length ? (
            <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Nenhum convite ainda
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
                Crie sua primeira página agora
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
                Monte uma apresentação bonita com data, local, confirmação de presença
                e links principais para compartilhar com seus convidados.
              </p>
              <Link
                href="/create"
                className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Criar meu primeiro convite
              </Link>
            </div>
          ) : null}

          {invites?.map((invite) => {
            const publicUrl = `/invite/${invite.slug}`;

            return (
              <article
                key={invite.id}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold text-zinc-950">
                        {invite.title}
                      </h3>
                      {invite.is_public ? (
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                          Público
                        </span>
                      ) : null}
                    </div>

                    {invite.event_type ? (
                      <p className="mt-3 text-zinc-600">{invite.event_type}</p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                      <span>
                        Criado em{" "}
                        {new Date(invite.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <span>
                        Atualizado em{" "}
                        {new Date(invite.updated_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={publicUrl}
                      className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                    >
                      Ver convite
                    </Link>

                    <Link
                      href={`/edit/${invite.id}`}
                      className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                    >
                      Editar
                    </Link>

                    <CopyLinkButton url={publicUrl} />

                    <form action={duplicateInvite}>
                      <input type="hidden" name="id" value={invite.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Duplicar
                      </button>
                    </form>

                    <form action={deleteInvite}>
                      <input type="hidden" name="id" value={invite.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        onClick={undefined}
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
