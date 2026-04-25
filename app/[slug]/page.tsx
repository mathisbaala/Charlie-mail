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
      linkedinUrl: "https://www.linkedin.com/in/mathis-baala",
      role: "Co-founder @CHARLIE"
    },
    {
      name: "Thomas Higadere",
      photoUrl: branding.ownerPhotoUrl,
      linkedinUrl: "https://www.linkedin.com/in/thomas-higadere",
      role: "Co-founder @CHARLIE"
    }
  ] as const;

  const charlieLinks = [
    { label: "Home", href: "https://www.charliefinancialadvisor.com" },
    { label: "About", href: "https://www.charliefinancialadvisor.com/about" },
    { label: "Articles", href: "https://www.charliefinancialadvisor.com/articles" },
    { label: "Contact", href: "https://www.charliefinancialadvisor.com/contact" }
  ] as const;

  return (
    <main className="safe-px safe-pt safe-pb min-h-[100dvh] w-full sm:px-6 sm:py-8 lg:py-10 xl:py-12">
      <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,50rem)] lg:items-stretch lg:justify-center lg:gap-8 xl:grid-cols-[minmax(17rem,20rem)_minmax(0,56rem)]">
        <aside className="order-last flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-ink-100 bg-ink-50/70 p-3.5 sm:gap-4 sm:p-5 lg:order-none lg:gap-5">
          <div className="flex flex-col gap-3">
            {coFounders.map((founder) => (
              <article key={founder.name} className="rounded-xl border border-ink-100 bg-white p-3.5">
                <div className="flex items-center gap-3">
                  <Image
                    src={founder.photoUrl}
                    alt={founder.name}
                    width={56}
                    height={56}
                    className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.925rem] font-semibold leading-snug text-ink-900">{founder.name}</p>
                    <p className="text-xs text-ink-500">{founder.role}</p>
                  </div>
                </div>
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-300"
                  aria-label={`Voir le profil LinkedIn de ${founder.name}`}
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 fill-current">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.473 0 16 .513 16 1.146v13.708c0 .633-.527 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401ZM3.743 5.18c.837 0 1.358-.554 1.358-1.248-.016-.709-.52-1.248-1.341-1.248-.822 0-1.358.54-1.358 1.248 0 .694.52 1.248 1.325 1.248h.016Zm9.715 8.214v-4.03c0-2.16-1.151-3.164-2.686-3.164-1.237 0-1.79.68-2.099 1.156v.024H8.66a2.1 2.1 0 0 1 .013-.024V6.169H6.272c.031.785 0 7.225 0 7.225h2.401V9.359c0-.216.016-.432.08-.586.175-.432.575-.88 1.247-.88.88 0 1.232.664 1.232 1.634v3.867h2.226Z" />
                  </svg>
                  LinkedIn
                </a>
              </article>
            ))}
          </div>

          <div className="flex flex-col rounded-xl border border-ink-100 bg-white p-3.5 lg:flex-1">
            <a
              href="https://www.charliefinancialadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-2.5"
              aria-label={`Aller sur le site ${branding.companyName}`}
            >
              <Image
                src={branding.companyLogoUrl}
                alt={`Logo ${branding.companyName}`}
                width={36}
                height={36}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="min-w-0 truncate text-[0.875rem] font-semibold text-ink-700">{branding.companyName}</span>
            </a>

            <nav className="mt-3 flex flex-col gap-2 lg:flex-1 lg:justify-evenly">
              {charlieLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-ink-700 transition hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="order-first min-w-0 lg:order-none lg:py-3">
          <section className="flex min-h-full flex-col justify-start gap-4 sm:gap-5 md:gap-6 lg:justify-between lg:gap-8">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src="/charlie-linkedin-banner.png"
                alt="Bannière Charlie"
                width={2200}
                height={550}
                sizes="(min-width: 1280px) 56rem, (min-width: 1024px) 50rem, calc(100vw - 2rem)"
                className="aspect-[4/1] h-auto min-h-[7rem] w-full object-cover sm:min-h-[9rem] lg:min-h-[10rem]"
                priority
              />
            </div>

            <h1 className="mx-auto w-full max-w-[48rem] text-center text-[clamp(1.35rem,5vw,2rem)] font-semibold italic leading-[1.16] text-ink-900 sm:text-[clamp(1.5rem,3.2vw,2.15rem)]">
              Téléchargez les playbooks IA que les meilleurs conseillers utilisent déjà.
            </h1>

            <div className="mx-auto w-full max-w-[44rem]">
              <p className="text-xs uppercase tracking-[0.08em] text-ink-500">Questionnaire d'accès</p>
              <LeadCaptureForm slug={document.slug} compact />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
