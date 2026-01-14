import { FC } from "react";

type Props = {
  depth: number;
  isLast: boolean;
  ancestorLast: boolean[];
  colWidth?: number;
  extendRight?: number;
};

const TreeLines: FC<Props> = ({
  depth,
  isLast,
  colWidth = 18,
  extendRight = 10,
}) => {
  if (depth === 0) return null;

  const x = (depth - 1) * colWidth + colWidth / 2;

  return (
    <div
      className="relative flex shrink-0 self-stretch"
      style={{ width: depth * colWidth }}
      aria-hidden="true"
    >
      {/* ✅ corner stub only */}
      <span
        className="absolute w-px bg-border"
        style={{
          left: x,
          top: 0,
          bottom: isLast ? "50%" : 0,
        }}
      />

      {/* ✅ horizontal connector */}
      <span
        className="absolute h-px bg-border"
        style={{
          left: x,
          top: "50%",
          right: -extendRight,
        }}
      />
    </div>
  );
};

export default TreeLines;
