import Link from "next/link";

export default function HomePage() {
  return (
    <main className="safe-px safe-pt safe-pb mx-auto flex min-h-[100dvh] w-full max-w-2xl items-center justify-center sm:px-6 sm:py-12">
      <section className="w-full rounded-[1.125rem] border border-ink-100 bg-white p-[clamp(1rem,4.5vw,2rem)] shadow-soft sm:rounded-3xl">
        <h1 className="text-[clamp(1.5rem,7.2vw,1.875rem)] font-semibold leading-tight text-ink-900">Capture Email Charlie</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:mt-4">
          Utilisez des URLs dynamiques comme <code className="rounded bg-ink-100 px-1 py-0.5">/facebook</code>.
        </p>
        <div className="mt-6">
          <Link
            href="/facebook?src=linkedin"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent-500 px-4 py-2.5 text-[16px] font-semibold text-white transition hover:bg-accent-600 sm:w-auto sm:text-sm"
          >
            Ouvrir un exemple
          </Link>
        </div>
      </section>
    </main>
  );
}
