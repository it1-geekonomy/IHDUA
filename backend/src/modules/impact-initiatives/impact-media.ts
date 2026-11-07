/**
 * R2 key prefix for section images, icons and videos uploaded from the
 * Our Impact page editor (frontend /api/website-images with folder=impact).
 * Only files under this prefix are ever cleaned up by the backend; the rest
 * of website/ is the shared image library.
 */
export const IMPACT_MEDIA_PREFIX = 'website/impact/';

/** Every distinct string inside page content that is an Our Impact media URL. */
export function collectImpactMediaUrls(
  content: unknown,
  publicUrl: string,
): Set<string> {
  const base = `${publicUrl.replace(/\/$/, '')}/${IMPACT_MEDIA_PREFIX}`;
  const urls = new Set<string>();

  const walk = (value: unknown) => {
    if (typeof value === 'string') {
      if (value.startsWith(base)) urls.add(value);
    } else if (Array.isArray(value)) {
      value.forEach(walk);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(walk);
    }
  };

  walk(content);
  return urls;
}
