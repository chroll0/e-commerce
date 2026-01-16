"use client";

import { FC, ReactNode } from "react";
import { Button, Modal } from "@/components";

type Props = {
  isOpen: boolean;
  loading?: boolean;

  title: string;
  description: ReactNode;

  cancelLabel: string;
  confirmLabel: string;

  onClose: () => void;
  onConfirm: () => void;

  size?: "sm" | "md" | "lg";
};

const ConfirmModal: FC<Props> = ({
  isOpen,
  loading = false,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
  size = "sm",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title={title}
      size={size}
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
      <div className="text-sm text-muted-foreground">{description}</div>
    </Modal>
  );
};

export default ConfirmModal;
