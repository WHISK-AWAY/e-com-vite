const BG_IMAGE_COUNT = 34;
const BG_VIDEO_COUNT = 4;

function getRandomIndex(max: number) {
  return Math.ceil(Math.random() * max);
}

export function getRandomBackgroundImage() {
  return `/assets/ingredient-bg/ingredient-bg-${(
    '00' + getRandomIndex(BG_IMAGE_COUNT)
  ).slice(-2)}.jpg`;
}

export function getRandomBackgroundVideo() {
  return `/assets/ingredient-bg/ingredient-bg-vid-${(
    '00' + getRandomIndex(BG_VIDEO_COUNT)
  ).slice(-2)}.mp4`;
}
