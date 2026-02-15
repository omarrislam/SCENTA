import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getProduct } from "../../services/catalogService";
import ProductGallery from "../../components/product/ProductGallery";
import Button from "../../components/ui/Button";
import { useCart } from "../../storefront/cart/CartContext";
import ReviewsList from "../../storefront/reviews/ReviewsList";
import useMeta from "../../app/seo/useMeta";
import { useToast } from "../../components/feedback/ToastContext";
import { useWishlist } from "../../storefront/wishlist/WishlistContext";
import { pickLocalized, pickLocalizedArray, resolveLocale } from "../../utils/localize";
import NoteBadges from "../../components/product/NoteBadges";
import Spinner from "../../components/feedback/Spinner";
import StockIndicator from "../../components/product/StockIndicator";

const tabs = ["description", "notes", "specs", "reviews"] as const;

const tabFallbackLabels: Record<(typeof tabs)[number], string> = {
  description: "Description",
  notes: "Notes",
  specs: "Specs",
  reviews: "Reviews"
};

const ProductPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { slug } = useParams();
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const { toggle, items: wishlistItems } = useWishlist();
  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug ?? ""),
    staleTime: 1000 * 60
  });
  const [variantId, setVariantId] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("description");

  const product = data;
  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  }, [product, variantId]);

  const localizedName = product ? pickLocalized(product.name, product.nameAr, locale) : "";
  const localizedDescription = product ? pickLocalized(product.description, product.descriptionAr, locale) : "";
  const localizedNotes = product ? pickLocalizedArray(product.notes, product.notesAr, locale) : [];
  const isWishlisted = product ? wishlistItems.some((entry) => entry.product.id === product.id) : false;

  useMeta(product ? `${localizedName} - SCENTA` : "SCENTA Product");

  if (isLoading) {
    return <Spinner />;
  }

  if (!product || !selectedVariant) {
    return <div className="card">{t("product.loading")}</div>;
  }

  const isOut = (selectedVariant.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if (isOut) {
      pushToast(t("stock.out"), "error");
      return;
    }
    addItem(product, selectedVariant);
    pushToast(t("cta.addedCart"), "success");
  };

  const handleWishlist = async () => {
    await toggle(product, selectedVariant.id);
    pushToast(isWishlisted ? "Removed from wishlist" : t("cta.savedWishlist"), "success");
  };

  return (
    <div className="grid product-detail">
      <ProductGallery images={product.images} />
      <div>
        <h1 className="section-title">{localizedName}</h1>
        <p className="hero__subtitle">{localizedDescription}</p>
        <p>EGP {selectedVariant.price.toLocaleString()}</p>
        <StockIndicator stock={selectedVariant.stock ?? 0} />
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {product.variants.map((variant) => (
            <Button
              key={variant.id}
              type="button"
              className={variant.id === selectedVariant.id ? "button--primary" : ""}
              onClick={() => setVariantId(variant.id)}
            >
              {variant.size}
            </Button>
          ))}
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
          <Button className="button--primary" type="button" onClick={handleAddToCart}>
            {t("cta.addToCart")}
          </Button>
          <button
            className={`icon-button ${isWishlisted ? "icon-button--active" : ""}`}
            type="button"
            onClick={() => void handleWishlist()}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" role="presentation">
              <path
                d="M12 21s-6.7-4.2-9.3-8C.9 10.7 1.2 7.2 4 5.3 6.3 3.7 9.2 4.2 11 6.1l1 1 1-1c1.8-1.9 4.7-2.4 7-0.8 2.8 1.9 3.1 5.4 1.3 7.7C18.7 16.8 12 21 12 21Z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">{t("cta.wishlist")}</span>
          </button>
        </div>
        <div style={{ marginTop: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {tabs.map((key) => (
            <button
              key={key}
              className={`pill ${tab === key ? "button--primary" : ""}`}
              type="button"
              onClick={() => setTab(key)}
            >
              {t(`product.tabs.${key}`) || tabFallbackLabels[key]}
            </button>
          ))}
        </div>
        <div className="card" style={{ marginTop: "16px" }}>
          {tab === "description" && <p>{localizedDescription}</p>}
          {tab === "notes" && <NoteBadges notes={product.notes} labels={localizedNotes} />}
          {tab === "specs" && (
            <ul>
              <li>{t("product.specs.longevity")}</li>
              <li>{t("product.specs.sillage")}</li>
              <li>{t("product.specs.season")}</li>
            </ul>
          )}
          {tab === "reviews" && <ReviewsList productId={product.id} />}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
