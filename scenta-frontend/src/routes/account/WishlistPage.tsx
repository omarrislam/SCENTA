import { useTranslation } from "react-i18next";
import { useWishlist } from "../../storefront/wishlist/WishlistContext";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import StockIndicator from "../../components/product/StockIndicator";

const WishlistPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { items } = useWishlist();

  return (
    <div className="card">
      <h2 className="section-title">{t("account.wishlist")}</h2>
      {!items.length ? (
        <p>{t("account.wishlistEmpty")}</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.variantKey ?? "default"}`} className="card">
              <strong>{pickLocalized(item.product.name, item.product.nameAr, locale)}</strong>
              <StockIndicator stock={item.product.variants?.[0]?.stock ?? 0} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
