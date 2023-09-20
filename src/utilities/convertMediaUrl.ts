export default function convertMediaUrl(mediaUrl: string | undefined) {
  if (!mediaUrl) return '';

  let [base, extension] = mediaUrl.split('.');

  if (['jpeg', 'png', 'jpg'].includes(extension)) return base + '.webp';

  if (['mp4', 'gif'].includes(extension)) return base + '.webm';

  return mediaUrl;
}
