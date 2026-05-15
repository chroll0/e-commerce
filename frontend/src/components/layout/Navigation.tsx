import {
  AuthActions,
  Logo,
  ThemeToggle,
  NavBar,
  RunningText,
} from "@/components";
import { Bell, ShoppingCart } from "lucide-react";

const Navigation = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-2.5 px-6 md:px-12 border-b border-border">
        <NavBar />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthActions />
        </div>
      </div>

      <div className="flex items-center justify-between py-1.5 px-6 md:px-12 border-b border-border gap-6">
        {/* LOGO */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* RUNNING TEXT */}
        <div className="flex-1 overflow-hidden">
          <RunningText />
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 items-center gap-3 text-foreground">
          {/* CART */}
          <div className="flex items-center gap-3 text-foreground hover:text-primary cursor-pointer transition">
            <ShoppingCart className="h-5 w-5" />
            <div>|</div>
          </div>

          {/* BELL */}
          <div className="cursor-pointer transition hover:text-primary">
            <Bell className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
