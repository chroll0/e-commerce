import {
  AuthActions,
  Logo,
  ThemeToggle,
  NavBar,
  CategoryDropdown,
  SearchBar,
} from "@/components";
import { Bell, ShoppingCart } from "lucide-react";

const Navigation = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-1 px-5 border-b border-border">
        <NavBar />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthActions />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-1 border-b border-border">
        <div className="flex items-center gap-6">
          <Logo />
          <CategoryDropdown />
          <SearchBar />
        </div>
        <div className="flex items-center gap-2.5 text-foreground hover:text-primary cursor-pointer transition">
          <ShoppingCart className="w-5 h-5 " />
          <div>|</div>
          <Bell className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
