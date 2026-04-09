"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyInviteTitle } from "@/lib/invite-utils";

async function generateUniqueDuplicateSlug(title: string) {
  const supabase = await createClient();
  const baseSlug = slugifyInviteTitle(title || "convite");
  const slug = baseSlug || "convite";

  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? `${slug}-copia` : `${slug}-copia-${i + 1}`;

    const { data } = await supabase
      .from("invites")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  return `${slug}-copia-${Date.now()}`;
}

export async function deleteInvite(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !id) return;

  await supabase.from("invites").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function duplicateInvite(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !id) return;

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invite) return;

  const slug = await generateUniqueDuplicateSlug(invite.title);

  const { error } = await supabase.from("invites").insert({
    user_id: user.id,
    slug,
    title: `${invite.title} (cópia)`,
    host_name: invite.host_name,
    event_type: invite.event_type,
    description: invite.description,
    event_date: invite.event_date,
    event_time: invite.event_time,
    location_name: invite.location_name,
    location_address: invite.location_address,
    map_link: invite.map_link,
    cover_image_url: invite.cover_image_url,
    theme: invite.theme,
    rsvp_link: invite.rsvp_link,
    gift_link: invite.gift_link,
    dress_code: invite.dress_code,
    is_public: invite.is_public,
  });

  if (!error) {
    revalidatePath("/dashboard");
    redirect("/dashboard?success=duplicated");
  }
}
