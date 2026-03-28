import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../storefront/cart/CartContext";
import { getCoupon } from "../../services/couponService";
import { resolveResponsiveImageSource } from "../../services/api";
import { Coupon } from "../../services/types";
import Button from "../ui/Button";

const CartDrawer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { items, total, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isDrawerOpen, closeDrawer]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
      return (total * appliedCoupon.value) / 100;
    }
    return Math.min(total, appliedCoupon.value);
  }, [appliedCoupon, total]);

  const checkoutTarget = appliedCoupon
    ? `/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
    : "/checkout";

  const applyCoupon = async () => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      setAppliedCoupon(null);
      setCouponError("");
      return;
    }
    const match = await getCoupon(normalized);
    if (!match || match.status !== "active") {
      setAppliedCoupon(null);
      setCouponError(t("checkout.couponInvalid"));
      return;
    }
    setCouponError("");
    setAppliedCoupon(match);
  };

  return (
    <>
      <button
        type="button"
        className={`cart-drawer__scrim ${isDrawerOpen ? "is-open" : ""}`.trim()}
        aria-hidden={!isDrawerOpen}
        onClick={closeDrawer}
      />
      <aside className={`cart-drawer ${isDrawerOpen ? "is-open" : ""}`.trim()} aria-label={t("cart.title")}>
        <div className="cart-drawer__header">
          <h2>{t("cart.title")}</h2>
          <button type="button" className="icon-button" onClick={closeDrawer} aria-label={t("shop.close")}>
            x
          </button>
        </div>
        {!items.length ? (
          <div className="cart-drawer__empty">
            <p>{t("cart.empty")}</p>
            <Link className="button button--primary" to="/shop" onClick={closeDrawer}>
              {t("cta.explore")}
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => {
                const imageSource = resolveResponsiveImageSource(item.product.images?.[0]);
                return (
                  <article key={item.id} className="cart-drawer__item">
                    <div className="cart-drawer__item-media">
                      {imageSource?.src ? <img src={imageSource.src} srcSet={imageSource.srcSet} alt="" loading="lazy" /> : null}
                    </div>
                    <div className="cart-drawer__item-body">
                      <strong>{item.product.name}</strong>
                      <span>{item.variant.size}</span>
                      <span>EGP {(item.variant.price * item.quantity).toLocaleString()}</span>
                      <div className="cart-drawer__qty">
                        <Button type="button" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button type="button" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => removeItem(item.id)}>
                          {t("cart.remove")}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="cart-drawer__coupon">
              <label htmlFor="drawer-coupon">{t("checkout.couponLabel")}</label>
              <div className="cart-drawer__coupon-row">
                <input
                  id="drawer-coupon"
                  className="input"
                  placeholder={t("checkout.couponPlaceholder")}
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                />
                <Button type="button" onClick={() => void applyCoupon()}>
                  {t("checkout.applyCoupon")}
                </Button>
              </div>
              {couponError ? <p className="checkout-field__error">{couponError}</p> : null}
            </div>
            <div className="cart-drawer__summary">
              <div className="receipt-row">
                <span>{t("cart.total")}</span>
                <span>EGP {total.toLocaleString()}</span>
              </div>
              {discount > 0 ? (
                <div className="receipt-row receipt-row--discount">
                  <span>{t("checkout.discount")}</span>
                  <span>- EGP {discount.toLocaleString()}</span>
                </div>
              ) : null}
              <div className="receipt-row receipt-total">
                <span>{t("checkout.finalTotal")}</span>
                <span>EGP {(total - discount).toLocaleString()}</span>
              </div>
            </div>
            <div className="cart-drawer__actions">
              <Link className="button button--outline" to="/cart" onClick={closeDrawer}>
                {t("cart.title")}
              </Link>
              <Link className="button button--primary" to={checkoutTarget} onClick={closeDrawer}>
                {t("cart.checkout")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
