import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-0.5 select-none">
      <span className="text-2xl font-extrabold text-primary tracking-tight">
        S
      </span>
      <span className="text-xl font-semibold text-primary">atori</span>
    </Link>
  );
};

export default Logo;
