import { Advertisement, LanguageSwitcher } from "@/components";

const Footer = () => {
  return (
    <div className="px-5 py-12 space-y-6">
      <Advertisement
        title="Free delivery over ₾150"
        description="Applies to Tbilisi area."
        variant="promo"
      />
      Footer
      <LanguageSwitcher />
    </div>
  );
};

export default Footer;
