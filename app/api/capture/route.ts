import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type CapturePayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  job_title?: string;
  slug?: string;
  redirect_url?: string;
  source?: string;
};

type DocumentRow = {
  slug: string;
  redirect_url: string;
};

export async function POST(request: NextRequest) {
  let body: CapturePayload;

  try {
    body = (await request.json()) as CapturePayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const firstName = body.first_name?.trim();
  const lastName = body.last_name?.trim();
  const email = body.email?.trim().toLowerCase();
  const jobTitle = body.job_title?.trim();
  const slug = body.slug?.trim().toLowerCase();
  const clientRedirectUrl = body.redirect_url?.trim();

  if (!firstName) {
    return NextResponse.json({ ok: false, message: "Prénom invalide." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Email invalide." }, { status: 400 });
  }

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, message: "Slug invalide." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase n'est pas configuré." }, { status: 500 });
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("slug, redirect_url")
    .eq("slug", slug)
    .maybeSingle<DocumentRow>();

  if (documentError || !document) {
    return NextResponse.json({ ok: false, message: "Document introuvable." }, { status: 404 });
  }

  if (!clientRedirectUrl || clientRedirectUrl !== document.redirect_url) {
    return NextResponse.json({ ok: false, message: "URL de redirection invalide." }, { status: 400 });
  }

  const source = body.source?.trim() || null;

  const { error: insertError } = await supabase.from("leads").insert({
    first_name: firstName,
    last_name: lastName || null,
    email,
    job_title: jobTitle || null,
    document_slug: document.slug,
    redirect_url: document.redirect_url,
    source
  });

  if (insertError) {
    console.error("Failed to insert lead", insertError);
    return NextResponse.json({ ok: false, message: "Impossible d'enregistrer vos informations." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, redirectUrl: document.redirect_url });
}
