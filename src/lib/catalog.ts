// Suggestions for the "add a miniature" form. The publishers have no public
// APIs, so this is our own list of well-known miniatures from popular games
// (names only – no images or rules text). Anything can still be typed by hand.
// For D&D we stick to generic and open-licence (SRD) monster names.

export type CatalogEntry = { name: string; faction: string; game: string };

type Factions = Record<string, string[]>;

const warhammer40k: Factions = {
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

const horusHeresy: Factions = {
  "Legiones Astartes": [
    "Legion Tactical Squad",
    "Legion Praetor",
    "Legion Centurion",
    "Legion Assault Squad",
    "Legion Breacher Squad",
    "Legion Veteran Squad",
    "Cataphractii Terminator Squad",
    "Tartaros Terminator Squad",
    "Contemptor Dreadnought",
    "Leviathan Dreadnought",
    "Legion Rhino",
    "Legion Sicaran Battle Tank",
    "Legion Spartan Assault Tank",
    "Legion Land Raider Proteus",
  ],
  Primarchs: [
    "Horus Lupercal",
    "Sanguinius",
    "Rogal Dorn",
    "Leman Russ",
    "Lion El'Jonson",
    "Fulgrim",
    "Konrad Curze",
    "Ferrus Manus",
    "Vulkan",
    "Corvus Corax",
    "Alpharius",
    "Lorgar",
    "Perturabo",
    "Jaghatai Khan",
  ],
  "Solar Auxilia": ["Auxilia Lasrifle Section", "Veletaris Storm Section", "Auxilia Leman Russ", "Malcador Heavy Tank"],
  Mechanicum: ["Thallax Cohort", "Castellax Battle-automata", "Archmagos Prime", "Myrmidon Secutors"],
  "Legio Custodes": ["Custodian Guard Squad", "Sagittarum Custodians", "Constantin Valdor"],
};

const ageOfSigmar: Factions = {
  "Stormcast Eternals": ["Liberators", "Vindictors", "Lord-Celestant", "Lord-Vigilant", "Prosecutors", "Annihilators", "Knight-Arcanum", "Stormdrake Guard"],
  Skaven: ["Clanrats", "Stormvermin", "Grey Seer", "Rat Ogors", "Warlock Engineer", "Hell Pit Abomination", "Plague Monks"],
  Nighthaunt: ["Chainrasps", "Grimghast Reapers", "Knight of Shrouds", "Spirit Hosts", "Bladegheist Revenants", "Lady Olynder"],
  "Orruk Warclans": ["Ardboys", "Orruk Brutes", "Megaboss", "Gore-gruntas", "Savage Orruks", "Kragnos"],
  Seraphon: ["Saurus Warriors", "Skinks", "Slann Starmaster", "Carnosaur", "Stegadon", "Kroxigor"],
  "Soulblight Gravelords": ["Deathrattle Skeletons", "Vampire Lord", "Blood Knights", "Zombie Dragon", "Nagash"],
  "Slaves to Darkness": ["Chaos Warriors", "Chaos Knights", "Chaos Lord", "Varanguard", "Archaon the Everchosen"],
  Sylvaneth: ["Dryads", "Treelord", "Kurnoth Hunters", "Alarielle"],
  "Kharadron Overlords": ["Arkanaut Company", "Grundstok Thunderers", "Arkanaut Frigate"],
  "Idoneth Deepkin": ["Namarti Thralls", "Akhelian Morrsarr Guard", "Eidolon of Mathlann"],
  "Daughters of Khaine": ["Witch Aelves", "Sisters of Slaughter", "Morathi-Khaine"],
  "Flesh-eater Courts": ["Crypt Ghouls", "Crypt Flayers", "Abhorrant Ghoul King"],
  "Ossiarch Bonereapers": ["Mortek Guard", "Kavalos Deathriders", "Katakros"],
  "Gloomspite Gitz": ["Moonclan Stabbas", "Squig Hoppers", "Rockgut Troggoths", "Loonboss"],
  Lumineth: ["Vanari Auralan Wardens", "Vanari Dawnriders", "Teclis"],
  "Blades of Khorne": ["Bloodreavers", "Wrathmongers", "Khorgorath"],
  "Sons of Behemat": ["Mancrusher Gargants", "Kraken-eater Mega-Gargant"],
};

const middleEarth: Factions = {
  "The Fellowship": ["Aragorn", "Gandalf the Grey", "Frodo Baggins", "Samwise Gamgee", "Legolas", "Gimli", "Boromir", "Meriadoc Brandybuck", "Peregrin Took"],
  "Minas Tirith": ["Warriors of Minas Tirith", "Faramir", "Denethor", "Knights of Minas Tirith", "Citadel Guard"],
  Rohan: ["Riders of Rohan", "Warriors of Rohan", "Théoden", "Éowyn", "Éomer", "Gamling"],
  "Lothlórien": ["Galadriel", "Celeborn", "Haldir", "Galadhrim Warriors"],
  Rivendell: ["Elrond", "Arwen", "Glorfindel", "Rivendell Knights"],
  Isengard: ["Saruman", "Uruk-hai Warriors", "Uruk-hai Berserkers", "Lurtz", "Ugluk", "Isengard Troll"],
  Mordor: ["Orc Warriors", "Morannon Orcs", "Mordor Uruk-hai", "The Witch-king of Angmar", "Ringwraiths", "The Mouth of Sauron", "Gothmog", "Mordor Troll", "Sauron"],
  Moria: ["Moria Goblins", "Cave Troll", "The Balrog", "Durbûrz"],
  "Serpent Horde": ["Haradrim Warriors", "War Mûmak of Harad", "Suladân"],
  "The Hobbit": ["Thorin Oakenshield", "Bilbo Baggins", "Bard the Bowman", "Smaug", "Azog", "Bolg"],
};

const starWars: Factions = {
  "Galactic Empire": ["Stormtroopers", "Snowtroopers", "Scout Troopers", "Death Troopers", "Darth Vader", "Emperor Palpatine", "AT-ST", "Royal Guard"],
  "Rebel Alliance": ["Rebel Troopers", "Rebel Commandos", "Luke Skywalker", "Han Solo", "Leia Organa", "Chewbacca", "AT-RT"],
  "Galactic Republic": ["Clone Troopers", "ARC Troopers", "Obi-Wan Kenobi", "Anakin Skywalker", "Yoda", "Ahsoka Tano", "Captain Rex"],
  "Separatist Alliance": ["B1 Battle Droids", "B2 Super Battle Droids", "Droidekas", "General Grievous", "Count Dooku", "Magnaguards"],
  Mandalorians: ["The Mandalorian", "Mandalorian Super Commandos", "Bo-Katan Kryze"],
  "Bounty Hunters": ["Boba Fett", "Jango Fett", "Cad Bane", "Bossk"],
};

const dungeonsAndDragons: Factions = {
  Dragons: ["Red Dragon", "Blue Dragon", "Green Dragon", "Black Dragon", "White Dragon", "Gold Dragon", "Silver Dragon", "Bronze Dragon", "Dragon Wyrmling", "Dracolich"],
  Monsters: ["Owlbear", "Gelatinous Cube", "Mimic", "Troll", "Ogre", "Minotaur", "Manticore", "Basilisk", "Chimera", "Hydra", "Wyvern", "Griffon", "Kraken", "Purple Worm", "Medusa", "Roc"],
  Giants: ["Hill Giant", "Stone Giant", "Frost Giant", "Fire Giant", "Cloud Giant", "Storm Giant"],
  Undead: ["Lich", "Vampire", "Skeleton", "Zombie", "Ghoul", "Wraith", "Mummy Lord", "Death Knight", "Banshee"],
  Humanoids: ["Goblin", "Hobgoblin", "Bugbear", "Orc", "Kobold", "Gnoll", "Lizardfolk", "Drow"],
  Fiends: ["Balor", "Pit Fiend", "Imp", "Hell Hound", "Vrock"],
  Adventurers: ["Fighter", "Wizard", "Rogue", "Cleric", "Ranger", "Paladin", "Barbarian", "Bard", "Druid", "Warlock"],
};

const games: Record<string, Factions> = {
  "Warhammer 40,000": warhammer40k,
  "Horus Heresy": horusHeresy,
  "Age of Sigmar": ageOfSigmar,
  "Middle-earth": middleEarth,
  "Star Wars": starWars,
  "Dungeons & Dragons": dungeonsAndDragons,
};

export const gameNames = Object.keys(games);

export const catalog: CatalogEntry[] = Object.entries(games).flatMap(([game, factionsOfGame]) =>
  Object.entries(factionsOfGame).flatMap(([faction, names]) =>
    names.map((name) => ({ name, faction, game })),
  ),
);

export const factions = [...new Set(catalog.map((entry) => entry.faction))].sort((a, b) =>
  a.localeCompare(b),
);

// Lower case, without accents and punctuation, so "kahl" finds "Kâhl" and
// "belakor" finds "Be'lakor"
function normalise(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’-]/g, "")
    .toLowerCase();
}

// Every word of the search must appear in the miniature's name, faction or game.
// Better matches come first, so "dragon" lists Red Dragon before every
// Dungeons & Dragons monster:
//   0 – the name starts with the search
//   1 – every word is in the name
//   2 – every word is in the name or faction
//   3 – a word only matched the game
export function searchCatalog(query: string, limit = 8): CatalogEntry[] {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const whole = words.join(" ");

  return catalog
    .map((entry) => {
      const name = normalise(entry.name);
      const faction = normalise(entry.faction);
      const game = normalise(entry.game);
      const inName = (word: string) => name.includes(word);
      const inFaction = (word: string) => inName(word) || faction.includes(word);
      const anywhere = (word: string) => inFaction(word) || game.includes(word);

      if (!words.every(anywhere)) return null;
      const rank =
        name.startsWith(whole) ? 0
        : words.every(inName) ? 1
        : words.every(inFaction) ? 2
        : 3;
      return { entry, rank };
    })
    .filter((match) => match !== null)
    .sort((a, b) => a.rank - b.rank || a.entry.name.localeCompare(b.entry.name))
    .slice(0, limit)
    .map(({ entry }) => entry);
}
