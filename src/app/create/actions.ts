"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugifyInviteTitle } from "@/lib/invite-utils";

async function generateUniqueSlug(title: string) {
  const supabase = await createClient();
  const baseSlug = slugifyInviteTitle(title);
  let slug = baseSlug || "convite";

  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;

    const { data } = await supabase
      .from("invites")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  return `${slug}-${Date.now()}`;
}

export async function createInvite(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const host_name = String(formData.get("host_name") ?? "").trim();
  const event_type = String(formData.get("event_type") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const event_date = String(formData.get("event_date") ?? "").trim();
  const event_time = String(formData.get("event_time") ?? "").trim();
  const location_name = String(formData.get("location_name") ?? "").trim();
  const location_address = String(formData.get("location_address") ?? "").trim();
  const map_link = String(formData.get("map_link") ?? "").trim();
  const cover_image_url = String(formData.get("cover_image_url") ?? "").trim();
  const theme = String(formData.get("theme") ?? "").trim();
  const rsvp_link = String(formData.get("rsvp_link") ?? "").trim();
  const gift_link = String(formData.get("gift_link") ?? "").trim();
  const dress_code = String(formData.get("dress_code") ?? "").trim();
  const is_public = formData.get("is_public") === "on";

  if (!title) {
    redirect("/create?error=missing-title");
  }

  const slug = await generateUniqueSlug(title);

  const { error } = await supabase.from("invites").insert({
    user_id: user.id,
    slug,
    title,
    host_name: host_name || null,
    event_type: event_type || null,
    description: description || null,
    event_date: event_date || null,
    event_time: event_time || null,
    location_name: location_name || null,
    location_address: location_address || null,
    map_link: map_link || null,
    cover_image_url: cover_image_url || null,
    theme: theme || null,
    rsvp_link: rsvp_link || null,
    gift_link: gift_link || null,
    dress_code: dress_code || null,
    is_public,
  });

  if (error) {
    redirect("/create?error=create-failed");
  }

  revalidatePath("/dashboard");
  redirect(`/invite/${slug}`);
}
