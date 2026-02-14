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
          <button className="nav-toggle" type="button" onClick={() => setIsOpen((prev) => !prev)}>
            <span className="nav-toggle__icon" aria-hidden="true">
              <span />
              <span />
              <span />
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
          <nav className={`nav-links ${isOpen ? "nav-links--open" : ""}`.trim()}>
            <Link to="/shop" onClick={closeMenu}>{t("nav.shop")}</Link>
            <Link to="/collections/amber-signature" onClick={closeMenu}>{t("nav.collections")}</Link>
            <Link to="/quiz" onClick={closeMenu}>{t("nav.quiz")}</Link>
            <Link to="/blog" onClick={closeMenu}>{t("nav.blog")}</Link>
            <Link to="/account" onClick={closeMenu}>{t("nav.account")}</Link>
            {user?.role === "admin" && <Link to="/admin" onClick={closeMenu}>{t("nav.admin")}</Link>}
            <Link to="/cart" className="nav-icon nav-icon--cart" onClick={closeMenu}>
              <span className="nav-icon__glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path
                    d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 6h13.2l-1.2 7H7.1L6.2 6Zm13.6-2H5.6L4.9 2H2v2h1.6l2.2 11.2A2 2 0 0 0 7.7 17h9.8a2 2 0 0 0 2-1.6L21 4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="nav-icon__label">{t("nav.cart")}</span>
              <span className="nav-icon__count">{items.length}</span>
            </Link>
            {user ? (
              <button className="button" type="button" onClick={() => { logout(); closeMenu(); }}>
                {t("nav.signOut")}
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="nav-icon nav-icon--account"
                aria-label={t("nav.account")}
                onClick={closeMenu}
              >
                <span className="nav-icon__glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <path
                      d="M12 12a4 4 0 1 0-0.01-8.01A4 4 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="nav-icon__label">{t("nav.account")}</span>
              </Link>
            )}
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
