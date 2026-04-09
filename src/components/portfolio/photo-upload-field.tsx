"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/portfolio-utils";

type Props = {
  name: string;
  userName?: string;
  initialUrl?: string | null;
  bucket?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function PhotoUploadField({
  name,
  userName,
  initialUrl,
  bucket = "portfolio-images",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialUrl ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Escolha um arquivo de imagem.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    startTransition(async () => {
      setMessage("Enviando foto...");

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Faça login novamente para enviar a foto.");
        return;
      }

      const safeName = file.name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "-")
        .toLowerCase();

      const path = `${user.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setMessage("Não foi possível enviar a foto.");
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setValue(data.publicUrl);
      setMessage("Foto enviada com sucesso.");
      event.target.value = "";
    });
  }

  function clearPhoto() {
    setValue("");
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[24px] border border-zinc-200 bg-white">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={userName ? `Foto de ${userName}` : "Foto do portfólio"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white text-xl font-semibold text-zinc-400">
              {getInitials(userName)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-900">Foto do portfólio</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Envie uma imagem quadrada ou retangular. PNG, JPG e WEBP funcionam bem.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openPicker}
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Enviando..." : value ? "Trocar foto" : "Enviar foto"}
            </button>

            {value ? (
              <button
                type="button"
                onClick={clearPhoto}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                Remover
              </button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-zinc-800">
              ou cole uma URL pronta
            </label>
            <input
              type="url"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="https://seusite.com/foto.jpg"
              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
            />
          </div>

          {message ? (
            <p className="mt-3 text-sm text-zinc-600">{message}</p>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">
              Dica: imagens de até 5 MB costumam subir mais rápido.
            </p>
          )}
        </div>
      </div>

      <input type="hidden" name={name} value={value} readOnly />
    </div>
  );
}
