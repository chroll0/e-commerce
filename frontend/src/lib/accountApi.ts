import { api } from "./axios";
import type {
  Address,
  AddressInput,
  PreferencesInput,
  UserPreferences,
} from "@/types/account";

export const accountApi = {
  listAddresses: async () =>
    (await api.get<Address[]>("/users/me/addresses")).data,
  createAddress: async (input: AddressInput) =>
    (await api.post<Address>("/users/me/addresses", input)).data,
  updateAddress: async (id: number, input: Partial<AddressInput>) =>
    (await api.patch<Address>(`/users/me/addresses/${id}`, input)).data,
  deleteAddress: async (id: number) =>
    (await api.delete(`/users/me/addresses/${id}`)).data,
  setDefaultAddress: async (id: number) =>
    (await api.patch<Address>(`/users/me/addresses/${id}/default`)).data,
  getPreferences: async () =>
    (await api.get<UserPreferences>("/users/me/preferences")).data,
  updatePreferences: async (input: PreferencesInput) =>
    (await api.patch<UserPreferences>("/users/me/preferences", input)).data,
  deleteAccount: async (password: string) =>
    (await api.delete("/users/me", { data: { password } })).data,
};
