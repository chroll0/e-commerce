"use client";

import { Search } from "lucide-react";
import { Input } from "@/components";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  searchLabel: string;
};

const LabelsFilters = ({ search, onSearchChange, searchLabel }: Props) => {
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-4">
      <Input
        label={searchLabel}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
        fullWidth
      />
    </div>
  );
};

export default LabelsFilters;
