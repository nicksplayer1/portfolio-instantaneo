import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUrl, splitLines } from "@/lib/resume-utils";

type Props = {
  params: Promise<{ slug: string }>;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function ResumePublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (error || !resume) {
    notFound();
  }

  const experienceItems = splitLines(resume.experience);
  const educationItems = splitLines(resume.education);
  const skillsItems = splitLines(resume.skills);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Currículo online
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-zinc-950 sm:text-5xl">
                {resume.name}
              </h1>
              {resume.role ? (
                <p className="mt-4 text-xl text-zinc-700">{resume.role}</p>
              ) : null}
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Ir ao dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-4 text-zinc-700 sm:grid-cols-2">
            {resume.email ? <p><span className="font-medium text-zinc-900">Email:</span> {resume.email}</p> : null}
            {resume.phone ? <p><span className="font-medium text-zinc-900">Telefone:</span> {resume.phone}</p> : null}
            {resume.city ? <p><span className="font-medium text-zinc-900">Cidade:</span> {resume.city}</p> : null}
            {resume.linkedin ? (
              <p>
                <span className="font-medium text-zinc-900">LinkedIn:</span>{" "}
                <a href={ensureUrl(resume.linkedin)} target="_blank" className="underline">
                  {resume.linkedin}
                </a>
              </p>
            ) : null}
            {resume.portfolio ? (
              <p className="sm:col-span-2">
                <span className="font-medium text-zinc-900">Portfólio:</span>{" "}
                <a href={ensureUrl(resume.portfolio)} target="_blank" className="underline">
                  {resume.portfolio}
                </a>
              </p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-zinc-200 px-6 py-8 sm:px-10 sm:py-10">
          {resume.summary ? (
            <Section title="Resumo">
              <p className="whitespace-pre-wrap text-zinc-700">{resume.summary}</p>
            </Section>
          ) : null}

          {experienceItems.length > 0 ? (
            <Section title="Experiência">
              <div className="space-y-3">
                {experienceItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-zinc-50 px-4 py-4 text-zinc-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {educationItems.length > 0 ? (
            <Section title="Formação">
              <div className="space-y-3">
                {educationItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-zinc-50 px-4 py-4 text-zinc-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {skillsItems.length > 0 ? (
            <Section title="Habilidades">
              <div className="flex flex-wrap gap-3">
                {skillsItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
