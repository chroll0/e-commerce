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

// Navigation components
export { default as NavBar } from "./navigation/NavBar";
export { default as AuthActions } from "./navigation/AuthActions";
export { default as CategoryDropdown } from "./navigation/CategoryDropdown";
export { default as ThemeToggle } from "./navigation/ThemeToggle";
export { default as SearchBar } from "./navigation/SearchBar";

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

// Footer components
export { default as LanguageSwitcher } from "./footer/LanguageSwitcher";

// Account components
export { default as AccountNav } from "./account/AccountNav";
export { default as Avatar } from "./account/Avatar";
export { default as AccountProfileCard } from "./account/AccountProfileCard";
export { default as AccountHeader } from "./account/AccountHeader";
export { default as AccountQuickActions } from "./account/AccountQuickActions";

// Admin common components
export { default as SidebarLink } from "./admin/common/SidebarLink";
export { AdminSidebar } from "./admin/common/AdminSidebar";
export { default as AdminPageHeader } from "./admin/common/AdminPageHeader";
export { default as ConfirmModal } from "./admin/common/ConfirmModal";
export { default as FormInput } from "./admin/common/FormInput";

// Category management components
export { default as CategoriesTable } from "./admin/categories/CategoriesTable";
export { default as CategoryForm } from "./admin/categories/CategoryForm";
export { default as TreeLines } from "./admin/categories/TreeLines";
export { buildTree } from "./admin/categories/categoryTree";
export { flattenTree } from "./admin/categories/categoryTree";
export { buildIndentedOptions, slugify } from "./admin/categories/formOptions";

// Product management components
export { default as ProductContentFields } from "./admin/products/ProductContentFields";
export { default as ProductForm } from "./admin/products/ProductForm";
export { default as ProductImagesFields } from "./admin/products/ProductImagesFields";
export { default as ProductMetaFields } from "./admin/products/ProductMetaFields";
export { default as ProductPricingFields } from "./admin/products/ProductPricingFields";
export { default as ProductRow } from "./admin/products/ProductRow";
export { default as ProductsTable } from "./admin/products/ProductsTable";
export { default as ProductsFilters } from "./admin/products/ProductsFilters";
