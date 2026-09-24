import { useState } from "react";
import { BagIcon } from "../ui/Icons";

/**
 * Product photo with a neutral fallback for missing or broken image URLs.
 * The fallback is announced with the same alt text so nothing is lost.
 */
export default function ProductImage({ src, alt, className = "" }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const hasImage = Boolean(src) && failedSrc !== src;

  if (!hasImage) {
    return (
      <div className={`product-image product-image--fallback ${className}`} role="img" aria-label={alt}>
        <BagIcon size={32} />
      </div>
    );
  }

  return (
    <img
      className={`product-image ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
