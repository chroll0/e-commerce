import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="relative flex items-baseline select-none tracking-wider"
    >
      <span className="text-3xl font-bold text-primary leading-none">S</span>

      <span className="relative text-lg font-medium tracking-wider text-foreground left-0 bottom-[0.1rem] underline decoration-1">
        atori
      </span>
    </Link>
  );
};

export default Logo;
