import { Button, Modal } from "@/components";
import { FC } from "react";

type Props = {
  isOpen: boolean;
  loading?: boolean;
  categoryName?: string;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
};

const DeleteCategoryModal: FC<Props> = ({
  isOpen,
  loading = false,
  categoryName,
  onClose,
  onConfirm,
  title,
  description,
  cancelLabel,
  confirmLabel,
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
      <p className="text-sm text-muted-foreground">
        {description}{" "}
        {/* {categoryName ? (
          <span className="font-medium text-foreground">{categoryName}</span>
        ) : null} */}
      </p>
    </Modal>
  );
};

export default DeleteCategoryModal;
