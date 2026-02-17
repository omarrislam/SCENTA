import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../storefront/cart/CartContext";
import { listPublicCoupons } from "../../services/couponService";
import { resolveResponsiveImageSource } from "../../services/api";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import Button from "../ui/Button";

const CartDrawer = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const location = useLocation();
  const { data: coupons = [] } = useQuery({ queryKey: ["coupons"], queryFn: listPublicCoupons });
  const { items, total, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
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
    if (!appliedCouponCode) return 0;
    const match = coupons.find((coupon) => coupon.code.toUpperCase() === appliedCouponCode && coupon.status === "active");
    if (!match) return 0;
    if (match.type === "percent") {
      return (total * match.value) / 100;
    }
    return Math.min(total, match.value);
  }, [appliedCouponCode, coupons, total]);

  const checkoutTarget = appliedCouponCode
    ? `/checkout?coupon=${encodeURIComponent(appliedCouponCode)}`
    : "/checkout";

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      setAppliedCouponCode(null);
      setCouponError("");
      return;
    }
    const match = coupons.find((coupon) => coupon.code.toUpperCase() === normalized && coupon.status === "active");
    if (!match) {
      setAppliedCouponCode(null);
      setCouponError(t("checkout.couponInvalid"));
      return;
    }
    setCouponError("");
    setAppliedCouponCode(normalized);
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
                      {imageSource?.src ? <img src={imageSource.src} srcSet={imageSource.srcSet} alt="" /> : null}
                    </div>
                    <div className="cart-drawer__item-body">
                      <strong>{pickLocalized(item.product.name, item.product.nameAr, locale)}</strong>
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
                <Button type="button" onClick={applyCoupon}>
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
