// Central exports for provider components
export { default as Providers } from "./providers/providers";
export { default as LoadingProvider } from "./providers/LoadingProvider";

// Central exports for shared components
export { default as Button } from "./ui/Button";
export { default as Card } from "./ui/Card";
export { default as Modal } from "./ui/Modal";
export { default as Input } from "./ui/Input";
export { default as PageWrapper } from "./ui/PageWrapper";
export { default as Logo } from "./ui/Logo";
export { default as Tooltip } from "./ui/Tooltip";
export { default as Advertisement } from "./ui/Advertisement";

// Navigation components
export { default as NavBar } from "./navigation/NavBar";
export { default as AuthActions } from "./navigation/AuthActions";
export { default as CategorySelect } from "./navigation/CategorySelect";
export { default as ThemeToggle } from "./navigation/ThemeToggle";
export { default as SearchBar } from "./navigation/SearchBar";

// Home page components
export { default as Hero } from "./home/Hero";
export { default as CategoryScroller } from "./home/CategoryScroller";
export { default as ProductFilter } from "./home/ProductFilter";
export { default as FeaturedProducts } from "./home/FeaturedProducts";
export { default as BestStores } from "./home/BestStores";
export { default as RunningText } from "./home/RunningText";

// Product components
export { default as ProductCard } from "./product/ProductCard";
export { default as ProductDetails } from "./product/ProductDetails";
export { default as ProductSearchFilters } from "./product/ProductSearchFilters";

// Store components
export { default as StoreCard } from "./stores/StoreCard";

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
export { default as FormTextarea } from "./admin/common/FormTextarea";
export { default as ImageUpload } from "./admin/common/ImageUpload";
export { default as SelectField } from "./admin/common/SelectField";

// Admin dashboard components
export { default as AdminStatsGrid } from "./admin/dashboard/AdminStatsGrid";
export { default as AdminQuickActions } from "./admin/dashboard/AdminQuickActions";
export { default as AdminDonutStats } from "./admin/dashboard/AdminDonutStats";
export { default as AdminRecentOrders } from "./admin/dashboard/AdminRecentOrders";
export { default as AdminLowStock } from "./admin/dashboard/AdminLowStock";
export { default as AdminOrdersStatusDonut } from "./admin/dashboard/AdminOrdersStatusDonut";

// User management components
export { default as UserEditModal } from "./admin/users/UserEditModal";
export { default as AdminUsersTable } from "./admin/users/AdminUsersTable";

// Category management components
export { default as CategoriesTable } from "./admin/categories/CategoriesTable";
export { default as CategoryForm } from "./admin/categories/CategoryForm";
export { default as TreeLines } from "./admin/categories/TreeLines";
export { buildTree } from "./admin/categories/categoryTree";
export { flattenTree } from "./admin/categories/categoryTree";
export { buildIndentedOptions, slugify } from "./admin/categories/formOptions";

// Store management components
export { default as StoreForm } from "./admin/stores/StoreForm";
export { default as StoresTable } from "./admin/stores/StoresTable";

// Product management components
export { default as ProductContentFields } from "./admin/products/ProductContentFields";
export { default as ProductForm } from "./admin/products/ProductForm";
export { default as ProductMetaFields } from "./admin/products/ProductMetaFields";
export { default as ProductPricingFields } from "./admin/products/ProductPricingFields";
export { default as ProductRow } from "./admin/products/ProductRow";
export { default as ProductsTable } from "./admin/products/ProductsTable";
export { default as ProductsFilters } from "./admin/products/ProductsFilters";

// Skeleton components
export { default as CategoryScrollerSkeleton } from "./skeletons/CategoryScrollerSkeleton";
export { default as ProductCardSkeleton } from "./skeletons/ProductCardSkeleton";
