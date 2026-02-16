import { useState } from "react";
import { resolveApiAssetUrl } from "../../services/api";

const ProductGallery = ({ images }: { images: string[] }) => {
  const [active, setActive] = useState(0);
  const normalizedImages = images.map((image) => resolveApiAssetUrl(image) ?? image);
  const mainImage = normalizedImages[active] ?? normalizedImages[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {mainImage && (
          <img
            src={mainImage}
            alt="Product"
            className="product-gallery__image"
            decoding="async"
            fetchPriority="high"
          />
        )}
      </div>
      <div className="product-gallery__thumbs">
        {normalizedImages.map((image, index) => (
          <button
            key={image}
            className={`product-gallery__thumb ${active === index ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            type="button"
            aria-label={`View image ${index + 1}`}
          >
            {image && (
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
