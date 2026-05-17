/* =============================================
   API-CONFIGURATIE
   ============================================= */

/* Verplichte User-Agent header voor de RuneScape Wiki API
   (vereist door hun beleid voor eerlijk gebruik) */
const HEADERS = {
  'User-Agent': 'RSItemBrowser - student project - Web Advanced course',
};

/* Eindpunt voor itemnamen, ID's en basiseigenschappen */
const MAPPING_URL = 'https://prices.runescape.wiki/api/v1/osrs/mapping';
/* Eindpunt voor de laatste Grand Exchange-prijzen */
const PRICES_URL  = 'https://prices.runescape.wiki/api/v1/osrs/latest';


/* =============================================
   CATEGORIE-MAPPING
   ============================================= */

/* Trefwoorden per categorie om items automatisch in te delen.
   Een item valt in een categorie als zijn naam één van de
   bijbehorende trefwoorden bevat (hoofdletterongevoelig). */
export const CATEGORY_TAGS = {
  'Ammo':      ['arrow', 'bolt', 'dart', 'javelin', 'cannonball'],
  'Armour':    ['helmet', 'platebody', 'platelegs', 'plateskirt', 'shield', 'chainbody',
                'boots', 'gloves', 'coif', 'chaps', 'vambraces', 'tassets'],
  'Weapons':   ['sword', 'scimitar', 'dagger', 'mace', 'axe', 'halberd', 'spear',
                'bow', 'crossbow', 'staff', 'wand', 'whip', 'claw', 'hammer', 'maul'],
  'Potions':   ['potion', 'brew', '(1)', '(2)', '(3)', '(4)'],
  'Runes':     ['rune'],
  'Food':      ['lobster', 'shark', 'swordfish', 'tuna', 'salmon', 'cake', 'pie', 'karambwan', 'monkfish', 'anglerfish'],
  'Farming':   ['seed', 'sapling', 'compost'],
  'Herblore':  ['grimy', 'unfinished'],
};

/* Bepaalt de categorie van een item op basis van zijn naam.
   Loopt door alle categorieën en geeft de eerste match terug.
   Geeft 'Other' terug als geen enkel trefwoord overeenkomt. */
const guessCategory = (name) => {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_TAGS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return 'Other';
};


/* =============================================
   DATA OPHALEN
   ============================================= */

/* Cache voor de samengevoegde itemlijst.
   Null zolang de data nog niet geladen is. */
let _itemCache = null;

/* Haalt alle items op van de RuneScape Wiki API en combineert
   mapping- en prijsdata tot één lijst van itemobjecten.
   Resultaten worden gecached zodat de API slechts één keer
   per sessie wordt aangeroepen. */
export const fetchAllItems = async () => {
  /* Geef de gecachede data terug als die al beschikbaar is */
  if (_itemCache) return _itemCache;

  /* Haal mapping en prijzen tegelijk op voor betere performantie */
  const [mappingRes, pricesRes] = await Promise.all([
    fetch(MAPPING_URL, { headers: HEADERS }),
    fetch(PRICES_URL,  { headers: HEADERS }),
  ]);

  /* Gooi een fout als één van de verzoeken mislukt */
  if (!mappingRes.ok) throw new Error(`Mapping fetch failed: ${mappingRes.status}`);
  if (!pricesRes.ok)  throw new Error(`Prices fetch failed: ${pricesRes.status}`);

  const mappingData = await mappingRes.json();
  const pricesData  = await pricesRes.json();
  /* Gebruik een leeg object als fallback als er geen prijsdata is */
  const prices      = pricesData.data || {};

  const merged = mappingData
    /* Verwijder items zonder naam of ID (ongeldige entries) */
    .filter(item => item.name && item.id)
    .map(item => {
      /* Zoek de prijsinfo op via het item-ID; leeg object als fallback */
      const priceInfo = prices[item.id] || {};
      return {
        id:           item.id,
        name:         item.name,
        examine:      item.examine  || '',    /* Onderzoekstekst in het spel */
        members:      item.members  || false, /* true = alleen voor members */
        limit:        item.limit    || null,  /* GE-aankooplimiet per 4 uur */
        lowalch:      item.lowalch  || null,  /* Lage alchemiewaarde */
        highalch:     item.highalch || null,  /* Hoge alchemiewaarde */
        icon:         getIconUrl(item.name),  /* Wiki-sprite URL */
        category:     guessCategory(item.name),
        priceHigh:    priceInfo.high || null, /* Laatste verkoopprijs */
        priceLow:     priceInfo.low  || null, /* Laatste aankoopprijs */
        /* Gebruik high als primaire prijs, anders low als fallback */
        currentPrice: priceInfo.high || priceInfo.low || null,
      };
    })
    /* Verwijder items zonder bekende prijs (niet verhandelbaar of GE) */
    .filter(item => item.currentPrice !== null);

  /* Sla de resultaten op in de cache voor hergebruik */
  _itemCache = merged;
  return merged;
};


/* =============================================
   HULPFUNCTIES
   ============================================= */

/* Bouwt de URL op voor het detail-sprite van een item op de RS Wiki.
   Spaties in de naam worden vervangen door underscores (Wiki-conventie). */
export const getIconUrl = (name) => {
  const encoded = encodeURIComponent(name.replace(/ /g, '_'));
  return `https://oldschool.runescape.wiki/images/${encoded}_detail.png`;
};

/* Formateert een getal als een leesbare GP-prijs met duizendpunten.
   Geeft een streepje terug als de prijs ontbreekt (null/undefined). */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '—';
  return `${Number(price).toLocaleString()} gp`;
};