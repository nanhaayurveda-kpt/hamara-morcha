import { transliterate } from "@indic-tools/hindi-transliterate";

export function slugify(text) {
  return transliterate(text || "", false) // हिन्दी → Roman (casual mode)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // सिर्फ़ Roman अक्षर, अंक, space, hyphen रखो
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}