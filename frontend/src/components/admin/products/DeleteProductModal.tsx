"use client";

import { FC } from "react";
import { Button, Modal } from "@/components";

type Props = {
  isOpen: boolean;
  loading?: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteProductModal: FC<Props> = ({
  isOpen,
  loading = false,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">{description}</p>
    </Modal>
  );
};

export default DeleteProductModal;
