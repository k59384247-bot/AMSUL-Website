// Full-resolution originals remain available when the screen needs them.
export function landingImageSrcSet(src: string, fullWidth = src.includes("impact-2.jpg") ? 3240 : 2738) {
  return `${src.replace(/\.jpg$/, "-mobile.webp")} 1200w, ${src} ${fullWidth}w`;
}
