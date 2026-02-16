import { useState } from "react";
import { resolveResponsiveImageSource } from "../../services/api";

const ProductGallery = ({ images }: { images: string[] }) => {
  const [active, setActive] = useState(0);
  const normalizedImages = images
    .map((image) => resolveResponsiveImageSource(image))
    .filter((image): image is NonNullable<typeof image> => Boolean(image?.src));
  const mainImage = normalizedImages[active] ?? normalizedImages[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {mainImage && (
          <img
            src={mainImage.src}
            srcSet={mainImage.srcSet}
            alt="Product"
            className="product-gallery__image"
            decoding="async"
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 70vw"
          />
        )}
      </div>
      <div className="product-gallery__thumbs">
        {normalizedImages.map((image, index) => (
          <button
            key={image.src}
            className={`product-gallery__thumb ${active === index ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            type="button"
            aria-label={`View image ${index + 1}`}
          >
            {image && (
              <img
                src={image.src}
                srcSet={image.srcSet}
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                sizes="96px"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
