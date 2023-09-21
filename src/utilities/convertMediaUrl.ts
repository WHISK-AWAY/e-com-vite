export default function convertMediaUrl(mediaUrl: string | undefined) {
    if (!mediaUrl) return '';

    let [base, extension] = mediaUrl.split('.');

    let convertedUrl = '';

    if (['jpeg', 'png', 'jpg'].includes(extension))
        convertedUrl = base + '.webp';

    if (['mp4', 'gif'].includes(extension)) convertedUrl = base + '.webm';

    return convertedUrl;
}
