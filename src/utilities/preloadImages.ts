import convertMediaUrl from './convertMediaUrl';

export function preloadImages(imageUrls: string[]) {
  if (!imageUrls.length) return Promise.reject('no URLs provided');

  const webp = supportsWebP();
  const webm = supportsWebM();

  const promises: Promise<string>[] = [];

  for (let image of imageUrls) {
    const extension = image.split('.').at(-1) || '';
    let url = '';
    if (webm && ['mp4', 'gif'].includes(extension)) {
      url = convertMediaUrl(image);
    } else if (webp) url = convertMediaUrl(image);
    else {
      url = image;
    }

    const p = new Promise<string>((resolve, reject) => {
      fetch(url, { method: 'GET' })
        .then((res) => {
          return res.blob();
        })
        .then(() => {
          return resolve('url loaded: ' + url);
        })
        .catch((err) => {
          console.log('vid err:', err);
          return reject('video error: ' + url);
        });
    });

    promises.push(p);
  }

  return Promise.all(promises);
}

export function supportsWebP() {
  const el = document.createElement('canvas');

  if (el && el.getContext('2d')) {
    const test = el.toDataURL('image/webp');
    return test.indexOf('data:image/webp') === 0;
  } else return false;
}

export function supportsWebM() {
  const el = document.createElement('video');
  return ['maybe', 'probably'].includes(
    el.canPlayType('video/webm; codecs="vp9"')
  );
}
