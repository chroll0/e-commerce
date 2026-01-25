"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import type { ImageUploadLabels } from "@/types/common";

type UploadResult = { secureUrl: string };

type CommonProps = {
  upload: (file: File) => Promise<UploadResult>;
  labels: ImageUploadLabels;
  maxSizeMb?: number;
  error?: string;
  disabled?: boolean;
};

type SingleProps = CommonProps & {
  maxFiles: 1;
  value: string;
  onChange: (next: string) => void;
};

type MultiProps = CommonProps & {
  maxFiles?: number; // default 5
  value: string[];
  onChange: (next: string[]) => void;
};

type Props = SingleProps | MultiProps;

function isSingle(p: Props): p is SingleProps {
  return p.maxFiles === 1;
}

function toArray(v: string | string[]) {
  return Array.isArray(v) ? v : v ? [v] : [];
}

function dedupe(arr: string[]) {
  const out: string[] = [];
  for (const x of arr) {
    const t = (x ?? "").trim();
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

export default function ImageUpload(props: Props) {
  const { upload, labels, maxSizeMb = 10, error, disabled = false } = props;

  const maxFiles = props.maxFiles ?? 5;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const isBusy = disabled || uploadingCount > 0;

  const urls = useMemo(() => dedupe(toArray(props.value)), [props.value]);

  function openPicker() {
    if (!isBusy) inputRef.current?.click();
  }

  function showError(msg: string) {
    setLocalError(msg);
  }

  function validateFiles(files: File[]) {
    setLocalError(null);

    if (urls.length + files.length > maxFiles) {
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
      const results = await Promise.all(files.map((f) => upload(f)));
      const newUrls = results.map((r) => r.secureUrl).filter(Boolean);

      const next = dedupe([...dedupe(urls), ...newUrls]);

      if (isSingle(props)) {
        props.onChange(next[next.length - 1] ?? "");
      } else {
        props.onChange(next);
      }
    } catch {
      showError(labels.uploadFailed);
      throw new Error(labels.uploadFailed);
    } finally {
      setUploadingCount((c) => Math.max(0, c - files.length));
    }
  }

  function removeAt(idx: number) {
    if (isBusy) return;

    if (isSingle(props)) {
      props.onChange("");
      return;
    }

    const next = [...urls];
    next.splice(idx, 1);
    props.onChange(next);
  }

  const errorText = localError ?? error;

  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      {errorText ? (
        <p className="text-xs text-red-500 leading-tight">{errorText}</p>
      ) : null}

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
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          const files = e.dataTransfer.files;
          if (files?.length) uploadFiles(files);
        }}
        onClick={openPicker}
        className={[
          "rounded-2xl border border-dashed p-6 transition",
          "flex flex-col items-center justify-center gap-3 text-center",
          isBusy ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border",
        ].join(" ")}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />

        <div className="space-y-1">
          <p className="text-sm font-medium">{labels.title}</p>
          <p className="text-xs text-muted-foreground">{labels.hint}</p>
          {uploadingCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              {labels.uploading(uploadingCount)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted/40 transition"
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
          disabled={isBusy}
        >
          {labels.add}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles !== 1}
          className="hidden"
          onChange={(e) => {
            const files = e.currentTarget.files;
            if (files?.length) uploadFiles(files);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {urls.length ? (
        <div
          className={
            maxFiles === 1
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
          }
        >
          {urls.map((url, index) => (
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

              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 left-2 inline-flex items-center rounded-lg bg-primary px-2 py-1 text-xs text-background"
              >
                {labels.preview}
              </a>

              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={isBusy}
                aria-label={labels.remove}
                title={labels.remove}
                className={[
                  "absolute top-2 right-2 inline-flex items-center justify-center",
                  "h-8 w-8 rounded-lg border border-border bg-card",
                  "hover:bg-muted/40 transition",
                  isBusy ? "opacity-60 cursor-not-allowed" : "",
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
}
