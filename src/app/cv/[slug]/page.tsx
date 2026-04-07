import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Resume = {
  name: string;
  role: string | null;
  summary: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  linkedin: string | null;
  portfolio: string | null;
  experience: string | null;
  education: string | null;
  skills: string | null;
};

function lines(text: string | null) {
  if (!text) return [];
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function externalHref(value: string | null) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export default async function ResumePublicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("name, role, summary, phone, email, city, linkedin, portfolio, experience, education, skills")
    .eq("slug", slug)
    .eq("is_public", true)
    .single<Resume>();

  if (error || !data) {
    notFound();
  }

  const experienceLines = lines(data.experience);
  const educationLines = lines(data.education);
  const skillLines = lines(data.skills);
  const linkedinHref = externalHref(data.linkedin);
  const portfolioHref = externalHref(data.portfolio);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Currículo online
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                {data.name}
              </h1>
              {data.role ? <p className="mt-3 text-lg text-zinc-600">{data.role}</p> : null}
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Ir ao dashboard
            </Link>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
            {data.email ? <p><span className="font-medium text-zinc-900">Email:</span> {data.email}</p> : null}
            {data.phone ? <p><span className="font-medium text-zinc-900">Telefone:</span> {data.phone}</p> : null}
            {data.city ? <p><span className="font-medium text-zinc-900">Cidade:</span> {data.city}</p> : null}
            {linkedinHref ? (
              <p>
                <span className="font-medium text-zinc-900">LinkedIn:</span>{" "}
                <a className="underline" href={linkedinHref} target="_blank" rel="noreferrer">
                  {data.linkedin}
                </a>
              </p>
            ) : null}
            {portfolioHref ? (
              <p className="sm:col-span-2">
                <span className="font-medium text-zinc-900">Portfólio:</span>{" "}
                <a className="underline" href={portfolioHref} target="_blank" rel="noreferrer">
                  {data.portfolio}
                </a>
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-8 px-6 py-8 sm:px-10">
          {data.summary ? (
            <section>
              <h2 className="text-xl font-semibold text-zinc-900">Resumo</h2>
              <p className="mt-3 whitespace-pre-line text-zinc-700">{data.summary}</p>
            </section>
          ) : null}

          {experienceLines.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-zinc-900">Experiência</h2>
              <ul className="mt-3 space-y-2 text-zinc-700">
                {experienceLines.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-2xl bg-zinc-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {educationLines.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-zinc-900">Formação</h2>
              <ul className="mt-3 space-y-2 text-zinc-700">
                {educationLines.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-2xl bg-zinc-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {skillLines.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-zinc-900">Habilidades</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skillLines.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full bg-zinc-900 px-3 py-2 text-sm text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
