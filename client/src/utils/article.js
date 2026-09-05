// Small presentation helpers shared across the article UI.

const AVATAR_COLORS = [
  "from-accent-500 to-violet2",
  "from-violet2 to-primary",
  "from-mint to-accent-500",
  "from-amber2 to-danger",
  "from-primary to-accent-600",
  "from-danger to-violet2",
];

/** Deterministic gradient per name, so an author always looks the same. */
export const avatarGradient = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

export const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/** Turns the stored Quill HTML into plain text for previews. */
export const stripHtml = (html = "") =>
  String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export const excerpt = (html = "", max = 190) => {
  const text = stripHtml(html);
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};

export const readTime = (html = "") => {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** Normalises the tags field, which can arrive as an array or a CSV string. */
export const toTagList = (tags) => {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
};

export const CATEGORY_ICONS = {
  "Front End": "🎨",
  "Back End": "🛠️",
  "Full Stack": "🧩",
  "Programming languages": "💻",
  "Data Structures": "🌳",
  DBMS: "🗄️",
  "Core Subjects": "📚",
  others: "✨",
};
