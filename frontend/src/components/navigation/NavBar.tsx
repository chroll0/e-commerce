import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <Link href="/">Home</Link>
      <Link href="/shop">Shop</Link>
      <Link href="/categories">Categories</Link>
      <Link href="/deals">Deals</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
};

export default NavBar;
