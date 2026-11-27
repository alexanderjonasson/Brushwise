// Our own list of popular hobby paints. The makers have no public APIs, so the
// names are typed in by hand and the colours are approximations for showing a
// swatch and finding a near match – not exact colour data.

export const brands = ["Citadel", "Vallejo", "The Army Painter"] as const;
export type Brand = (typeof brands)[number];

export const paintTypes = [
  "base",
  "layer",
  "shade",
  "contrast",
  "metallic",
  "technical",
] as const;
export type PaintType = (typeof paintTypes)[number];

export type Paint = {
  id: string;
  brand: Brand;
  name: string;
  type: PaintType;
  hex: string;
};

// [name, type, hex] per brand
type Row = [string, PaintType, string];

const citadel: Row[] = [
  ["Abaddon Black", "base", "#231f20"],
  ["Corax White", "base", "#f2f2f2"],
  ["Mephiston Red", "base", "#9a1115"],
  ["Khorne Red", "base", "#6a0001"],
  ["Macragge Blue", "base", "#0d407f"],
  ["Kantor Blue", "base", "#02134e"],
  ["Thousand Sons Blue", "base", "#18abcc"],
  ["Caliban Green", "base", "#00401f"],
  ["Castellan Green", "base", "#314821"],
  ["Death Guard Green", "base", "#6d774d"],
  ["Waaagh! Flesh", "base", "#1e4d2b"],
  ["Averland Sunset", "base", "#fbb81c"],
  ["Jokaero Orange", "base", "#ee3823"],
  ["Naggaroth Night", "base", "#3b2b50"],
  ["Daemonette Hide", "base", "#696684"],
  ["Screamer Pink", "base", "#7c1645"],
  ["Rakarth Flesh", "base", "#a29e91"],
  ["Bugman's Glow", "base", "#834f44"],
  ["Mournfang Brown", "base", "#640909"],
  ["Rhinox Hide", "base", "#462f30"],
  ["Dryad Bark", "base", "#33312d"],
  ["Steel Legion Drab", "base", "#5e5134"],
  ["Zandri Dust", "base", "#9e915c"],
  ["Wraithbone", "base", "#dbd1b2"],
  ["Grey Seer", "base", "#a2a5a7"],
  ["Mechanicus Standard Grey", "base", "#3d4b4d"],
  ["Celestra Grey", "base", "#90a8a8"],
  ["Evil Sunz Scarlet", "layer", "#c01411"],
  ["Wild Rider Red", "layer", "#ea2f28"],
  ["Troll Slayer Orange", "layer", "#f36d14"],
  ["Yriel Yellow", "layer", "#ffda00"],
  ["Flash Gitz Yellow", "layer", "#fff300"],
  ["Calgar Blue", "layer", "#2a497f"],
  ["Hoeth Blue", "layer", "#4c78af"],
  ["Teclis Blue", "layer", "#3877bf"],
  ["Lothern Blue", "layer", "#34a2cf"],
  ["Baharroth Blue", "layer", "#58c1cd"],
  ["Warpstone Glow", "layer", "#1e7331"],
  ["Moot Green", "layer", "#3daf44"],
  ["Genestealer Purple", "layer", "#7658a5"],
  ["Pink Horror", "layer", "#90305d"],
  ["Emperor's Children", "layer", "#b74073"],
  ["Cadian Fleshtone", "layer", "#c47652"],
  ["Kislev Flesh", "layer", "#d6a875"],
  ["Skrag Brown", "layer", "#8b4806"],
  ["Tau Light Ochre", "layer", "#bc6b10"],
  ["Ushabti Bone", "layer", "#bbbb7f"],
  ["Screaming Skull", "layer", "#d2d29d"],
  ["Pallid Wych Flesh", "layer", "#cdcebe"],
  ["Ulthuan Grey", "layer", "#c7e0d9"],
  ["Administratum Grey", "layer", "#949b95"],
  ["Dawnstone", "layer", "#697068"],
  ["Eshin Grey", "layer", "#484b4e"],
  ["Skavenblight Dinge", "layer", "#47413b"],
  ["Fenrisian Grey", "layer", "#6d94b3"],
  ["White Scar", "layer", "#ffffff"],
  ["Nuln Oil", "shade", "#14100e"],
  ["Agrax Earthshade", "shade", "#5a3e24"],
  ["Reikland Fleshshade", "shade", "#ca6c4d"],
  ["Seraphim Sepia", "shade", "#d7824b"],
  ["Druchii Violet", "shade", "#7a468c"],
  ["Carroburg Crimson", "shade", "#a82a70"],
  ["Drakenhof Nightshade", "shade", "#125899"],
  ["Biel-Tan Green", "shade", "#1ba169"],
  ["Athonian Camoshade", "shade", "#6d8e44"],
  ["Casandora Yellow", "shade", "#fece5a"],
  ["Fuegan Orange", "shade", "#c77958"],
  ["Coelia Greenshade", "shade", "#0e7f78"],
  ["Black Templar", "contrast", "#1c1c1c"],
  ["Blood Angels Red", "contrast", "#9a1b1b"],
  ["Ultramarines Blue", "contrast", "#1f3e7a"],
  ["Leviadon Blue", "contrast", "#1a2a52"],
  ["Ork Flesh", "contrast", "#3f6b1c"],
  ["Iyanden Yellow", "contrast", "#d9a81c"],
  ["Gryph-hound Orange", "contrast", "#c95a15"],
  ["Snakebite Leather", "contrast", "#8a5a25"],
  ["Wyldwood", "contrast", "#4a3424"],
  ["Skeleton Horde", "contrast", "#a68a5a"],
  ["Shyish Purple", "contrast", "#4b2a5e"],
  ["Basilicanum Grey", "contrast", "#3a3d40"],
  ["Apothecary White", "contrast", "#c9d3d8"],
  ["Guilliman Flesh", "contrast", "#b67a5c"],
  ["Darkoath Flesh", "contrast", "#7a4632"],
  ["Leadbelcher", "metallic", "#888d8f"],
  ["Ironbreaker", "metallic", "#a1a6a9"],
  ["Stormhost Silver", "metallic", "#d4d8db"],
  ["Retributor Armour", "metallic", "#c39e5a"],
  ["Balthasar Gold", "metallic", "#a47552"],
  ["Auric Armour Gold", "metallic", "#e8bc6d"],
  ["Liberator Gold", "metallic", "#d0b67a"],
  ["Nihilakh Oxide", "technical", "#66b39a"],
  ["Typhus Corrosion", "technical", "#463d2b"],
  ["Blood for the Blood God", "technical", "#6a0001"],
  ["Agrellan Earth", "technical", "#a17f5b"],
  ["Stirland Mud", "technical", "#492b00"],
  ["Tesseract Glow", "technical", "#5ef34f"],
  ["Lahmian Medium", "technical", "#f1f1ee"],
];

