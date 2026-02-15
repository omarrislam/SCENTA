import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product } from "../../services/types";
import { resolveApiAssetUrl } from "../../services/api";
import { pickLocalized, pickLocalizedArray, resolveLocale } from "../../utils/localize";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import NoteBadges from "./NoteBadges";
import StockIndicator from "./StockIndicator";
import { useTheme } from "../../theme/ThemeProvider";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickAdd }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { theme } = useTheme();
  const price = product.variants[0]?.price ?? 0;
  const stock = product.variants[0]?.stock ?? 0;
  const imageUrl = resolveApiAssetUrl(product.images?.[0]) ?? product.images?.[0];
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
        {imageUrl ? (
          <img className="product-card__image" src={imageUrl} alt={name} loading="lazy" />
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
        <StockIndicator stock={stock} />
        <div className="product-card__footer">
          <span>EGP {price.toLocaleString()}</span>
          <div className="product-card__actions">
            <Button className="button--primary" type="button" onClick={() => onQuickAdd?.(product)}>
              {t("cta.addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
