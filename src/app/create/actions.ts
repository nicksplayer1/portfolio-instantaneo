"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "curriculo";
}

function makeSlugCandidates(baseSlug: string) {
  const randomA = Math.random().toString(36).slice(2, 6);
  const randomB = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36);

  return [
    baseSlug,
    `${baseSlug}-${randomA}`,
    `${baseSlug}-${stamp}`,
    `${baseSlug}-${randomB}`,
  ];
}

export async function createResume(formData: FormData) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const name = getString(formData.get("name"));
  const role = getString(formData.get("role"));
  const summary = getString(formData.get("summary"));
  const phone = getString(formData.get("phone"));
  const email = getString(formData.get("email")) || authData.user.email || "";
  const city = getString(formData.get("city"));
  const linkedin = getString(formData.get("linkedin"));
  const portfolio = getString(formData.get("portfolio"));
  const experience = getString(formData.get("experience"));
  const education = getString(formData.get("education"));
  const skills = getString(formData.get("skills"));

  if (!name) {
    redirect("/create?error=Informe%20o%20nome%20do%20curr%C3%ADculo.");
  }

  const baseSlug = slugify(name);
  const candidates = makeSlugCandidates(baseSlug);

  let lastErrorMessage = "N%C3%A3o%20foi%20poss%C3%ADvel%20criar%20o%20curr%C3%ADculo.";

  for (const slug of candidates) {
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: authData.user.id,
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
      })
      .select("slug")
      .single();

    if (!error && data?.slug) {
      redirect(`/cv/${data.slug}`);
    }

    if ((error as { code?: string } | null)?.code === "23505") {
      continue;
    }

    if (error?.message) {
      lastErrorMessage = encodeURIComponent(error.message);
    }

    break;
  }

  redirect(`/create?error=${lastErrorMessage}`);
}
