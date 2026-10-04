// Turns a Google Drive share link into a direct, resizable image URL. Other URLs pass through.
export function driveImg(url, width = 800) {
  const id = url?.match(/\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/);
  return id ? `https://drive.google.com/thumbnail?id=${id[1] || id[2]}&sz=w${width}` : url;
}
