export function slugifyInviteTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ensureUrl(value: string | null | undefined) {
  if (!value) return "";
  const trimmed = value.trim();

  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function formatDatePtBr(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(date);
}
