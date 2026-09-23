import { FC } from "react";

import Link from "next/link";

import { Button } from "@/components";

import { Pencil, Tag, Trash2 } from "lucide-react";

import type { ProductLabelApi } from "@/types";

type LabelsTableProps = {
  locale: string;
  loading: boolean;
  labels: ProductLabelApi[];
  onRequestDelete: (payload: { id: number; name: string }) => void;
  labelsText: {
    name: string;
    products: string;
    slug: string;
    actions: string;
    loading: string;
    empty: string;
    delete: string;
  };
};

const LabelsTable: FC<LabelsTableProps> = ({
  locale,
  loading,
  labels,
  onRequestDelete,
  labelsText,
}) => {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <div className="min-w-[560px]">
        <div className="grid grid-cols-12 items-center gap-2 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
          <div className="col-span-6 flex items-center gap-2 px-1">
            <Tag className="h-4.5 w-4.5" />
            <span>{labelsText.name}</span>
          </div>

          <div className="col-span-2 text-center">{labelsText.products}</div>

          <div className="col-span-2">{labelsText.slug}</div>

          <div className="col-span-2 text-right">{labelsText.actions}</div>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-muted-foreground">
            {labelsText.loading}
          </div>
        ) : labels.length === 0 ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">
            {labelsText.empty}
          </div>
        ) : (
          <div className="pb-1">
            {labels.map((label, idx) => (
              <div key={label.id}>
                {idx !== 0 && <div className="mx-4 h-px bg-border-strong/70" />}

                <div className="grid grid-cols-12 gap-2 px-4 py-2 transition hover:bg-muted/40">
                  <div className="col-span-6 flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {locale === "ka" ? label.nameKa : label.nameEn}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center justify-center text-sm text-muted-foreground">
                    {label.productCount}
                  </div>

                  <div className="col-span-2 flex items-center truncate text-sm text-muted-foreground">
                    {label.slug}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Button asChild variant="secondary" size="xs">
                      <Link href={`/${locale}/admin/labels/${label.slug}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="tertiary"
                      size="xs"
                      className="text-destructive"
                      onClick={() =>
                        onRequestDelete({
                          id: label.id,
                          name: locale === "ka" ? label.nameKa : label.nameEn,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelsTable;
