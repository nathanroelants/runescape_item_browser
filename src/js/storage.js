/* =============================================
   LOCALSTORAGE SLEUTELS
   ============================================= */

/* Centrale sleutels voor alle localStorage-items.
   Zo vermijd je typefouten en zijn alle sleutels
   op één plek te beheren. */
const KEYS = {
  FAVOURITES:  'rs_favourites',  /* Array van favoriete item-ID's */
  NOTES:       'rs_notes',       /* Object met notities per item-ID */
  THEME:       'rs_theme',       /* Huidig thema: 'dark' of 'light' */
  LAST_SEARCH: 'rs_last_search', /* Laatste zoekopdracht van de gebruiker */
};


/* =============================================
   FAVORIETEN
   ============================================= */

/* Haalt de lijst van favoriete item-ID's op uit localStorage.
   Geeft een lege array terug als er nog geen favorieten zijn. */
export const getFavourites = () => {
  const raw = localStorage.getItem(KEYS.FAVOURITES);
  return raw ? JSON.parse(raw) : [];
};

/* Voegt een item-ID toe aan de favorietenlijst.
   Doet niets als het ID al in de lijst staat (geen duplicaten). */
export const addFavourite = (id) => {
  const favs = getFavourites();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem(KEYS.FAVOURITES, JSON.stringify(favs));
  }
};

/* Verwijdert een item-ID uit de favorietenlijst
   en slaat de bijgewerkte lijst op. */
export const removeFavourite = (id) => {
  const favs = getFavourites().filter(f => f !== id);
  localStorage.setItem(KEYS.FAVOURITES, JSON.stringify(favs));
};

/* Geeft true terug als het item-ID in de favorietenlijst staat. */
export const isFavourite = (id) => getFavourites().includes(id);


/* =============================================
   NOTITIES
   ============================================= */

/* Haalt alle opgeslagen notities op als een object { id: notitie }.
   Geeft een leeg object terug als er nog geen notities zijn. */
export const getNotes = () => {
  const raw = localStorage.getItem(KEYS.NOTES);
  return raw ? JSON.parse(raw) : {};
};

/* Slaat een notitie op voor een specifiek item-ID.
   Overschrijft een bestaande notitie voor hetzelfde ID. */
export const saveNote = (id, note) => {
  const notes = getNotes();
  notes[id] = note;
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

/* Geeft de notitie terug voor een specifiek item-ID.
   Geeft een lege string terug als er geen notitie bestaat. */
export const getNote = (id) => getNotes()[id] || '';


/* =============================================
   THEMA
   ============================================= */

/* Geeft het opgeslagen thema terug; standaard 'dark' als er niets is opgeslagen. */
export const getTheme = () => localStorage.getItem(KEYS.THEME) || 'dark';

/* Slaat het gekozen thema op ('dark' of 'light'). */
export const saveTheme = (theme) => localStorage.setItem(KEYS.THEME, theme);


/* =============================================
   ZOEKGESCHIEDENIS
   ============================================= */

/* Geeft de laatste zoekopdracht terug uit localStorage.
   Geeft een lege string terug als er niets is opgeslagen. */
export const getLastSearch = () => localStorage.getItem(KEYS.LAST_SEARCH) || '';

/* Slaat de huidige zoekopdracht op zodat die bewaard blijft na herladen. */
export const saveLastSearch = (query) => localStorage.setItem(KEYS.LAST_SEARCH, query);