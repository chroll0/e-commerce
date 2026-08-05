"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs, Input, Button } from "@/components";
import { api } from "@/lib/axios";

export const dynamic = "force-dynamic";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const navT = useTranslations("nav");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
    general?: string;
  }>({});

  const contacts = [
    { icon: Mail, title: t("email.title"), value: "support@yourstore.com" },
    { icon: Phone, title: t("phone.title"), value: "+995 555 12 34 56" },
    { icon: MapPin, title: t("location.title"), value: t("location.value") },
  ];

  const isEmailValid = (v: string) => /\S+@\S+\.\S+/.test(v);

  const isValid =
    name.trim().length > 0 &&
    isEmailValid(email) &&
    message.trim().length >= 10;

  const validate = () => {
    const next: typeof errors = {};

    if (!name.trim()) next.name = t("form.errors.nameRequired");
    if (!email.trim()) next.email = t("form.errors.emailRequired");
    else if (!isEmailValid(email)) next.email = t("form.errors.emailInvalid");
    if (message.trim().length < 10)
      next.message = t("form.errors.messageMin", { count: 10 });

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    // client-side validation
    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrors({});
    try {
      await api.post("/contact", { name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (err: any) {
      setStatus("error");

      const remote = err?.response?.data;
      // class-validator returns an array of messages by default
      if (remote?.message && Array.isArray(remote.message)) {
        const next: typeof errors = {};
        remote.message.forEach((m: string) => {
          const msg = String(m);
          const lower = msg.toLowerCase();
          if (lower.includes("name")) next.name = msg;
          else if (lower.includes("email")) next.email = msg;
          else if (lower.includes("message")) next.message = msg;
          else next.general = msg;
        });
        setErrors(next);
      } else if (remote?.message) {
        setErrors({ general: String(remote.message) });
      } else {
        setErrors({ general: t("form.error") });
      }
    }
  };

  return (
    <main className="mx-auto mt-12 w-full max-w-6xl px-4">
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("contact") },
        ]}
      />

      {/* HERO */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold">{t("hero.title")}</h1>
        <p className="mt-3 max-w-xl text-muted">{t("hero.description")}</p>
      </section>

      {/* GRID */}
      <section className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {contacts.map(({ icon: Icon, title, value }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30"
            >
              <div className="rounded-xl bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT FORM */}
        <div className="rounded-3xl border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold">{t("form.title")}</h2>
          <p className="mt-2 text-sm text-muted">{t("form.description")}</p>

          <div className="mt-6 space-y-4">
            <Input
              label={t("form.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={status === "loading"}
              error={errors.name}
            />
            <Input
              label={t("form.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              disabled={status === "loading"}
              error={errors.email}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">
                {t("form.message")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                className="h-32 w-full rounded-xl mt-1 border border-border bg-background p-3 outline-none focus:border-primary transition disabled:opacity-50"
                placeholder={t("form.message")}
              />
            </div>

            {/* Feedback */}
            {status === "success" && (
              <p className="text-sm text-green-500">{t("form.success")}</p>
            )}
            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isValid || status === "loading"}
            >
              {status === "loading" ? t("form.sending") : t("form.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* SUPPORT STRIP */}
      <section className="mt-16 rounded-3xl border border-border bg-linear-to-r from-primary/10 to-card p-8">
        <h3 className="text-xl font-semibold">{t("support.title")}</h3>
        <p className="mt-2 text-muted">{t("support.description")}</p>
      </section>
    </main>
  );
}
