import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ensureUrl,
  formatWebsiteLabel,
  getInitials,
  normalizeWhatsapp,
  splitLines,
} from "@/lib/portfolio-utils";
import CopyLinkButton from "@/components/dashboard/copy-link-button";

type Props = {
  params: Promise<{ slug: string }>;
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 px-6 py-8 sm:px-10 sm:py-10">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}

export default async function PortfolioPublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!portfolio) {
    notFound();
  }

  const projects = splitLines(portfolio.projects);
  const skills = splitLines(portfolio.skills);
  const currentUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/portfolio/${portfolio.slug}`
    : `/portfolio/${portfolio.slug}`;

  const whatsappHref = normalizeWhatsapp(portfolio.whatsapp)
    ? `https://wa.me/${normalizeWhatsapp(portfolio.whatsapp)}`
    : "";

  const socialItems = [
    portfolio.linkedin ? { label: "LinkedIn", href: ensureUrl(portfolio.linkedin) } : null,
    portfolio.github ? { label: "GitHub", href: ensureUrl(portfolio.github) } : null,
    portfolio.website ? { label: "Site", href: ensureUrl(portfolio.website) } : null,
    portfolio.email ? { label: "Email", href: `mailto:${portfolio.email}` } : null,
    whatsappHref ? { label: "WhatsApp", href: whatsappHref } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Portfólio público
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                {portfolio.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Ir ao dashboard
              </Link>
              <CopyLinkButton url={currentUrl} />
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Portfólio instantâneo
              </p>
              <div className="mt-5 flex items-start gap-5">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50 sm:h-28 sm:w-28">
                  {portfolio.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ensureUrl(portfolio.photo_url)}
                      alt={portfolio.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
                      {getInitials(portfolio.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl">
                    {portfolio.name}
                  </h2>
                  {portfolio.title ? (
                    <p className="mt-4 text-lg text-zinc-600 sm:text-2xl">{portfolio.title}</p>
                  ) : null}
                </div>
              </div>

              {portfolio.bio ? (
                <p className="mt-7 max-w-3xl text-sm leading-7 text-zinc-700 sm:text-base">
                  {portfolio.bio}
                </p>
              ) : null}

              {socialItems.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {socialItems.map((item) => (
                    <SocialLink key={item.label} href={item.href} label={item.label} />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Contato</p>
              <div className="mt-4 space-y-3 text-sm text-zinc-700">
                {portfolio.email ? (
                  <p>
                    <span className="font-medium text-zinc-950">Email:</span> {portfolio.email}
                  </p>
                ) : null}
                {portfolio.whatsapp ? (
                  <p>
                    <span className="font-medium text-zinc-950">WhatsApp:</span> {portfolio.whatsapp}
                  </p>
                ) : null}
                {portfolio.city ? (
                  <p>
                    <span className="font-medium text-zinc-950">Cidade:</span> {portfolio.city}
                  </p>
                ) : null}
                {portfolio.linkedin ? (
                  <p>
                    <span className="font-medium text-zinc-950">LinkedIn:</span>{" "}
                    <a
                      href={ensureUrl(portfolio.linkedin)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {formatWebsiteLabel(portfolio.linkedin)}
                    </a>
                  </p>
                ) : null}
                {portfolio.github ? (
                  <p>
                    <span className="font-medium text-zinc-950">GitHub:</span>{" "}
                    <a
                      href={ensureUrl(portfolio.github)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {formatWebsiteLabel(portfolio.github)}
                    </a>
                  </p>
                ) : null}
                {portfolio.website ? (
                  <p>
                    <span className="font-medium text-zinc-950">Site:</span>{" "}
                    <a
                      href={ensureUrl(portfolio.website)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {formatWebsiteLabel(portfolio.website)}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {projects.length > 0 ? (
          <Section eyebrow="vitrine" title="Projetos em destaque">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={`${project}-${index}`}
                  className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Projeto {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-base leading-7 text-zinc-800">{project}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {skills.length > 0 ? (
          <Section eyebrow="especialidades" title="Habilidades">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </main>
  );
}
