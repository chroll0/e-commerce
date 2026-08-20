export type Address = {
  id: number;
  title: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  apartment: string | null;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserPreferences = {
  id: number;
  userId: number;
  language: string;
  emailNotifications: boolean;
  orderNotifications: boolean;
  marketingEmails: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = Omit<
  Address,
  "id" | "createdAt" | "updatedAt" | "isDefault"
> & { isDefault?: boolean };

export type PreferencesInput = Pick<
  UserPreferences,
  "language" | "emailNotifications" | "orderNotifications" | "marketingEmails"
>;
