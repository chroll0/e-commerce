// Central exports for provider components
export { default as Providers } from "./providers/providers";
export { default as LoadingProvider } from "./providers/LoadingProvider";

// Central exports for shared components
export { default as Button } from "./ui/Button";
export { default as Spinner } from "./ui/Spinner";
export { default as Card } from "./ui/Card";
export { default as Modal } from "./ui/Modal";
export { default as Input } from "./ui/Input";
export { default as PageWrapper } from "./ui/PageWrapper";
export { default as Logo } from "./ui/Logo";
export { default as Tooltip } from "./ui/Tooltip";
export { default as Advertisement } from "./ui/Advertisement";
export { default as NotificationCenter } from "./ui/NotificationCenter";

// Navigation components
export { default as NavBar } from "./navigation/NavBar";
export { default as AuthActions } from "./navigation/AuthActions";
export { default as CategorySelect } from "./navigation/CategorySelect";
export { default as ThemeToggle } from "./navigation/ThemeToggle";
export { default as SearchBar } from "./navigation/SearchBar";
export { default as Breadcrumbs } from "./navigation/Breadcrumbs";

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
export { default as StoreHeader } from "./stores/StoreHeader";
export { default as StoreProductsSection } from "./stores/StoreProductsSection";

// Layout components
export { default as Navigation } from "./layout/Navigation";
export { default as Footer } from "./layout/Footer";

// Cart components
export { default as CartItem } from "./cart/CartItem";
export { default as CartSummary } from "./cart/CartSummary";
export { default as EmptyCart } from "./cart/EmptyCart";

// Footer components
export { default as LanguageSwitcher } from "./footer/LanguageSwitcher";

// Account components
export { default as AccountNav } from "./account/AccountNav";
export { default as Avatar } from "./account/Avatar";
export { default as AccountProfileCard } from "./account/AccountProfileCard";
export { default as AccountHeader } from "./account/AccountHeader";
export { default as AccountQuickActions } from "./account/AccountQuickActions";

// Auth components
export { default as AuthGuard } from "./auth/AuthGuard";

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
export { default as AdminActions } from "./admin/dashboard/AdminActions";
export { default as AdminDonutStats } from "./admin/dashboard/AdminDonutStats";
export { default as AdminRecentOrders } from "./admin/dashboard/AdminRecentOrders";
export { default as AdminLowStock } from "./admin/dashboard/AdminLowStock";
export { default as AdminOrdersStatusDonut } from "./admin/dashboard/AdminOrdersStatusDonut";
export { AdminSidebarDrawer } from "./admin/dashboard/AdminSidebarDrawer";

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

// Admin shared state components
export { default as AdminPagination } from "./admin/common/AdminPagination";
export { default as AdminEmptyState } from "./admin/common/AdminEmptyState";
export { default as AdminErrorState } from "./admin/common/AdminErrorState";

// Order management components
export { default as OrderStatusBadge } from "./admin/orders/OrderStatusBadge";
export { default as OrdersFilters } from "./admin/orders/OrdersFilters";
export { default as OrdersTable } from "./admin/orders/OrdersTable";
export { default as OrderOverviewCard } from "./admin/orders/OrderOverviewCard";
export { default as OrderCustomerCard } from "./admin/orders/OrderCustomerCard";
export { default as OrderItemsTable } from "./admin/orders/OrderItemsTable";
export { default as OrderDeliveryCard } from "./admin/orders/OrderDeliveryCard";
export { default as OrderFinancialSummary } from "./admin/orders/OrderFinancialSummary";
export { default as OrderPaymentInfo } from "./admin/orders/OrderPaymentInfo";
export {
  formatCurrency as formatOrderCurrency,
  formatDate as formatOrderDate,
  getProductTitle,
} from "./admin/orders/orderFormatters";

// Payment management components
export { default as PaymentsFilters } from "./admin/payments/PaymentsFilters";
export { default as PaymentsTable } from "./admin/payments/PaymentsTable";

// Skeleton components
export { default as CategoryScrollerSkeleton } from "./skeletons/CategoryScrollerSkeleton";
export { default as ProductCardSkeleton } from "./skeletons/ProductCardSkeleton";
export { default as StoreHeaderSkeleton } from "./skeletons/StoreHeaderSkeleton";
export { default as StoreCardSkeleton } from "./skeletons/StoreCardSkeleton";
export { default as ProductDetailsPageSkeleton } from "./skeletons/ProductDetailsPageSkeleton";
export { default as AccountDetailsSkeleton } from "./skeletons/AccountDetailsSkeleton";
