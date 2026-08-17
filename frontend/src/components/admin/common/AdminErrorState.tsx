import { Button } from "@/components";

type Props = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
};

const AdminErrorState = ({ message, retryLabel, onRetry }: Props) => (
  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
    <p>{message}</p>
    <Button className="mt-3" variant="outline" size="sm" onClick={onRetry}>
      {retryLabel}
    </Button>
  </div>
);

export default AdminErrorState;