const vallejo: Row[] = [
  ["Black", "base", "#1b1b1b"],
  ["Dead White", "base", "#f5f5f0"],
  ["Bloody Red", "base", "#a8141e"],
  ["Scarlet Red", "base", "#c62a23"],
  ["Hot Orange", "base", "#e8571e"],
  ["Sun Yellow", "base", "#f6c900"],
  ["Gold Yellow", "base", "#f4a21c"],
  ["Imperial Blue", "base", "#1d2f63"],
  ["Ultramarine Blue", "base", "#25438b"],
  ["Magic Blue", "base", "#2d6aa6"],
  ["Electric Blue", "layer", "#4a8fc4"],
  ["Goblin Green", "base", "#3e7b2e"],
  ["Sick Green", "base", "#2e6b3a"],
  ["Scorpy Green", "layer", "#6cb33e"],
  ["Warlord Purple", "base", "#7a2350"],
  ["Squid Pink", "layer", "#c76a85"],
  ["Hexed Lichen", "base", "#473268"],
  ["Charred Brown", "base", "#3b2a22"],
  ["Beasty Brown", "base", "#62402b"],
  ["Leather Brown", "base", "#7a4c2c"],
  ["Bone White", "layer", "#d8cfa8"],
  ["Dwarf Skin", "base", "#b87d5a"],
  ["Elf Skintone", "layer", "#dba98a"],
  ["Stonewall Grey", "layer", "#a6a69e"],
  ["Cold Grey", "base", "#5b6870"],
  ["German Grey", "base", "#3a3f42"],
  ["Neutral Grey", "layer", "#7c7f80"],
  ["Flat Earth", "base", "#6e4f34"],
  ["Ivory", "layer", "#ece3c7"],
  ["Prussian Blue", "base", "#1f3a5f"],
  ["Black Shade", "shade", "#141414"],
  ["Sepia Shade", "shade", "#6e4a2a"],
  ["Flesh Shade", "shade", "#b06a4a"],
  ["Red Shade", "shade", "#7a1a28"],
  ["Blue Shade", "shade", "#1e4a85"],
  ["Green Shade", "shade", "#2a6a3a"],
  ["Purple Shade", "shade", "#5a2e6e"],
  ["Silver", "metallic", "#c9ccce"],
  ["Gunmetal Metal", "metallic", "#6f7477"],
  ["Polished Gold", "metallic", "#d1a85c"],
  ["Brassy Brass", "metallic", "#b08a4a"],
];

