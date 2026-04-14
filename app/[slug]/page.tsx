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
        <h1 className="text-2xl font-semibold text-ink-900">Document not found</h1>
        <p className="mt-3 text-sm text-ink-500">{message}</p>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug);

  return {
    title: document ? `${document.name} | ${branding.companyName}` : "Document not found",
    description: "Enter your email to access the document."
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return <ErrorState message="Invalid slug." />;
  }

  const document = await getDocumentBySlug(slug);

  if (!document) {
    return <ErrorState message="This document is not available." />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-6 py-12">
      <section className="w-full rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-3">
          <Image
            src={branding.companyLogoUrl}
            alt={`${branding.companyName} logo`}
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="text-sm font-semibold text-ink-700">{branding.companyName}</span>
        </div>

        <div className="mt-7 flex items-center gap-3">
          <Image
            src={branding.ownerPhotoUrl}
            alt={branding.ownerName}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
          <p className="text-base font-semibold text-ink-900">{branding.ownerName}</p>
        </div>

        <h1 className="mt-7 text-2xl font-semibold text-ink-900">Enter your email to access the document</h1>
        <p className="mt-2 text-sm text-ink-500">{document.name}</p>

        <LeadCaptureForm slug={document.slug} redirectUrl={document.redirect_url} />
      </section>
    </main>
  );
}
