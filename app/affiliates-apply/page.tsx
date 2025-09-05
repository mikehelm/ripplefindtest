"use client";

import { useMemo, useState } from "react";

export default function AffiliatesApplyPage() {
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    website: "",
    socials: "",
    audienceSize: "",
    primaryChannels: "",
    geography: "",
    niche: "",
    audienceDemographics: "",
    pastCampaigns: "",
    exampleLinks: "",
    averageMetrics: "",
    proposal: "",
    complianceNotes: "",
    payoutPreference: "",
    otherNotes: "",
  });
  const [copied, setCopied] = useState<"idle" | "ok" | "err">("idle");

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const requiredOk = useMemo(() => {
    return form.fullName && form.email && form.proposal;
  }, [form.fullName, form.email, form.proposal]);

  const emailSubject = useMemo(() => {
    const base = `Affiliate/Influencer Application – ${form.fullName || "Your Name"}`;
    return encodeURIComponent(base);
  }, [form.fullName]);

  const emailBody = useMemo(() => {
    const lines = [
      `Full name: ${form.fullName}`,
      `Company/Brand: ${form.company}`,
      `Email: ${form.email}`,
      `Website: ${form.website}`,
      `Socials (handles/URLs): ${form.socials}`,
      `Audience size (est.): ${form.audienceSize}`,
      `Primary channels: ${form.primaryChannels}`,
      `Geography: ${form.geography}`,
      `Niche/vertical: ${form.niche}`,
      `Audience demographics: ${form.audienceDemographics}`,
      `Past campaigns (brands, brief outcomes): ${form.pastCampaigns}`,
      `Example links: ${form.exampleLinks}`,
      `Average campaign metrics (CTR, CVR, views, etc.): ${form.averageMetrics}`,
      `Your proposal (how you’d promote Founder Matching; timeline, deliverables):\n${form.proposal}`,
      `Compliance, disclosures, and restrictions: ${form.complianceNotes}`,
      `Payout preference (e.g., rev share, CPA, flat fee + upside): ${form.payoutPreference}`,
      `Other notes: ${form.otherNotes}`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }, [form]);

  const mailtoHref = useMemo(() => {
    return `mailto:marketing@foundermatching.com?subject=${emailSubject}&body=${emailBody}`;
  }, [emailSubject, emailBody]);

  const copyAll = async () => {
    try {
      const text = decodeURIComponent(emailBody);
      await navigator.clipboard.writeText(text);
      setCopied("ok");
      setTimeout(() => setCopied("idle"), 2000);
    } catch (e) {
      setCopied("err");
      setTimeout(() => setCopied("idle"), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Affiliate / Influencer Application</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Tell us about your audience and how you’d partner with <span className="font-semibold">Founder Matching</span>.
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 space-y-5">
          <Section title="Contact & Profile">
            <Input label="Full name" required value={form.fullName} onChange={onChange("fullName")} placeholder="Jane Doe" />
            <Input label="Company/Brand" value={form.company} onChange={onChange("company")} placeholder="Doe Media LLC" />
            <Input type="email" label="Email" required value={form.email} onChange={onChange("email")} placeholder="jane@example.com" />
            <Input label="Website" value={form.website} onChange={onChange("website")} placeholder="https://yourdomain.com" />
            <TextArea label="Socials (handles/URLs)" value={form.socials} onChange={onChange("socials")} placeholder="@you on X, instagram.com/you, youtube.com/@you" />
          </Section>

          <Section title="Audience & Reach">
            <Input label="Audience size (est.)" value={form.audienceSize} onChange={onChange("audienceSize")} placeholder="e.g., 120k across YouTube + IG" />
            <Input label="Primary channels" value={form.primaryChannels} onChange={onChange("primaryChannels")} placeholder="YouTube, Instagram, LinkedIn, Newsletter" />
            <Input label="Geography" value={form.geography} onChange={onChange("geography")} placeholder="Global, 60% US, 20% EU…" />
            <Input label="Niche/vertical" value={form.niche} onChange={onChange("niche")} placeholder="Startups, indie hackers, SWE, design" />
            <TextArea label="Audience demographics" value={form.audienceDemographics} onChange={onChange("audienceDemographics")} placeholder="Age ranges, roles, languages, device split…" />
          </Section>

          <Section title="Work Examples & Performance">
            <TextArea label="Past campaigns (brands, brief outcomes)" value={form.pastCampaigns} onChange={onChange("pastCampaigns")} placeholder="Brand A (3-part video, 2.1M views); Brand B (newsletter, 7% CTR)…" />
            <TextArea label="Example links" value={form.exampleLinks} onChange={onChange("exampleLinks")} placeholder="Links to posts/videos/landing pages" />
            <TextArea label="Average campaign metrics (CTR, CVR, views, etc.)" value={form.averageMetrics} onChange={onChange("averageMetrics")} placeholder="YouTube avg view duration, newsletter open/click rates, landing CVR…" />
          </Section>

          <Section title="Your Proposal">
            <TextArea required label="How you’d promote Founder Matching (timeline, deliverables)" value={form.proposal} onChange={onChange("proposal")} placeholder="Outline the concept, deliverables, timeline, targeting, and success criteria." />
            <TextArea label="Compliance, disclosures, restrictions" value={form.complianceNotes} onChange={onChange("complianceNotes")} placeholder="Regional restrictions, sponsored disclosure process, privacy/brand safety notes…" />
            <Input label="Payout preference" value={form.payoutPreference} onChange={onChange("payoutPreference")} placeholder="Rev share, CPA, flat fee + upside, or suggestions" />
            <TextArea label="Other notes" value={form.otherNotes} onChange={onChange("otherNotes")} placeholder="Anything else we should know" />
          </Section>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              We’ll review and get back to you. By applying, you consent to be contacted about this program.
            </div>
            <div className="flex gap-2">
              <a
                href={mailtoHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${requiredOk ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
                aria-disabled={!requiredOk}
              >
                Send Email
              </a>
              <button
                onClick={copyAll}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {copied === "ok" ? "Copied" : copied === "err" ? "Copy failed" : "Copy Details"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          Prefer to email directly? Send your details to {" "}
          <a className="underline" href="mailto:marketing@foundermatching.com">marketing@foundermatching.com</a>.
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-3">{children}</div>
    </section>
  );
}

function Input({ label, required, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        {...rest}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
      />
    </label>
  );
}

function TextArea({ label, required, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <textarea
        {...rest}
        rows={rest.rows ?? 4}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
      />
    </label>
  );
}
