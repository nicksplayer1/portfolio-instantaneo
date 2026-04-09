import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateInvite } from "./actions";

function inputClassName() {
  return "mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900";
}

function textareaClassName() {
  return "mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900";
}

export default async function EditInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const paramsSearch = await searchParams;
  const error = paramsSearch?.error;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invite) {
    notFound();
  }

  const updateInviteWithId = updateInvite.bind(null, invite.id);

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-zinc-500">
                Editar convite
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                Atualizar informações
              </h1>
            </div>

            <Link
              href="/dashboard"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Voltar ao dashboard
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Não foi possível salvar as alterações.
          </div>
        ) : null}

        <form action={updateInviteWithId} className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Informações principais</h2>

              <div className="mt-6">
                <label className="text-sm font-medium text-zinc-900">Título do evento *</label>
                <input
                  name="title"
                  defaultValue={invite.title}
                  className={inputClassName()}
                  required
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Anfitrião / organizador</label>
                <input
                  name="host_name"
                  defaultValue={invite.host_name ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Tipo de evento</label>
                <input
                  name="event_type"
                  defaultValue={invite.event_type ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Descrição</label>
                <textarea
                  name="description"
                  defaultValue={invite.description ?? ""}
                  className={textareaClassName()}
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Data e local</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-900">Data</label>
                  <input
                    name="event_date"
                    type="date"
                    defaultValue={invite.event_date ?? ""}
                    className={inputClassName()}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-900">Hora</label>
                  <input
                    name="event_time"
                    defaultValue={invite.event_time ?? ""}
                    className={inputClassName()}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Nome do local</label>
                <input
                  name="location_name"
                  defaultValue={invite.location_name ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Endereço</label>
                <input
                  name="location_address"
                  defaultValue={invite.location_address ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Link do mapa</label>
                <input
                  name="map_link"
                  defaultValue={invite.map_link ?? ""}
                  className={inputClassName()}
                />
              </div>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Visual</h2>

              <div className="mt-6">
                <label className="text-sm font-medium text-zinc-900">Imagem de capa (URL)</label>
                <input
                  name="cover_image_url"
                  defaultValue={invite.cover_image_url ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Tema</label>
                <input
                  name="theme"
                  defaultValue={invite.theme ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Dress code</label>
                <input
                  name="dress_code"
                  defaultValue={invite.dress_code ?? ""}
                  className={inputClassName()}
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Links extras</h2>

              <div className="mt-6">
                <label className="text-sm font-medium text-zinc-900">Link de confirmação (RSVP)</label>
                <input
                  name="rsvp_link"
                  defaultValue={invite.rsvp_link ?? ""}
                  className={inputClassName()}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Lista de presentes</label>
                <input
                  name="gift_link"
                  defaultValue={invite.gift_link ?? ""}
                  className={inputClassName()}
                />
              </div>

              <label className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                <input
                  name="is_public"
                  type="checkbox"
                  className="size-4"
                  defaultChecked={invite.is_public}
                />
                Deixar convite público por link
              </label>
            </section>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
