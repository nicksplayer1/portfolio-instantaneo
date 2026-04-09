import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createInvite } from "./actions";

function inputClassName() {
  return "mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900";
}

function textareaClassName() {
  return "mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900";
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-zinc-500">
                Convite interativo
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                Criar novo convite
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-600">
                Monte uma página bonita para compartilhar os detalhes do seu evento
                por link.
              </p>
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
            Não foi possível criar o convite. Confira os campos e tente de novo.
          </div>
        ) : null}

        <form action={createInvite} className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Informações principais</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Esses dados aparecem no topo da página pública.
              </p>

              <div className="mt-6">
                <label className="text-sm font-medium text-zinc-900">Título do evento *</label>
                <input
                  name="title"
                  className={inputClassName()}
                  placeholder="Ex.: Casamento da Ana e do Lucas"
                  required
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Anfitrião / organizador</label>
                <input
                  name="host_name"
                  className={inputClassName()}
                  placeholder="Ex.: Família Souza"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Tipo de evento</label>
                <input
                  name="event_type"
                  className={inputClassName()}
                  placeholder="Ex.: Aniversário, Casamento, Chá revelação"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Descrição</label>
                <textarea
                  name="description"
                  className={textareaClassName()}
                  placeholder="Escreva uma mensagem curta e especial para os convidados."
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Data e local</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Preencha as informações principais do evento.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-900">Data</label>
                  <input name="event_date" type="date" className={inputClassName()} />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-900">Hora</label>
                  <input
                    name="event_time"
                    className={inputClassName()}
                    placeholder="Ex.: 19h30"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Nome do local</label>
                <input
                  name="location_name"
                  className={inputClassName()}
                  placeholder="Ex.: Espaço Jardim das Flores"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Endereço</label>
                <input
                  name="location_address"
                  className={inputClassName()}
                  placeholder="Ex.: Rua Exemplo, 123 - Centro"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Link do mapa</label>
                <input
                  name="map_link"
                  className={inputClassName()}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Visual</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Adicione uma imagem de capa e detalhes visuais do convite.
              </p>

              <div className="mt-6">
                <label className="text-sm font-medium text-zinc-900">Imagem de capa (URL)</label>
                <input
                  name="cover_image_url"
                  className={inputClassName()}
                  placeholder="https://imagem-da-capa.jpg"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Tema</label>
                <input
                  name="theme"
                  className={inputClassName()}
                  placeholder="Ex.: Floral, Minimalista, Infantil, Elegante"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Dress code</label>
                <input
                  name="dress_code"
                  className={inputClassName()}
                  placeholder="Ex.: Esporte fino / Tons claros"
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Links extras</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Você pode incluir confirmação de presença e lista de presentes.
              </p>

              <div className="mt-6">
                <label className="text-sm font-medium text-zinc-900">Link de confirmação (RSVP)</label>
                <input
                  name="rsvp_link"
                  className={inputClassName()}
                  placeholder="https://seulink.com/rsvp"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-900">Lista de presentes</label>
                <input
                  name="gift_link"
                  className={inputClassName()}
                  placeholder="https://seulink.com/presentes"
                />
              </div>

              <label className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                <input name="is_public" type="checkbox" className="size-4" defaultChecked />
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
              Criar convite
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
