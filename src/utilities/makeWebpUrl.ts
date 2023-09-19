export default function makeWebpUrl(imageUrl: string) {
  let [base, extension] = imageUrl.split('.');

  if (!['jpeg', 'png', 'jpg'].includes(extension)) return imageUrl;

  return base + '.webp';
}
