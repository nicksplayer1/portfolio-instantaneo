"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyResumeName } from "@/lib/resume-utils";

async function generateUniqueSlug(name: string, currentResumeId: string) {
  const supabase = await createClient();
  const baseSlug = slugifyResumeName(name) || "curriculo";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("resumes")
      .select("id")
      .eq("slug", slug)
      .neq("id", currentResumeId)
      .maybeSingle();

    if (!data) return slug;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function updateResume(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  if (!id) {
    redirect("/dashboard?error=Currículo inválido.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const portfolio = String(formData.get("portfolio") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();

  if (!name) {
    redirect(`/edit/${id}?error=O nome completo é obrigatório.`);
  }

  const slug = await generateUniqueSlug(name, id);

  const { error } = await supabase
    .from("resumes")
    .update({
      slug,
      name,
      role,
      summary,
      phone,
      email,
      city,
      linkedin,
      portfolio,
      experience,
      education,
      skills,
      is_public: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    redirect(`/edit/${id}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/cv/${slug}`);
}
