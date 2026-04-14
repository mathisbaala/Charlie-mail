import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type DocumentItem = {
  slug: string;
  name: string;
  redirect_url: string;
};

export async function getDocumentBySlug(slug: string): Promise<DocumentItem | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("documents")
    .select("slug, name, redirect_url")
    .eq("slug", slug)
    .maybeSingle<DocumentItem>();

  if (error || !data) return null;
  return data;
}
