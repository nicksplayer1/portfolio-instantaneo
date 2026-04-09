import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUrl, formatDatePtBr } from "@/lib/invite-utils";

type Props = {
  params: Promise<{ slug: string }>;
};

function buildDateLine(date: string | null, time: string | null) {
  const dateText = formatDatePtBr(date);
  if (dateText && time) return `${dateText} • ${time}`;
  return dateText || time || "";
}

export default async function InvitePublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!invite) {
    notFound();
  }

  const mapUrl = ensureUrl(invite.map_link);
  const rsvpUrl = ensureUrl(invite.rsvp_link);
  const giftUrl = ensureUrl(invite.gift_link);
  const coverUrl = invite.cover_image_url ? ensureUrl(invite.cover_image_url) : "";

  const dateLine = buildDateLine(invite.event_date, invite.event_time);

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        {coverUrl ? (
          <div
            className="h-[260px] w-full bg-cover bg-center sm:h-[340px]"
            style={{ backgroundImage: `url('${coverUrl}')` }}
          />
        ) : (
          <div className="flex h-[220px] items-center justify-center bg-[#f8f3f1] sm:h-[300px]">
            <p className="text-xs uppercase tracking-[0.45em] text-zinc-400">
              Convite especial
            </p>
          </div>
        )}

        <section className="p-7 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-zinc-500">
                Convite público
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                {invite.title}
              </h1>

              {invite.event_type ? (
                <p className="mt-4 text-lg text-zinc-600">{invite.event_type}</p>
              ) : null}

              {invite.description ? (
                <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-700 sm:text-lg">
                  {invite.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Ir ao dashboard
              </Link>

              <button
                type="button"
                onClick={() => {}}
                className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Copiar link
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {dateLine ? (
                <div className="rounded-[1.75rem] bg-[#fbf6f6] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Data e hora
                  </p>
                  <p className="mt-3 text-lg font-medium text-zinc-950">{dateLine}</p>
                </div>
              ) : null}

              {invite.location_name || invite.location_address ? (
                <div className="rounded-[1.75rem] bg-[#f7f5f2] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Local
                  </p>

                  {invite.location_name ? (
                    <p className="mt-3 text-lg font-medium text-zinc-950">
                      {invite.location_name}
                    </p>
                  ) : null}

                  {invite.location_address ? (
                    <p className="mt-2 text-zinc-700">{invite.location_address}</p>
                  ) : null}

                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                    >
                      Ver mapa
                    </a>
                  ) : null}
                </div>
              ) : null}

              {(rsvpUrl || giftUrl) ? (
                <div className="rounded-[1.75rem] border border-zinc-200 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Ações rápidas
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {rsvpUrl ? (
                      <a
                        href={rsvpUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                      >
                        Confirmar presença
                      </a>
                    ) : null}

                    {giftUrl ? (
                      <a
                        href={giftUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Lista de presentes
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="rounded-[1.75rem] border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Detalhes</p>

              <div className="mt-5 space-y-4 text-zinc-700">
                {invite.host_name ? (
                  <div>
                    <p className="text-sm text-zinc-500">Organização</p>
                    <p className="font-medium text-zinc-950">{invite.host_name}</p>
                  </div>
                ) : null}

                {invite.theme ? (
                  <div>
                    <p className="text-sm text-zinc-500">Tema</p>
                    <p className="font-medium text-zinc-950">{invite.theme}</p>
                  </div>
                ) : null}

                {invite.dress_code ? (
                  <div>
                    <p className="text-sm text-zinc-500">Dress code</p>
                    <p className="font-medium text-zinc-950">{invite.dress_code}</p>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
