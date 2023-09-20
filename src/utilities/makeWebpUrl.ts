export default function makeWebpUrl(imageUrl: string | undefined) {
  if (!imageUrl) return '';

  let [base, extension] = imageUrl.split('.');

  if (!['jpeg', 'png', 'jpg'].includes(extension)) return imageUrl;

  return base + '.webp';
}
