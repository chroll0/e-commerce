// Central exports for provider components
export { default as Providers } from "./providers/providers";
export { default as LoadingProvider } from "./providers/LoadingProvider";

// Central exports for shared components
export { default as Button } from "./ui/Button";
export { default as Card } from "./ui/Card";
export { default as Modal } from "./ui/Modal";
export { default as Input } from "./ui/Input";
export { default as PageWrapper } from "./ui/PageWrapper";
export { default as Dropdown } from "./ui/Dropdown";
export { default as Logo } from "./ui/Logo";
export { default as Tooltip } from "./ui/Tooltip";
export { default as Advertisement } from "./ui/Advertisement";

// Navbar components
// export { default as NavBar } from "./navbar/NavBar";
// export { default as CategoryDropdown } from "./navbar/CategoryDropdown";
// export { default as SearchBar } from "./navbar/SearchBar";
// export { default as NavIcons } from "./navbar/NavIcons";

// Home page components
export { default as Hero } from "./home/Hero";
export { default as CategoryScroller } from "./home/CategoryScroller";
export { default as FlashSale } from "./home/FlashSale";
export { default as FeaturedProducts } from "./home/FeaturedProducts";
export { default as BestStores } from "./home/BestStores";

// Product components
export { default as ProductCard } from "./product/ProductCard";

// Layout components
export { default as Navigation } from "./layout/Navigation";
export { default as Footer } from "./layout/Footer";

// Other components
export { default as CategoryDropdown } from "./navigation/CategoryDropdown";
export { default as ThemeToggle } from "./navigation/ThemeToggle";
export { default as AuthActions } from "./navigation/AuthActions";
export { default as SearchBar } from "./navigation/SearchBar";
export { default as NavBar } from "./navigation/NavBar";

// Admin components
export { default as SidebarLink } from "./admin/SidebarLink";
export { AdminSidebar } from "./admin/AdminSidebar";

// Account components
export { default as AccountNav } from "./account/AccountNav";
export { default as Avatar } from "./account/Avatar";
export { default as AccountProfileCard } from "./account/AccountProfileCard";
export { default as AccountHeader } from "./account/AccountHeader";
export { default as AccountQuickActions } from "./account/AccountQuickActions";

// Category management components
export { default as CategoriesHeader } from "./admin/categories/CategoriesHeader";
export { default as CategoriesTable } from "./admin/categories/CategoriesTable";
export { default as DeleteCategoryModal } from "./admin/categories/DeleteCategoryModal";
export { buildTree } from "./admin/categories/categoryTree";
export { flattenTree } from "./admin/categories/categoryTree";
export { default as LanguageTabs } from "./admin/categories/LanguageTabs";
export { default as CategoryForm } from "./admin/categories/CategoryForm";
export { default as TreeLines } from "./admin/categories/TreeLines";
export { buildIndentedOptions, slugify } from "./admin/categories/formOptions";

// Footer components
export { default as LanguageSwitcher } from "./footer/LanguageSwitcher";
