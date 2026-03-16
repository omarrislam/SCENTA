import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../../storefront/wishlist/WishlistContext";
import StockIndicator from "../../components/product/StockIndicator";

const WishlistPage = () => {
  const { t } = useTranslation();
  const { items } = useWishlist();

  return (
    <div className="card">
      <h2 className="section-title">{t("account.wishlist")}</h2>
      {!items.length ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">heart</div>
          <h3 className="empty-state__title">{t("account.wishlistEmpty")}</h3>
          <p className="empty-state__body">{t("home.editorialBody")}</p>
          <div className="empty-state__actions">
            <Link className="button button--primary" to="/shop">
              {t("cta.explore")}
            </Link>
            <Link className="button button--outline" to="/quiz">
              {t("home.quizCta")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.variantKey ?? "default"}`} className="card">
              <strong>{item.product.name}</strong>
              <StockIndicator stock={item.product.variants?.[0]?.stock ?? 0} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
