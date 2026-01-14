"use client";

import { FC } from "react";

type Locale = "en" | "ka";

type Props = {
  value: Locale;
  onChange: (next: Locale) => void;
};

const LanguageTabs: FC<Props> = ({ value, onChange }) => {
  const base =
    "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border transition-colors";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={[
          base,
          value === "en"
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
        ].join(" ")}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onChange("ka")}
        className={[
          base,
          value === "ka"
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
        ].join(" ")}
      >
        KA
      </button>
    </div>
  );
};

export default LanguageTabs;
