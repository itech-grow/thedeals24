import React, { useState } from 'react';

interface ProductImageProps {
  imageSrc: string;
  category?: 'electronics' | 'fashion' | 'travel' | 'grocery' | 'software' | 'others' | string;
  alt?: string;
  className?: string;
  emojiClassName?: string;
}

export default function ProductImage({
  imageSrc,
  category = 'others',
  alt = 'Product Image',
  className = 'w-full h-full object-contain',
  emojiClassName = 'text-6xl select-none',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const getCategoryEmoji = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'electronics': return '💻';
      case 'fashion': return '👟';
      case 'travel': return '✈️';
      case 'grocery': return '🍎';
      case 'software': return '💾';
      default: return '📦';
    }
  };

  const isUrl = (
    imageSrc.startsWith('http://') ||
    imageSrc.startsWith('https://') ||
    imageSrc.startsWith('/') ||
    imageSrc.startsWith('data:') ||
    imageSrc.startsWith('blob:') ||
    /\.(jpg|jpeg|png|webp|gif|svg|bmp)/i.test(imageSrc)
  );

  if (isUrl && !hasError) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback to emoji
  const emoji = isUrl ? getCategoryEmoji(category) : (imageSrc || getCategoryEmoji(category));
  return (
    <span className={emojiClassName} role="img" aria-label={alt}>
      {emoji}
    </span>
  );
}
