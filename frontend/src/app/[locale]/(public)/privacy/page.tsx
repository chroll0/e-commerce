import { useTranslations } from "next-intl";
import { Shield, Eye, Share2, Lock, UserCheck, Mail, Info } from "lucide-react";

const icons = [Info, Eye, Shield, Share2, Lock, UserCheck, Mail];

const Page = () => {
  const t = useTranslations("privacy");

  const sections = [
    "intro",
    "collection",
    "usage",
    "sharing",
    "security",
    "rights",
    "contact",
  ] as const;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            {t("title")}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("lastUpdated")}</p>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-3xl space-y-8 px-4 py-16">
        {sections.map((key, i) => {
          const Icon = icons[i];
          return (
            <div
              key={key}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold">
                  {t(`sections.${key}.title`)}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`sections.${key}.text`)}
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Page;
