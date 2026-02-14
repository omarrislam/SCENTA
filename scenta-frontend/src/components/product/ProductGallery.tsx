import { useState } from "react";

const ProductGallery = ({ images }: { images: string[] }) => {
  const [active, setActive] = useState(0);
  const mainImage = images[active] ?? images[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {mainImage && <img src={mainImage} alt="Product" className="product-gallery__image" />}
      </div>
      <div className="product-gallery__thumbs">
        {images.map((image, index) => (
          <button
            key={image}
            className={`product-gallery__thumb ${active === index ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            type="button"
            aria-label={`View image ${index + 1}`}
          >
            {image && <img src={image} alt={`Thumbnail ${index + 1}`} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
