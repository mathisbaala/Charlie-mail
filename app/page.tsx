import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6 py-12">
      <section className="w-full rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-ink-900">Charlie Email Capture</h1>
        <p className="mt-4 text-sm text-ink-500">
          Use dynamic slug URLs like <code className="rounded bg-ink-100 px-1 py-0.5">/facebook</code>.
        </p>
        <div className="mt-6">
          <Link
            href="/facebook?src=linkedin"
            className="inline-flex items-center rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Open sample
          </Link>
        </div>
      </section>
    </main>
  );
}
