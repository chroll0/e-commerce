import { Button } from "@/components";

type Props = {
  page: number;
  totalPages: number;
  countLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

const AdminPagination = ({
  page,
  totalPages,
  countLabel,
  previousLabel,
  nextLabel,
  pageLabel,
  onPrevious,
  onNext,
}: Props) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{countLabel}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={onPrevious}
        >
          {previousLabel}
        </Button>
        <span>{pageLabel}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={onNext}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
};

export default AdminPagination;
