"use client";

import { FC, useMemo, useRef, useState } from "react";
import { Button } from "@/components";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { X, UploadCloud } from "lucide-react";
import { uploadProductImage } from "@/lib/cloudinary";
import Image from "next/image";

type Props = {
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  images: string[];
  onRemove: (idx: number) => void;
  labels: {
    title: string;
    imagesHint: string;
    add: string;
    remove: string;
    preview: string;
    uploading: (count: number) => string;
    invalidFile: string;
    tooLarge: (maxMb: number) => string;
    tooMany: (maxFiles: number) => string;
    uploadFailed: string;
  };
  maxFiles?: number;
  maxSizeMb?: number;
};

const ProductImagesFields: FC<Props> = ({
  setValue,
  errors,
  images,
  onRemove,
  labels,
  maxFiles = 5,
  maxSizeMb = 10,
}) => {
  const imagesError = errors.images?.message as string | undefined;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const safeImages = useMemo(
    () =>
      (images ?? [])
        .map((url, index) => ({ url, index }))
        .filter((x) => typeof x.url === "string" && x.url.trim().length > 0),
    [images],
  );

  const disabled = uploadingCount > 0;

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  function showError(msg: string) {
    setLocalError(msg);
  }

  function validateFiles(files: File[]) {
    setLocalError(null);
    const currentCount = safeImages.length;
    if (currentCount + files.length > maxFiles) {
      showError(labels.tooMany(maxFiles));
      return false;
    }

    const maxBytes = maxSizeMb * 1024 * 1024;

    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        showError(labels.invalidFile);
        return false;
      }
      if (f.size > maxBytes) {
        showError(labels.tooLarge(maxSizeMb));
        return false;
      }
    }

    return true;
  }

  async function uploadFiles(filesLike: FileList | File[]) {
    const files = Array.from(filesLike);
    if (!files.length) return;

    if (!validateFiles(files)) return;

    setUploadingCount((c) => c + files.length);

    try {
      const results = await Promise.all(
        files.map((file) => uploadProductImage(file, "products")),
      );

      const urls = results.map((r) => r.secureUrl);

      // keep only non-empty
      const base = (images ?? [])
        .filter((u) => typeof u === "string")
        .map((u) => u.trim())
        .filter(Boolean);

      const next = [...base];
      for (const u of urls) {
        if (u && !next.includes(u)) next.push(u);
      }

      setValue("images", next, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch {
      showError(labels.uploadFailed);
      throw new Error(labels.uploadFailed);
    } finally {
      setUploadingCount((c) => Math.max(0, c - files.length));
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length) uploadFiles(files);
  }

  const errorText = localError ?? imagesError;

  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      {errorText ? (
        <p className="text-xs text-red-500 leading-tight">{errorText}</p>
      ) : null}

      {/* Dropzone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={openPicker}
        className={[
          "rounded-2xl border border-dashed p-6 transition",
          "flex flex-col items-center justify-center gap-3 text-center",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border",
        ].join(" ")}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />

        <div className="space-y-1">
          <p className="text-sm font-medium">{labels.title}</p>
          <p className="text-xs text-muted-foreground">{labels.imagesHint}</p>
          {uploadingCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              {labels.uploading(uploadingCount)}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
          disabled={disabled}
        >
          {labels.add}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.currentTarget.files;
            if (files?.length) uploadFiles(files);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {/* Previews */}
      {safeImages.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {safeImages.map(({ url, index }) => (
            <div
              key={`${url}-${index}`}
              className="relative rounded-xl border border-border overflow-hidden bg-background"
            >
              <div className="relative aspect-square">
                <Image
                  src={url}
                  alt={`${labels.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <Button
                asChild
                variant="primary"
                size="xs"
                className="absolute bottom-2 left-2"
              >
                <a href={url} target="_blank" rel="noreferrer">
                  {labels.preview}
                </a>
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                iconOnly
                onClick={() => onRemove(index)}
                disabled={disabled}
                aria-label={labels.remove}
                title={labels.remove}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImagesFields;
