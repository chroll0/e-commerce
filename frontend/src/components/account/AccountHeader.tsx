import { Button } from "@/components";

type Props = {
  onLogout: () => void;
};

export default function AccountHeader({ onLogout }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">My Account</h1>
        <p className="text-secondary mt-1">Manage your profile and orders.</p>
      </div>

      <Button variant="secondary" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}
