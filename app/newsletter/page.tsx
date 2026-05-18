import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/newsletter-form";
import { branding } from "@/lib/config/branding";

export const metadata: Metadata = {
  title: `${branding.companyName} | Newsletter`,
  description: `Inscription à la newsletter ${branding.companyName}.`
};

type NewsletterPageProps = {
  searchParams: Promise<{
    src?: string | string[];
  }>;
};

export default async function NewsletterPage({ searchParams }: NewsletterPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawSource = resolvedSearchParams.src;
  const source = Array.isArray(rawSource) ? rawSource[0] : rawSource;

  return (
    <main className="safe-px safe-pt safe-pb mx-auto flex min-h-[100dvh] w-full max-w-2xl items-center justify-center sm:px-6 sm:py-12">
      <section className="w-full rounded-[1.125rem] border border-ink-100 bg-white p-[clamp(1rem,4.5vw,2rem)] shadow-soft sm:rounded-3xl">
        <div className="overflow-hidden rounded-xl sm:rounded-2xl">
          <Image
            src="/charlie-linkedin-banner.png"
            alt="Bannière Charlie"
            width={2200}
            height={550}
            sizes="(min-width: 640px) 42rem, calc(100vw - 2rem)"
            className="aspect-[4/1] h-auto min-h-[7rem] w-full object-cover"
            priority
          />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.08em] text-ink-500">Newsletter Charlie</p>
        <h1 className="mt-2 text-[clamp(1.45rem,5vw,2rem)] font-semibold italic leading-[1.15] text-ink-900">
          Recevez chaque semaine les idées IA concrètes pour conseillers financiers.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Pas de document à télécharger cette fois: vous vous inscrivez directement à la newsletter {branding.companyName}.
        </p>

        <NewsletterForm source={source} />
      </section>
    </main>
  );
}
