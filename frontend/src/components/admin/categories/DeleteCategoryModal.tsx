// components/categories/DeleteCategoryModal.tsx
"use client";

import { Button, Modal } from "@/components";
import { FC } from "react";

type Props = {
  isOpen: boolean;
  loading?: boolean;
  categoryName?: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCategoryModal: FC<Props> = ({
  isOpen,
  loading = false,
  categoryName,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title="Delete category"
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-medium text-foreground">
          {categoryName || "this category"}
        </span>
        ? This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteCategoryModal;
