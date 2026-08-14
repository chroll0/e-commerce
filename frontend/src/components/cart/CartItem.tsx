"use client";

import Image from "next/image";
import { ImageIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components";
import { CartItem as CartItemType } from "@/state/useCartStore";
import { useCartActions } from "@/state/useCartActions";
import { useState } from "react";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const { remove, update } = useCartActions();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await update(item.productId, item.variantId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await remove(item.productId, item.variantId);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-card-soft">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-primary">{item.name}</h3>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="text"
            iconOnly
            size="sm"
            disabled={isUpdating}
            loading={isUpdating}
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>

          <span className="min-w-8 text-center">{item.quantity}</span>

          <Button
            variant="text"
            iconOnly
            size="sm"
            disabled={isUpdating}
            loading={isUpdating}
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <span className="font-semibold text-primary">
          ₾{(item.price * item.quantity).toFixed(2)}
        </span>

        <Button
          variant="outline"
          iconOnly
          size="sm"
          disabled={isRemoving}
          loading={isRemoving}
          onClick={handleRemove}
        >
          <Trash2Icon className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
