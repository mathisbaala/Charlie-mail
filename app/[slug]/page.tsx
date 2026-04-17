import type { Metadata } from "next";
import Image from "next/image";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { branding } from "@/lib/config/branding";
import { getDocumentBySlug } from "@/lib/documents";

export const dynamic = "force-dynamic";

type SlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function ErrorState({ message }: { message: string }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-6 py-12">
      <section className="w-full rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-ink-900">Document introuvable</h1>
        <p className="mt-3 text-sm text-ink-500">{message}</p>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug);

  return {
    title: document ? `${branding.companyName} | ${document.name}` : `${branding.companyName} | Document introuvable`,
    description: "Renseignez votre email pour accéder au document."
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return <ErrorState message="Slug invalide." />;
  }

  const document = await getDocumentBySlug(slug);

  if (!document) {
    return <ErrorState message="Ce document n'est pas disponible." />;
  }

  const coFounders = [
    {
      name: "Mathis Baala",
      photoUrl: "/mathis-baala.jpeg",
      linkedinUrl: "https://www.linkedin.com/in/mathis-baala"
    },
    {
      name: "Thomas Higadere",
      photoUrl: branding.ownerPhotoUrl,
      linkedinUrl: "https://www.linkedin.com/in/thomas-higadere"
    }
  ] as const;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-6 py-12">
      <section className="w-full rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
        <a
          href="https://www.charliefinancialadvisor.com"
          className="inline-flex items-center gap-3"
          aria-label={`Aller sur le site ${branding.companyName}`}
        >
          <Image
            src={branding.companyLogoUrl}
            alt={`Logo ${branding.companyName}`}
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="text-sm font-semibold text-ink-700">{branding.companyName}</span>
        </a>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {coFounders.map((founder) => (
            <a
              key={founder.name}
              href={founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/40 p-3 transition hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-300"
              aria-label={`Voir le profil LinkedIn de ${founder.name}`}
            >
              <Image
                src={founder.photoUrl}
                alt={founder.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-ink-900">{founder.name}</p>
                <p className="text-xs text-ink-500">Co-founder @CHARLIE</p>
              </div>
            </a>
          ))}
        </div>

        <h1 className="mt-7 text-2xl font-semibold text-ink-900">Entrez votre adresse e-mail pour recevoir le document</h1>
        <p className="mt-2 text-sm text-ink-500">{document.name}</p>

        <LeadCaptureForm slug={document.slug} redirectUrl={document.redirect_url} />
      </section>
    </main>
  );
}
