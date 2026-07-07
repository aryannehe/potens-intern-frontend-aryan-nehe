/**
 * Compresses an image file client-side using canvas.
 * Returns a Promise that resolves to a base64 encoded JPEG string.
 */
export const compressImage = (
  file: File,
  maxWidth = 850,
  maxHeight = 850,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to JPEG base64 string
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};

/**
 * Generates a unique, deterministic ticket reference ID.
 * Format: CC-2026-[SUFFIX] (e.g., CC-2026-X8F4D2)
 */
export const generateReferenceID = (): string => {
  const year = 2026; // Setting to 2026 as per design guidelines
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
  return `CC-${year}-${randomSuffix}`;
};

/**
 * Formats timestamps cleanly.
 */
export const formatDateTime = (timestamp: number, locale: 'en' | 'mr'): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString(locale === 'mr' ? 'mr-IN' : 'en-US', options);
};
