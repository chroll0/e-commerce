export type Locale = "en" | "ka";

export type ImageUploadLabels = {
  title: string;
  hint: string;
  add: string;
  remove: string;

  preview: string;
  uploading: (count: number) => string;

  invalidFile: string;
  tooLarge: (maxMb: number) => string;
  tooMany: (maxFiles: number) => string;

  uploadFailed: string;
};

export type Translation = {
  locale: Locale;
  name: string;
  description?: string;
};
