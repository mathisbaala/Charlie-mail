"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type LeadCaptureFormProps = {
  slug: string;
  redirectUrl: string;
};

type CaptureResponse = {
  ok: boolean;
  message?: string;
  redirectUrl?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LeadCaptureForm({ slug, redirectUrl }: LeadCaptureFormProps) {
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const source = searchParams.get("src") ?? undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedFirstName) {
      setErrorMessage("Veuillez renseigner votre prénom.");
      return;
    }

    if (!normalizedLastName) {
      setErrorMessage("Veuillez renseigner votre nom.");
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage("Veuillez renseigner votre email.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage("Email invalide.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: normalizedFirstName,
          last_name: normalizedLastName,
          email: normalizedEmail,
          slug,
          redirect_url: redirectUrl,
          source
        })
      });

      const payload: CaptureResponse = await response.json();

      if (!response.ok || !payload.ok || !payload.redirectUrl) {
        throw new Error(payload.message || "Impossible d'enregistrer vos informations.");
      }

      window.location.href = payload.redirectUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inattendue.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          id="first_name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          placeholder="Prénom"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
        />

        <input
          id="last_name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          placeholder="Nom"
          required
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
        />
      </div>

      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="vous@entreprise.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Chargement..." : "Accéder au document"}
      </button>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      <p className="text-xs text-ink-500">Accès immédiat après validation</p>
    </form>
  );
}
