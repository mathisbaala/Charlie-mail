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

const OTHER_JOB_VALUE = "Autre";

const FINANCIAL_ADVISORY_JOB_FAMILIES = [
  {
    label: "Banque",
    jobs: ["Banquier privé", "Conseiller en financement"]
  },
  {
    label: "Assurance",
    jobs: ["Courtier en assurance", "Assureur", "Mutualiste", "Conseiller en protection sociale"]
  },
  {
    label: "Gestion",
    jobs: [
      "Conseiller en gestion de patrimoine",
      "Family office",
      "Gérant de fonds",
      "Conseiller en investissements financiers (CIF)",
      "Gestionnaire de portefeuille",
      "Conseiller en gestion de fortune",
      "Conseiller retraite et prévoyance"
    ]
  }
] as const;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LeadCaptureForm({ slug, redirectUrl }: LeadCaptureFormProps) {
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const source = searchParams.get("src") ?? undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedJobTitle = jobTitle.trim();
    const normalizedCustomJobTitle = customJobTitle.trim();
    const resolvedJobTitle =
      normalizedJobTitle === OTHER_JOB_VALUE ? normalizedCustomJobTitle : normalizedJobTitle;

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

    if (!normalizedJobTitle) {
      setErrorMessage("Veuillez sélectionner votre métier.");
      return;
    }

    if (normalizedJobTitle === OTHER_JOB_VALUE && !normalizedCustomJobTitle) {
      setErrorMessage("Veuillez préciser votre métier.");
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
          job_title: resolvedJobTitle,
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

      <select
        id="job_title"
        name="job_title"
        required
        value={jobTitle}
        onChange={(event) => {
          const selectedJob = event.target.value;
          setJobTitle(selectedJob);

          if (selectedJob !== OTHER_JOB_VALUE) {
            setCustomJobTitle("");
          }
        }}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
      >
        <option value="">Sélectionnez votre métier</option>
        {FINANCIAL_ADVISORY_JOB_FAMILIES.map((family) => (
          <optgroup key={family.label} label={family.label}>
            {family.jobs.map((jobOption) => (
              <option key={jobOption} value={jobOption}>
                {jobOption}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={OTHER_JOB_VALUE}>{OTHER_JOB_VALUE}</option>
      </select>

      {jobTitle === OTHER_JOB_VALUE ? (
        <input
          id="job_title_other"
          name="job_title_other"
          type="text"
          placeholder="Précisez votre métier"
          required
          value={customJobTitle}
          onChange={(event) => setCustomJobTitle(event.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
        />
      ) : null}

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
