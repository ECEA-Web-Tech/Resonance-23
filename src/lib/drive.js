export const driveId = (url) => url?.match(/\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/)?.slice(1).find(Boolean);

// Turns a Google Drive share link into a direct, resizable image URL. Other URLs pass through.
export function driveImg(url, width = 800) {
  const id = driveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${width}` : url;
}
