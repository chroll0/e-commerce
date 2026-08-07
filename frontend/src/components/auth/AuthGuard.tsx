import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
  role?: string;
  locale?: string;
};

export default async function AuthGuard({
  children,
  role,
  locale = "en",
}: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    redirect(`/${locale}/auth/login`);
  }

  if (role) {
    const cookieValue = token?.value;

    if (!cookieValue) {
      redirect(`/${locale}/auth/login`);
    }
  }

  return <>{children}</>;
}
