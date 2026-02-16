import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../storefront/cart/CartContext";
import Button from "../../components/ui/Button";
import { resolveResponsiveImageSource } from "../../services/api";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import StockIndicator from "../../components/product/StockIndicator";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div>
      <h1 className="section-title">{t("cart.title")}</h1>
      {!items.length ? (
        <div className="card empty-state">
          <div className="empty-state__icon" aria-hidden="true">bag</div>
          <h2 className="empty-state__title">{t("cart.empty")}</h2>
          <p className="empty-state__body">{t("home.quizBody")}</p>
          <div className="empty-state__actions">
            <Link className="button button--primary" to="/shop">
              {t("cta.explore")}
            </Link>
            <Link className="button button--outline" to="/quiz">
              {t("nav.quiz")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => {
            const imageSource = resolveResponsiveImageSource(item.product.images?.[0]);
            return (
            <div key={item.id} className="card cart-item">
              <div className="cart-item__media">
                {imageSource?.src ? (
                  <img
                    src={imageSource.src}
                    srcSet={imageSource.srcSet}
                    alt={item.product.name}
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    sizes="120px"
                  />
                ) : (
                  <div className="cart-item__placeholder" />
                )}
              </div>
              <div className="cart-item__body">
                <strong>{pickLocalized(item.product.name, item.product.nameAr, locale)}</strong>
                <p>{item.variant.size}</p>
                <StockIndicator stock={item.variant.stock ?? 0} />
                {item.quantity > item.variant.stock && (
                  <p>{t("cart.onlyLeft", { count: item.variant.stock })}</p>
                )}
                <div className="cart-item__actions">
                  <Button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </Button>
                  <Button type="button" onClick={() => removeItem(item.id)}>
                    {t("cart.remove")}
                  </Button>
                </div>
              </div>
            </div>
            );
          })}
          <div className="card">
            <h3>{t("cart.total")}</h3>
            <p>EGP {total.toLocaleString()}</p>
            <Link className="button button--primary" to="/checkout">
              {t("cart.checkout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
