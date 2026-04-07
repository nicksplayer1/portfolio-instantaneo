type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ResumePublicPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 p-8">
        <h1 className="text-3xl font-bold text-zinc-900">Currículo público</h1>
        <p className="mt-3 text-zinc-600">Slug: {slug}</p>
      </div>
    </main>
  );
}