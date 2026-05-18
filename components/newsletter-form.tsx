"use client";

import { useState } from "react";

type NewsletterResponse = {
  ok: boolean;
  alreadySubscribed?: boolean;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type NewsletterFormProps = {
  source?: string;
};

export function NewsletterForm({ source }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Veuillez renseigner votre email.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage("Email invalide.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          source
        })
      });

      const payload: NewsletterResponse = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Impossible d'enregistrer votre inscription.");
      }

      setSuccessMessage(
        payload.alreadySubscribed
          ? "Vous êtes déjà inscrit à la newsletter Charlie."
          : "Inscription validée. Bienvenue dans la newsletter Charlie."
      );
      setEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inattendue.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-3.5 sm:space-y-4" onSubmit={handleSubmit} noValidate>
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
        className="min-h-12 w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 text-[16px] leading-6 text-ink-900 outline-none transition placeholder:text-ink-500/80 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 w-full rounded-xl bg-accent-500 px-4 py-3 text-[16px] font-semibold leading-6 text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Chargement..." : "S'inscrire à la newsletter"}
      </button>

      {errorMessage ? <p className="text-sm leading-relaxed text-red-600">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm leading-relaxed text-emerald-700">{successMessage}</p> : null}

      <p className="text-xs leading-relaxed text-ink-500">Un email utile, sans spam.</p>
    </form>
  );
}
