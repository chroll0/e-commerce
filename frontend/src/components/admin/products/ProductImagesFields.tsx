"use client";

import { FC, useMemo, useRef, useState } from "react";
import { Button } from "@/components";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { X } from "lucide-react";
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

    // optional UI texts for local validation
    invalidFile?: string; // "Only images are allowed"
    tooLarge?: string; // "File is too large"
    tooMany?: string; // "Too many images"
    uploadFailed?: string; // "Upload failed"
  };

  // optional limits
  maxFiles?: number; // default 10
  maxSizeMb?: number; // default 5
};

const ProductImagesFields: FC<Props> = ({
  setValue,
  errors,
  images,
  onRemove,
  labels,
  maxFiles = 10,
  maxSizeMb = 5,
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

  function validateFiles(files: File[]) {
    // clear old error
    setLocalError(null);

    // max count
    const currentCount = safeImages.length;
    if (currentCount + files.length > maxFiles) {
      setLocalError(labels.tooMany ?? `Max ${maxFiles} images allowed.`);
      return false;
    }

    // only images + size
    const maxBytes = maxSizeMb * 1024 * 1024;

    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        setLocalError(labels.invalidFile ?? "Only image files are allowed.");
        return false;
      }
      if (f.size > maxBytes) {
        setLocalError(labels.tooLarge ?? `Max file size is ${maxSizeMb}MB.`);
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

      // base: keep only non-empty strings
      const base = (images ?? []).filter(
        (u) => typeof u === "string" && u.trim(),
      );

      // avoid duplicates
      const next = [...base];
      for (const u of urls) {
        if (u && !next.includes(u)) next.push(u);
      }

      setValue("images", next, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (e) {
      setLocalError(labels.uploadFailed ?? "Upload failed.");
      throw e;
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

  const disabled = uploadingCount > 0;

  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      {(imagesError || localError) && (
        <p className="text-xs text-red-500 leading-tight">
          {localError ?? imagesError}
        </p>
      )}

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
        onClick={() => !disabled && inputRef.current?.click()}
        className={[
          "rounded-2xl border border-dashed p-6 transition",
          "flex flex-col items-center justify-center gap-3 text-center",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border",
        ].join(" ")}
      >
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
            if (!disabled) inputRef.current?.click();
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
            const files = e.target.files;
            if (files?.length) uploadFiles(files);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {/* Previews */}
      {safeImages.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {safeImages.map(({ url, index }) => (
            <div
              key={`${url}-${index}`}
              className="relative rounded-xl border border-border overflow-hidden bg-background"
            >
              <div className="relative aspect-square">
                <img
                  src={url}
                  alt={`${labels.title} ${index + 1}`}
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 left-2 text-xs underline bg-background/80 rounded-md px-2 py-1"
              >
                {labels.preview}
              </a>

              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={disabled}
                aria-label={labels.remove}
                title={labels.remove}
                className={[
                  "absolute top-2 right-2 rounded-full border border-border bg-background/90",
                  "p-1 shadow-sm transition",
                  disabled
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-background",
                ].join(" ")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImagesFields;
