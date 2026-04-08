// **
//  * MONTH IMAGES CONFIG
//  * ─────────────────────────────────────────────────────────────────
//  * Drop your 12 images inside /public/months/ folder and update the
//  * paths below. Supported formats: .jpg .jpeg .png .webp
//  *
//  * Example folder structure:
//  *   /public/months/january.jpg
//  *   /public/months/february.jpg
//  *   ... and so on
//  *
//  * Currently using Picsum placeholders — replace each URL with your
//  * actual image path, e.g.: "/months/january.jpg"
//  * ─────────────────────────────────────────────────────────────────
//  */

export const MONTH_IMAGES = [
  // 0 — January
  "https://picsum.photos/seed/jan-mountain-climber/900/520",

  // 1 — February
  "https://picsum.photos/seed/feb-frozen-forest/900/520",

  // 2 — March
  "https://picsum.photos/seed/mar-cherry-blossom/900/520",

  // 3 — April
  "https://picsum.photos/seed/apr-ocean-cliffside/900/520",

  // 4 — May
  "https://picsum.photos/seed/may-desert-sunrise/900/520",

  // 5 — June
  "https://picsum.photos/seed/jun-neon-city/900/520",

  // 6 — July
  "https://picsum.photos/seed/jul-milky-way/900/520",

  // 7 — August
  "https://picsum.photos/seed/aug-green-valley/900/520",

  // 8 — September
  "https://picsum.photos/seed/sep-autumn-road/900/520",

  // 9 — October
  "https://picsum.photos/seed/oct-bioluminescent/900/520",

  // 10 — November
  "https://picsum.photos/seed/nov-frozen-lake/900/520",

  // 11 — December
  "https://picsum.photos/seed/dec-northern-lights/900/520",
];

/** Returns image URL for a given month index (0 = Jan, 11 = Dec) */
export const getMonthImage = (monthIndex) =>
  MONTH_IMAGES[monthIndex] ?? MONTH_IMAGES[0];