const armyPainter: Row[] = [
  ["Matt Black", "base", "#1c1c1c"],
  ["Matt White", "base", "#f4f4f2"],
  ["Pure Red", "base", "#b5121b"],
  ["Dragon Red", "base", "#7a1a1e"],
  ["Lava Orange", "base", "#e45a1f"],
  ["Daemonic Yellow", "base", "#f5cc11"],
  ["Ultramarine Blue", "base", "#203f8a"],
  ["Crystal Blue", "layer", "#3d8ac9"],
  ["Greenskin", "base", "#3d7a2b"],
  ["Angel Green", "base", "#1d4d2a"],
  ["Alien Purple", "base", "#5a2e6e"],
  ["Leather Brown", "base", "#6e4527"],
  ["Oak Brown", "base", "#4a3020"],
  ["Skeleton Bone", "layer", "#d6c99b"],
  ["Barbarian Flesh", "layer", "#d39b7a"],
  ["Uniform Grey", "base", "#5f6669"],
  ["Ash Grey", "layer", "#b7bab7"],
  ["Hardened Carapace", "base", "#2d2a28"],
  ["Dark Tone", "shade", "#151312"],
  ["Strong Tone", "shade", "#5c3f22"],
  ["Soft Tone", "shade", "#9a6a3d"],
  ["Red Tone", "shade", "#7d1d29"],
  ["Blue Tone", "shade", "#1d4580"],
  ["Green Tone", "shade", "#295f33"],
  ["Purple Tone", "shade", "#58306a"],
  ["Plate Mail Metal", "metallic", "#9a9fa2"],
  ["Shining Silver", "metallic", "#cdd0d2"],
  ["Gun Metal", "metallic", "#6c7174"],
  ["Greedy Gold", "metallic", "#c9a252"],
];

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function build(brand: Brand, rows: Row[]): Paint[] {
  return rows.map(([name, type, hex]) => ({ id: slug(`${brand} ${name}`), brand, name, type, hex }));
}

export const paints: Paint[] = [
  ...build("Citadel", citadel),
  ...build("Vallejo", vallejo),
  ...build("The Army Painter", armyPainter),
];

const byId = new Map(paints.map((paint) => [paint.id, paint]));

export function getPaint(id: string): Paint | undefined {
  return byId.get(id);
}

// For the AI schema: every id the model is allowed to answer with
export const paintIds = paints.map((paint) => paint.id) as [string, ...string[]];

export function searchPaints(query: string, brand?: Brand, limit = 8): Paint[] {
  const words = slug(query).split("-").filter(Boolean);
  if (words.length === 0) return [];

  return paints
    .filter((paint) => !brand || paint.brand === brand)
    .filter((paint) => {
      const text = slug(`${paint.name} ${paint.brand} ${paint.type}`);
      return words.every((word) => text.includes(word));
    })
    .sort((a, b) => {
      const aStarts = slug(a.name).startsWith(words.join("-")) ? 0 : 1;
      const bStarts = slug(b.name).startsWith(words.join("-")) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

function rgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

// How far apart two colours look. Weighted RGB ("redmean"), which follows
// the eye better than plain RGB and is plenty for picking a near swatch.
export function colourDistance(a: string, b: string): number {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const meanRed = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(
    (2 + meanRed / 256) * dr * dr + 4 * dg * dg + (2 + (255 - meanRed) / 256) * db * db,
  );
}

// Types that can stand in for each other when looking for an equivalent
const compatible: Record<PaintType, PaintType[]> = {
  base: ["base", "layer"],
  layer: ["layer", "base"],
  shade: ["shade"],
  contrast: ["contrast", "shade"],
  metallic: ["metallic"],
  technical: ["technical"],
};

// The paint from a brand (or from a set of paints, like the user's own) that
// looks closest to the given one and works the same way. With maxDistance,
// nothing is returned unless the colours are genuinely close.
export function nearestPaint(
  paint: Paint,
  candidates: Paint[],
  maxDistance = Infinity,
): Paint | undefined {
  const types = compatible[paint.type];
  return candidates
    .filter((candidate) => candidate.id !== paint.id && types.includes(candidate.type))
    .map((candidate) => ({ candidate, distance: colourDistance(paint.hex, candidate.hex) }))
    .filter(({ distance }) => distance <= maxDistance)
    // Same type first, then by colour
    .map(({ candidate, distance }) => ({
      candidate,
      score: distance + (candidate.type === paint.type ? 0 : 60),
    }))
    .sort((a, b) => a.score - b.score)[0]?.candidate;
}

// How close an owned paint must be to stand in for a missing one
export const CLOSE_ENOUGH = 90;

export function paintsByBrand(brand: Brand): Paint[] {
  return paints.filter((paint) => paint.brand === brand);
}
