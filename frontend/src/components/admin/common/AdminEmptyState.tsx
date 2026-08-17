type Props = {
  message: string;
};

const AdminEmptyState = ({ message }: Props) => (
  <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
    {message}
  </div>
);

export default AdminEmptyState;
