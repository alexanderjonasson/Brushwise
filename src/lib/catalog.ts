// Suggestions for the "add a miniature" form. Games Workshop has no public API,
// so this is our own short list of well-known Warhammer 40,000 units (names
// only – no images or rules text). Anything can still be typed by hand.

export type CatalogEntry = { name: string; faction: string };

const units: Record<string, string[]> = {
  "Space Marines": [
    "Intercessor Squad",
    "Intercessor Sergeant",
    "Assault Intercessor Squad",
    "Captain",
    "Captain in Terminator Armour",
    "Librarian",
    "Chaplain",
    "Lieutenant",
    "Apothecary",
    "Hellblaster Squad",
    "Aggressor Squad",
    "Eradicator Squad",
    "Inceptor Squad",
    "Terminator Squad",
    "Scout Squad",
    "Redemptor Dreadnought",
    "Ballistus Dreadnought",
    "Repulsor",
    "Gladiator Lancer",
    "Land Raider",
    "Predator Destructor",
    "Marneus Calgar",
    "Roboute Guilliman",
  ],
  "Chaos Space Marines": [
    "Legionaries",
    "Chaos Lord",
    "Chaos Terminators",
    "Cultist Mob",
    "Havocs",
    "Possessed",
    "Master of Possession",
    "Dark Apostle",
    "Helbrute",
    "Forgefiend",
    "Maulerfiend",
    "Chaos Predator",
    "Abaddon the Despoiler",
  ],
  "Chaos Daemons": [
    "Be'lakor",
    "Bloodletters",
    "Bloodthirster",
    "Skarbrand",
    "Plaguebearers",
    "Great Unclean One",
    "Pink Horrors",
    "Lord of Change",
    "Kairos Fateweaver",
    "Daemonettes",
    "Keeper of Secrets",
    "Flesh Hounds",
    "Soul Grinder",
  ],
  "Death Guard": [
    "Plague Marines",
    "Mortarion",
    "Typhus",
    "Lord of Contagion",
    "Blightlord Terminators",
    "Deathshroud Terminators",
    "Poxwalkers",
    "Foetid Bloat-drone",
    "Plagueburst Crawler",
  ],
  "Thousand Sons": ["Rubric Marines", "Magnus the Red", "Ahriman", "Exalted Sorcerer", "Scarab Occult Terminators", "Tzaangors"],
  "World Eaters": ["Khorne Berzerkers", "Angron", "Kharn the Betrayer", "Lord on Juggernaut", "Eightbound", "Jakhals"],
  Tyranids: [
    "Hive Tyrant",
    "Winged Hive Tyrant",
    "Swarmlord",
    "Termagants",
    "Hormagaunts",
    "Genestealers",
    "Tyranid Warriors",
    "Carnifex",
    "Screamer-Killer",
    "Lictor",
    "Neurotyrant",
    "Zoanthropes",
    "Exocrine",
    "Tyrannofex",
    "Norn Emissary",
    "Norn Assimilator",
    "Hierophant Bio-titan",
    "Ripper Swarms",
  ],
  "Genestealer Cults": ["Neophyte Hybrids", "Acolyte Hybrids", "Patriarch", "Magus", "Primus", "Aberrants", "Goliath Truck"],
  Necrons: [
    "Necron Warriors",
    "Immortals",
    "Overlord",
    "Royal Warden",
    "Skorpekh Destroyers",
    "Lokhust Destroyers",
    "Canoptek Scarab Swarms",
    "Canoptek Wraiths",
    "Doomsday Ark",
    "Monolith",
    "Silent King",
    "Imotekh the Stormlord",
  ],
  Orks: [
    "Boyz",
    "Warboss",
    "Beast Snagga Boyz",
    "Nobz",
    "Meganobz",
    "Gretchin",
    "Weirdboy",
    "Painboy",
    "Deff Dread",
    "Killa Kans",
    "Battlewagon",
    "Stompa",
    "Ghazghkull Thraka",
  ],
  "T'au Empire": [
    "Strike Team",
    "Breacher Team",
    "Pathfinder Team",
    "Commander in Coldstar Battlesuit",
    "Crisis Battlesuits",
    "Stealth Battlesuits",
    "Broadside Battlesuits",
    "Riptide Battlesuit",
    "Hammerhead Gunship",
    "Devilfish",
    "Kroot Carnivores",
  ],
  Aeldari: [
    "Guardian Defenders",
    "Dire Avengers",
    "Howling Banshees",
    "Striking Scorpions",
    "Fire Dragons",
    "Farseer",
    "Autarch",
    "Wraithguard",
    "Wraithlord",
    "Wave Serpent",
    "Fire Prism",
    "Avatar of Khaine",
  ],
  Drukhari: ["Kabalite Warriors", "Wyches", "Archon", "Succubus", "Incubi", "Raider", "Ravager", "Talos"],
  "Astra Militarum": [
    "Cadian Shock Troops",
    "Catachan Jungle Fighters",
    "Infantry Squad",
    "Cadian Command Squad",
    "Kasrkin",
    "Ogryns",
    "Leman Russ Battle Tank",
    "Chimera",
    "Sentinel",
    "Basilisk",
    "Baneblade",
    "Lord Solar Leontus",
  ],
  "Adeptus Custodes": ["Custodian Guard", "Shield-Captain", "Allarus Custodians", "Custodian Wardens", "Vertus Praetors", "Trajann Valoris"],
  "Adepta Sororitas": [
    "Battle Sister Squad",
    "Canoness",
    "Seraphim Squad",
    "Retributor Squad",
    "Penitent Engines",
    "Paragon Warsuits",
    "Morvenn Vahl",
    "Exorcist",
  ],
  "Adeptus Mechanicus": ["Skitarii Rangers", "Skitarii Vanguard", "Tech-Priest Dominus", "Kataphron Destroyers", "Kastelan Robots", "Onager Dunecrawler", "Belisarius Cawl"],
  "Grey Knights": ["Strike Squad", "Grand Master", "Paladin Squad", "Nemesis Dreadknight", "Brotherhood Terminator Squad"],
  "Dark Angels": ["Deathwing Knights", "Ravenwing Black Knights", "Inner Circle Companions", "Lion El'Jonson", "Azrael"],
  "Blood Angels": ["Death Company Marines", "Sanguinary Guard", "Sanguinary Priest", "Commander Dante", "Mephiston"],
  "Space Wolves": ["Blood Claws", "Wolf Guard Terminators", "Thunderwolf Cavalry", "Logan Grimnar", "Bjorn the Fell-Handed"],
  "Imperial Knights": ["Knight Paladin", "Knight Errant", "Knight Castellan", "Armiger Warglaive", "Armiger Helverin"],
  "Leagues of Votann": ["Hearthkyn Warriors", "Einhyr Hearthguard", "Kâhl", "Brôkhyr Thunderkyn", "Sagitaur", "Hekaton Land Fortress"],
};

export const catalog: CatalogEntry[] = Object.entries(units).flatMap(([faction, names]) =>
  names.map((name) => ({ name, faction })),
);

export const factions = Object.keys(units).sort((a, b) => a.localeCompare(b));

// Lower case, without accents and punctuation, so "kahl" finds "Kâhl" and
// "belakor" finds "Be'lakor"
function normalise(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’-]/g, "")
    .toLowerCase();
}

// Every word of the search must appear in the unit's name or faction.
// Names that start with the search come first, then alphabetical.
export function searchCatalog(query: string, limit = 8): CatalogEntry[] {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const first = words.join(" ");

  return catalog
    .map((entry) => ({ entry, name: normalise(entry.name), faction: normalise(entry.faction) }))
    .filter(({ name, faction }) => words.every((word) => name.includes(word) || faction.includes(word)))
    .sort((a, b) => {
      const aStarts = a.name.startsWith(first) ? 0 : 1;
      const bStarts = b.name.startsWith(first) ? 0 : 1;
      return aStarts - bStarts || a.entry.name.localeCompare(b.entry.name);
    })
    .slice(0, limit)
    .map(({ entry }) => entry);
}
