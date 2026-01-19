export type UserRole = "USER" | "ADMIN";

export type UserApi = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt?: string;
};
