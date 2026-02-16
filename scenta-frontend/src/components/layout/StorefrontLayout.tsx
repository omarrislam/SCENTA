import { PropsWithChildren, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import LocaleToggle from "./LocaleToggle";
import { useCart } from "../../storefront/cart/CartContext";
import { useAuth } from "../../app/auth/AuthContext";
import { useTheme } from "../../theme/ThemeProvider";

const StorefrontLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();
  const { theme } = useTheme();
  const promoEnabled = theme.home?.promoEnabled ?? true;
  const promoMessages =
    theme.home?.promoMessages?.length
      ? theme.home.promoMessages
      : [t("promo.shipping"), t("promo.cod"), t("promo.crafted")];
  const promoShowIcon = theme.home?.promoShowIcon ?? true;
  const closeMenu = () => setIsOpen(false);
  const isPathActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const navItemClass = (path: string) => `nav-links__link ${isPathActive(path) ? "is-active" : ""}`.trim();

  useEffect(() => {
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["product"], exact: false });
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key == "scenta-inventory-updated") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("inventory-updated", refresh as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("inventory-updated", refresh as EventListener);
    };
  }, [queryClient]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) {
      return;
    }
    elements.forEach((element) => element.classList.add("reveal-init"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("reveal--in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("reveal--in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((element) => {
      if (element.classList.contains("reveal--in")) {
        return;
      }
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        element.classList.add("reveal--in");
      } else {
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  return (
    <div className={isHome ? "layout layout--home" : "layout"}>
      {promoEnabled && promoMessages.length > 0 && (
        <div className="announcement">
          <div className="announcement__track">
            {promoMessages.map((message, index) => (
              <span key={`${message}-${index}`}>
                {promoShowIcon && <span className="announcement__icon" aria-hidden="true">✦</span>}
                {message}
              </span>
            ))}
            {promoMessages.map((message, index) => (
              <span key={`repeat-${message}-${index}`} aria-hidden="true">
                {promoShowIcon && <span className="announcement__icon" aria-hidden="true">✦</span>}
                {message}
              </span>
            ))}
          </div>
        </div>
      )}
      <header className="navbar">
        <div className="navbar__inner container">
          <button
            className={`nav-toggle ${isOpen ? "is-open" : ""}`.trim()}
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="nav-toggle__icon" aria-hidden="true">
              <span className="nav-toggle__line nav-toggle__line--top" />
              <span className="nav-toggle__line nav-toggle__line--mid" />
              <span className="nav-toggle__line nav-toggle__line--bot" />
              <span className="nav-toggle__spark nav-toggle__spark--a" />
              <span className="nav-toggle__spark nav-toggle__spark--b" />
            </span>
            <span className="sr-only">Menu</span>
          </button>
          <Link to="/" className="brand">
            {t("brand")}
          </Link>
          <div className="nav-actions">
            <Link to="/cart" className="nav-icon nav-icon--cart" aria-label={t("nav.cart")}>
              <span className="nav-icon__glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path
                    d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 6h13.2l-1.2 7H7.1L6.2 6Zm13.6-2H5.6L4.9 2H2v2h1.6l2.2 11.2A2 2 0 0 0 7.7 17h9.8a2 2 0 0 0 2-1.6L21 4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="nav-icon__count">{items.length}</span>
            </Link>
            <LocaleToggle />
          </div>
          <nav id="mobile-nav" className={`nav-links ${isOpen ? "nav-links--open" : ""}`.trim()}>
            <div className="nav-links__header">
              <p className="nav-links__eyebrow">Scent Journey</p>
              <strong className="nav-links__title">{t("brand")}</strong>
              <p className="nav-links__subtitle">Choose where your ritual starts.</p>
            </div>
            <div className="nav-links__group">
              <p className="nav-links__group-label">Shop</p>
              <div className="nav-links__items">
                <Link className={navItemClass("/shop")} to="/shop" onClick={closeMenu}>{t("nav.shop")}</Link>
                <Link className={navItemClass("/collections")} to="/collections/amber-signature" onClick={closeMenu}>{t("nav.collections")}</Link>
                <Link className={navItemClass("/quiz")} to="/quiz" onClick={closeMenu}>{t("nav.quiz")}</Link>
                <Link className={navItemClass("/blog")} to="/blog" onClick={closeMenu}>{t("nav.blog")}</Link>
              </div>
            </div>
            <div className="nav-links__group">
              <p className="nav-links__group-label">Account</p>
              <div className="nav-links__meta">
                <Link className={navItemClass("/account")} to="/account" onClick={closeMenu}>{t("nav.account")}</Link>
                <Link className={navItemClass("/cart")} to="/cart" onClick={closeMenu}>{t("nav.cart")} ({items.length})</Link>
                {user?.role === "admin" && <Link className={navItemClass("/admin")} to="/admin" onClick={closeMenu}>{t("nav.admin")}</Link>}
                {user ? (
                  <button className="button nav-links__auth-button" type="button" onClick={() => { logout(); closeMenu(); }}>
                    {t("nav.signOut")}
                  </button>
                ) : (
                  <Link
                    to="/auth/login"
                    className={`${navItemClass("/auth")} nav-links__auth-link`.trim()}
                    aria-label={t("nav.account")}
                    onClick={closeMenu}
                  >
                    {t("nav.signIn")}
                  </Link>
                )}
              </div>
            </div>
            <div className="nav-links__footer">SCENTA</div>
          </nav>
        </div>
        <button
          className={`nav-scrim ${isOpen ? "nav-scrim--open" : ""}`.trim()}
          type="button"
          aria-hidden={!isOpen}
          onClick={() => setIsOpen(false)}
        />
      </header>
      <main>
        <div className="container page-fade">{children}</div>
      </main>
      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <span className="brand">{t("brand")}</span>
            <p>{t("footer.blurb")}</p>
          </div>
          <div>
            <strong>{t("footer.about")}</strong>
            <div className="footer__links">
              <Link to="/pages/about">{t("footer.aboutLink")}</Link>
              <Link to="/blog">{t("nav.blog")}</Link>
            </div>
          </div>
          <div>
            <strong>{t("footer.policies")}</strong>
            <div className="footer__links">
              <Link to="/pages/returns">{t("footer.returns")}</Link>
              <Link to="/pages/shipping">{t("footer.shipping")}</Link>
              <Link to="/pages/privacy">{t("footer.privacy")}</Link>
              <Link to="/pages/terms">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="container">
            <span>{t("footer.copyright")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
