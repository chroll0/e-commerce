import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components";
import { ImageIcon, Images, Pencil, Trash2 } from "lucide-react";
import { StoreApi } from "@/types";
import Image from "next/image";

type StoresTableProps = {
  locale: string;
  loading: boolean;
  stores: StoreApi[];
  onRequestDelete: (payload: { id: number; name: string }) => void;
  labels: {
    name: string;
    slug: string;
    products: string;
    actions: string;
    loading: string;
    empty: string;
    edit: string;
    delete: string;
  };
};

const StoresTable: FC<StoresTableProps> = ({
  locale,
  loading,
  stores,
  onRequestDelete,
  labels,
}) => {
  return (
    <div className="mt-6 rounded-xl border border-border bg-card overflow-x-auto">
      <div className="grid grid-cols-12 items-center gap-2 px-4 py-3 border-b border-border text-xs font-medium text-muted-foreground">
        <div className="col-span-5 flex items-center px-1 gap-2">
          <Images className="h-4.5 w-4.5" />
          <span>{labels.name}</span>
        </div>
        <div className="col-span-3">{labels.slug}</div>
        <div className="col-span-1 text-center">{labels.products}</div>
        <div className="col-span-3 text-right">{labels.actions}</div>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {labels.loading}
        </div>
      ) : stores.length === 0 ? (
        <div className="px-4 py-8 text-sm text-muted-foreground">
          {labels.empty}
        </div>
      ) : (
        <div className="pb-1">
          {stores.map((store, idx) => (
            <div key={store.id}>
              {idx !== 0 && <div className="h-px bg-border-strong/70 mx-4" />}

              <div className="grid grid-cols-12 gap-2 px-4 py-1 hover:bg-muted/40 transition">
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  {store.logo ? (
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded">
                      <Image
                        src={store.logo}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded">
                      <ImageIcon className="h-4.5 w-4.5" />
                    </div>
                  )}

                  <span className="truncate text-sm font-medium text-foreground">
                    {store.name}
                  </span>
                </div>

                <div className="col-span-3 flex items-center text-sm text-muted-foreground truncate">
                  {store.slug}
                </div>

                <div className="col-span-1 flex items-center justify-center text-sm text-muted-foreground">
                  {store._count?.products ?? 0}
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Button asChild variant="secondary" size="xs">
                    <Link href={`/${locale}/admin/stores/${store.slug}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="tertiary"
                    size="xs"
                    className="text-destructive"
                    onClick={() =>
                      onRequestDelete({ id: store.id, name: store.name })
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
  );
};

export default StoresTable;
