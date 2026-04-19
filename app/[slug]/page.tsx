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
    <main className="safe-px safe-pt safe-pb mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center sm:px-6 sm:py-12">
      <section className="w-full rounded-[1.125rem] border border-ink-100 bg-white p-[clamp(1rem,4.5vw,2rem)] text-center shadow-soft sm:rounded-3xl">
        <h1 className="text-[clamp(1.25rem,6vw,1.5rem)] font-semibold leading-tight text-ink-900">Document introuvable</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">{message}</p>
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
    <main className="safe-px safe-pt safe-pb mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center sm:px-6 sm:py-12">
      <section className="w-full rounded-[1.125rem] border border-ink-100 bg-white p-[clamp(1rem,4.5vw,2rem)] shadow-soft sm:rounded-3xl">
        <a
          href="https://www.charliefinancialadvisor.com"
          className="inline-flex items-center gap-2.5 sm:gap-3"
          aria-label={`Aller sur le site ${branding.companyName}`}
        >
          <Image
            src={branding.companyLogoUrl}
            alt={`Logo ${branding.companyName}`}
            width={36}
            height={36}
            className="h-8 w-8 rounded-lg object-cover sm:h-9 sm:w-9"
          />
          <span className="text-[0.875rem] font-semibold text-ink-700">{branding.companyName}</span>
        </a>

        <div className="mt-[clamp(1rem,4vw,1.75rem)] grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coFounders.map((founder) => (
            <a
              key={founder.name}
              href={founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-20 items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/40 p-3 transition hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-300"
              aria-label={`Voir le profil LinkedIn de ${founder.name}`}
            >
              <Image
                src={founder.photoUrl}
                alt={founder.name}
                width={56}
                height={56}
                className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
              />
              <div className="min-w-0">
                <p className="text-[0.925rem] font-semibold leading-snug text-ink-900">{founder.name}</p>
                <p className="text-xs text-ink-500">Co-founder @CHARLIE</p>
              </div>
            </a>
          ))}
        </div>

        <h1 className="mt-[clamp(1rem,4vw,1.75rem)] max-w-[28ch] text-[clamp(1.25rem,6.5vw,1.5rem)] font-semibold leading-tight text-ink-900 sm:text-2xl">
          Entrez votre adresse e-mail pour recevoir le document
        </h1>
        <p className="mt-2 break-words text-sm leading-relaxed text-ink-500">{document.name}</p>

        <LeadCaptureForm slug={document.slug} redirectUrl={document.redirect_url} />
      </section>
    </main>
  );
}
