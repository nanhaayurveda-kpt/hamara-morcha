export function slugify(text) {
  return (text || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0900-\u097F\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}