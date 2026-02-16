import { type MouseEvent, type TouchEvent, useRef, useState } from "react";
import { resolveResponsiveImageSource } from "../../services/api";

interface ProductGalleryProps {
  images: string[];
  name?: string;
}

const ProductGallery = ({ images, name = "Product" }: ProductGalleryProps) => {
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const normalizedImages = images
    .map((image) => resolveResponsiveImageSource(image))
    .filter((image): image is NonNullable<typeof image> => Boolean(image?.src));
  const mainImage = normalizedImages[active] ?? normalizedImages[0];
  const imageCount = normalizedImages.length;

  const handlePrevious = () => {
    setActive((prev) => (prev <= 0 ? imageCount - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setActive((prev) => (prev >= imageCount - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    if (!start || imageCount < 2) {
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }
    if (deltaX > 0) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="product-gallery">
      <div
        className={`product-gallery__main ${isZoomed ? "is-zoomed" : ""}`.trim()}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mainImage && (
          <img
            src={mainImage.src}
            srcSet={mainImage.srcSet}
            alt={name}
            className="product-gallery__image"
            style={{ transformOrigin: zoomOrigin }}
            decoding="async"
            fetchpriority="high"
            sizes="(max-width: 900px) 100vw, 70vw"
          />
        )}
        {imageCount > 1 ? (
          <>
            <button className="product-gallery__nav product-gallery__nav--prev" type="button" onClick={handlePrevious}>
              {"<"}
            </button>
            <button className="product-gallery__nav product-gallery__nav--next" type="button" onClick={handleNext}>
              {">"}
            </button>
            <div className="product-gallery__counter">{`${active + 1}/${imageCount}`}</div>
          </>
        ) : null}
        <button
          className={`product-gallery__zoom ${isZoomed ? "is-active" : ""}`.trim()}
          type="button"
          onClick={() => setIsZoomed((prev) => !prev)}
          aria-label={isZoomed ? "Disable zoom" : "Enable zoom"}
        >
          {isZoomed ? "Zoom out" : "Zoom in"}
        </button>
      </div>
      <div className="product-gallery__thumbs">
        {normalizedImages.map((image, index) => (
          <button
            key={image.src}
            className={`product-gallery__thumb ${active === index ? "is-active" : ""}`}
            onClick={() => {
              setActive(index);
              setIsZoomed(false);
            }}
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
                fetchpriority="low"
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
