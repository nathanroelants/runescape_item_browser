// api.js — RuneScape data via the OSRS Wiki Prices API
// API docs: https://oldschool.runescape.wiki/w/RuneScape_Wiki_API

// The wiki asks you to set a descriptive User-Agent
const HEADERS = {
  'User-Agent': 'RSItemBrowser - student project - Web Advanced course',
};

const MAPPING_URL = 'https://prices.runescape.wiki/api/v1/osrs/mapping';
const PRICES_URL  = 'https://prices.runescape.wiki/api/v1/osrs/latest';

export const CATEGORY_TAGS = {
  'Ammo':      ['arrow', 'bolt', 'dart', 'javelin', 'cannonball'],
  'Armour':    ['helmet', 'platebody', 'platelegs', 'plateskirt', 'shield', 'chainbody',
                'boots', 'gloves', 'coif', 'chaps', 'vambraces', 'tassets', 'blessed d\'hide'],
  'Weapons':   ['sword', 'scimitar', 'dagger', 'mace', 'axe', 'halberd', 'spear',
                'bow', 'crossbow', 'staff', 'wand', 'whip', 'claw', 'hammer', 'maul', 'lance', 'rapier', 'trident'],
  'Potions':   ['potion', 'brew', '(1)', '(2)', '(3)', '(4)'],
  'Runes':     ['rune'],
  'Food':      ['lobster', 'shark', 'swordfish', 'tuna', 'salmon', 'trout', 'cake',
                'bread', 'stew', 'pie', 'karambwan', 'monkfish', 'bass', 'anglerfish', 'manta ray'],
  'Farming':   ['seed', 'sapling', 'compost', 'fruit tree'],
  'Herblore':  ['grimy', 'clean harr', 'clean ranar', 'clean kwuarm', 'unfinished'],
};

const guessCategory = (name) => {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_TAGS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return 'Other';
};

let _itemCache = null;

export const fetchAllItems = async () => {
  if (_itemCache) return _itemCache;

  const [mappingRes, pricesRes] = await Promise.all([
    fetch(MAPPING_URL, { headers: HEADERS }),
    fetch(PRICES_URL,  { headers: HEADERS }),
  ]);

  if (!mappingRes.ok) throw new Error(`Mapping fetch failed: ${mappingRes.status}`);
  if (!pricesRes.ok)  throw new Error(`Prices fetch failed: ${pricesRes.status}`);

  const mappingData = await mappingRes.json();
  const pricesData  = await pricesRes.json();

  const prices = pricesData.data || {};


  const merged = mappingData
    .filter(item => item.name && item.id)
    .map(item => {
      const priceInfo  = prices[item.id] || {};
      const category   = guessCategory(item.name);

      return {
        id:           item.id,
        name:         item.name,
        examine:      item.examine || '',
        members:      item.members || false,
        limit:        item.limit   || null,
        lowalch:      item.lowalch || null,
        highalch:     item.highalch || null,
        icon:         getIconUrl(item.name),
        category,
        priceHigh:    priceInfo.high || null,
        priceLow:     priceInfo.low  || null,
        currentPrice: priceInfo.high || priceInfo.low || null,
      };
    })
    .filter(item => item.currentPrice !== null);

  _itemCache = merged;
  return merged;
};


export const getIconUrl = (name) => {
  const encoded = encodeURIComponent(name.replace(/ /g, '_'));
  return `https://oldschool.runescape.wiki/images/${encoded}_detail.png`;
};


export const formatPrice = (price) => {
  if (!price && price !== 0) return '—';
  return `${Number(price).toLocaleString()} gp`;
};
