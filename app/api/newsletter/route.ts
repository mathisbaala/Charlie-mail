import { NextRequest, NextResponse } from "next/server";
import { branding } from "@/lib/config/branding";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const NEWSLETTER_SLUG = "newsletter";
const NEWSLETTER_SOURCE = "newsletter";

type NewsletterPayload = {
  email?: string;
  source?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getNewsletterRedirectUrl() {
  try {
    return new URL("/newsletter", branding.siteUrl).toString();
  } catch {
    return "https://charlie-mail.vercel.app/newsletter";
  }
}

export async function POST(request: NextRequest) {
  let body: NewsletterPayload;

  try {
    body = (await request.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Email invalide." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase n'est pas configuré." }, { status: 500 });
  }

  const { data: existingLead, error: existingLeadError } = await supabase
    .from("leads")
    .select("id")
    .eq("document_slug", NEWSLETTER_SLUG)
    .eq("email", email)
    .maybeSingle<{ id: string }>();

  if (existingLeadError) {
    console.error("Failed to check newsletter lead", existingLeadError);
    return NextResponse.json({ ok: false, message: "Impossible d'enregistrer cet email." }, { status: 500 });
  }

  if (existingLead) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const source = body.source?.trim() || NEWSLETTER_SOURCE;

  const { error: insertError } = await supabase.from("leads").insert({
    email,
    document_slug: NEWSLETTER_SLUG,
    redirect_url: getNewsletterRedirectUrl(),
    source
  });

  if (insertError) {
    console.error("Failed to insert newsletter lead", insertError);
    return NextResponse.json({ ok: false, message: "Impossible d'enregistrer cet email." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, alreadySubscribed: false });
}
