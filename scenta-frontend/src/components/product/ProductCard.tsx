import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product } from "../../services/types";
import { resolveResponsiveImageSource } from "../../services/api";
import { pickLocalized, pickLocalizedArray, resolveLocale } from "../../utils/localize";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import NoteBadges from "./NoteBadges";
import StockIndicator from "./StockIndicator";
import { useTheme } from "../../theme/ThemeProvider";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  showStockIndicator?: boolean;
}

const ProductCard = ({ product, onQuickAdd, onQuickView, showStockIndicator = false }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { theme } = useTheme();
  const price = product.variants[0]?.price ?? 0;
  const stock = product.variants[0]?.stock ?? 0;
  const imageSource = resolveResponsiveImageSource(product.images?.[0]);
  const name = pickLocalized(product.name, product.nameAr, locale);
  const notes = pickLocalizedArray(product.notes, product.notesAr, locale);
  const badgeSettings = theme.home?.badges;
  const badgeStyle = badgeSettings
    ? { background: badgeSettings.backgroundColor, color: badgeSettings.textColor }
    : undefined;
  const bestLabel = badgeSettings?.bestLabel ?? t("labels.best");
  const newLabel = badgeSettings?.newLabel ?? t("labels.new");
  const badgePosition = badgeSettings?.position === "top-right" ? "product-card__tags--right" : "";

  return (
    <div className="product-card">
      <div className="product-card__media">
        {imageSource?.src ? (
          <img
            className="product-card__image"
            src={imageSource.src}
            srcSet={imageSource.srcSet}
            alt={name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="product-card__image product-card__image--placeholder" />
        )}
        <div className={`product-card__tags ${badgePosition}`.trim()}>
          {product.flags.new && <Badge label={newLabel} style={badgeStyle} />}
          {product.flags.bestSeller && <Badge label={bestLabel} style={badgeStyle} />}
        </div>
      </div>
      <div className="product-card__body">
        <h3>
          <Link to={`/product/${product.slug}`}>{name}</Link>
        </h3>
        <NoteBadges notes={product.notes} labels={notes} />
        {showStockIndicator ? <StockIndicator stock={stock} /> : null}
        <div className="product-card__footer">
          <span>EGP {price.toLocaleString()}</span>
          <div className="product-card__actions">
            {onQuickView ? (
              <Button
                type="button"
                variant="outline"
                className="product-card__quickview"
                onClick={() => onQuickView(product)}
              >
                <span className="product-card__action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <path
                      d="M12 5c5.5 0 9.5 4.7 10.7 6.4a1 1 0 0 1 0 1.2C21.5 14.3 17.5 19 12 19S2.5 14.3 1.3 12.6a1 1 0 0 1 0-1.2C2.5 9.7 6.5 5 12 5Zm0 2C8 7 4.9 10.1 3.4 12 4.9 13.9 8 17 12 17s7.1-3.1 8.6-5C19.1 10.1 16 7 12 7Zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="product-card__quickview-label">{t("shop.quickView")}</span>
              </Button>
            ) : null}
            <Button className="button--primary product-card__add" type="button" onClick={() => onQuickAdd?.(product)}>
              <span className="product-card__action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path
                    d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 6h13.2l-1.2 7H7.1L6.2 6Zm13.6-2H5.6L4.9 2H2v2h1.6l2.2 11.2A2 2 0 0 0 7.7 17h9.8a2 2 0 0 0 2-1.6L21 4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="product-card__add-label product-card__add-label--long">{t("cta.addToCart")}</span>
              <span className="product-card__add-label product-card__add-label--short">{t("cta.add")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

