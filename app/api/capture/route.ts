import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type CapturePayload = {
  email?: string;
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
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const slug = body.slug?.trim().toLowerCase();
  const clientRedirectUrl = body.redirect_url?.trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
  }

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, message: "Invalid slug." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase is not configured." }, { status: 500 });
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("slug, redirect_url")
    .eq("slug", slug)
    .maybeSingle<DocumentRow>();

  if (documentError || !document) {
    return NextResponse.json({ ok: false, message: "Document not found." }, { status: 404 });
  }

  if (!clientRedirectUrl || clientRedirectUrl !== document.redirect_url) {
    return NextResponse.json({ ok: false, message: "Invalid redirect URL." }, { status: 400 });
  }

  const source = body.source?.trim() || null;

  const { error: insertError } = await supabase.from("leads").insert({
    email,
    document_slug: document.slug,
    redirect_url: document.redirect_url,
    source
  });

  if (insertError) {
    console.error("Failed to insert lead", insertError);
    return NextResponse.json({ ok: false, message: "Could not save your email." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, redirectUrl: document.redirect_url });
}
