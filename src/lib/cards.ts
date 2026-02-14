import { supabase } from "./supabase";

export interface CardPayload {
  to: string;
  from: string;
  message: string;
  photos: string[];
}

const TABLE = "cards";

/**
 * Save card to Supabase so the share link works for anyone.
 * No-op if Supabase is not configured.
 */
export async function saveCard(id: string, data: CardPayload): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Not configured" };
  const { error } = await supabase.from(TABLE).upsert({ id, data }, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Load card by id from Supabase. Returns null if not found or not configured.
 */
export async function getCard(id: string): Promise<CardPayload | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from(TABLE).select("data").eq("id", id).single();
  if (error || !data?.data) return null;
  const payload = data.data as CardPayload;
  return {
    to: payload.to ?? "",
    from: payload.from ?? "",
    message: payload.message ?? "",
    photos: Array.isArray(payload.photos) ? payload.photos : [],
  };
}
