const KEYS = {
  FAVOURITES: 'rs_favourites',
  NOTES: 'rs_notes',
  THEME: 'rs_theme',
  LAST_SEARCH: 'rs_last_search',
};

export const getFavourites = () => {
  const raw = localStorage.getItem(KEYS.FAVOURITES);
  return raw ? JSON.parse(raw) : [];
};

export const addFavourite = (id) => {
  const favs = getFavourites();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem(KEYS.FAVOURITES, JSON.stringify(favs));
  }
};

export const removeFavourite = (id) => {
  const favs = getFavourites().filter(f => f !== id);
  localStorage.setItem(KEYS.FAVOURITES, JSON.stringify(favs));
};

export const isFavourite = (id) => getFavourites().includes(id);


export const getNotes = () => {
  const raw = localStorage.getItem(KEYS.NOTES);
  return raw ? JSON.parse(raw) : {};
};

export const saveNote = (id, note) => {
  const notes = getNotes();
  notes[id] = note;
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

export const getNote = (id) => {
  const notes = getNotes();
  return notes[id] || '';
};


export const getTheme = () => localStorage.getItem(KEYS.THEME) || 'dark';
export const saveTheme = (theme) => localStorage.setItem(KEYS.THEME, theme);


export const getLastSearch = () => localStorage.getItem(KEYS.LAST_SEARCH) || '';
export const saveLastSearch = (query) => localStorage.setItem(KEYS.LAST_SEARCH, query);
