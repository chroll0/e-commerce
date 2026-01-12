import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function AccountHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        {description ? (
          <p className="text-secondary mt-1">{description}</p>
        ) : null}
      </div>

      {action ? <div className="min-w-[120px]">{action}</div> : null}
    </div>
  );
}
