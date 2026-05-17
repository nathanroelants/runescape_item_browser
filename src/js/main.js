/* =============================================
   IMPORTS
   ============================================= */

/* CSS-import zodat Vite de stijlen meebundelt */
import '../css/style.css';

/* API-hulpfuncties voor het ophalen en formatteren van itemdata */
import { fetchAllItems, formatPrice } from './api.js';

/* localStorage-hulpfuncties voor favorieten, thema, zoekgeschiedenis en notities */
import {
  getFavourites, addFavourite, removeFavourite, isFavourite,
  getTheme, saveTheme, getLastSearch, saveLastSearch,
  saveNote, getNote,
} from './storage.js';

/* UI-hulpfuncties voor DOM-selectie, renderen en statusupdates */
import {
  $, $$, renderItems, renderModal, setLoading, setError, updateCount, updateFavCount,
} from './ui.js';


/* =============================================
   GLOBALE STATE
   ============================================= */

/* Centrale toestand van de applicatie.
   Wordt bijgewerkt bij filteren, tabwissels en notities. */
const state = {
  allItems:     [],    /* Volledige itemlijst opgehaald van de API */
  filtered:     [],    /* Huidig gefilterde en gesorteerde items */
  activeTab:    'items', /* Actief tabblad: 'items' of 'favourites' */
  noteTargetId: null,  /* ID van het item waarvoor een notitie wordt geschreven */
};


/* =============================================
   THEMA
   ============================================= */

/* Past het thema toe op <html> en update het icoontje van de themaknop */
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  $('#themeToggle').textContent = theme === 'dark' ? '🌑' : '☀️';
};

/* Laad het opgeslagen thema bij het opstarten */
applyTheme(getTheme());

/* Wissel tussen licht en donker thema bij klikken op de knop */
$('#themeToggle').addEventListener('click', () => {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme(next);
});


/* =============================================
   ITEMS LADEN
   ============================================= */

/* Haalt alle items op van de API, vult de categoriedropdown,
   herstelt de laatste zoekopdracht en toont de gefilterde lijst.
   Toont een foutmelding als het ophalen mislukt. */
const loadItems = async () => {
  setLoading(true);
  setError(false);

  try {
    const items = await fetchAllItems();
    state.allItems = items;

    /* Vul de categoriedropdown op basis van de opgehaalde items */
    populateCategoryDropdown(items);

    /* Herstel de laatste zoekopdracht uit localStorage */
    const lastSearch = getLastSearch();
    if (lastSearch) $('#searchInput').value = lastSearch;

    applyFilters();
    setLoading(false);
  } catch (err) {
    console.error('Failed to load items:', err);
    setLoading(false);
    setError(true);
  }
};


/* =============================================
   CATEGORIEDROPDOWN
   ============================================= */

/* Haalt unieke categorieën op uit de itemlijst, sorteert ze alfabetisch
   en voegt ze als opties toe aan de categoriedropdown. */
const populateCategoryDropdown = (items) => {
  const categories = [...new Set(items.map(item => item.category))].sort();
  const select = $('#categoryFilter');

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
};


/* =============================================
   FILTEREN & SORTEREN
   ============================================= */

/* Leest de huidige waarden van zoekbalk, categoriefilter en sorteeroptie.
   Filtert state.allItems op naam en categorie, sorteert het resultaat,
   slaat de zoekopdracht op en rendert de gefilterde kaarten. */
const applyFilters = () => {
  const query    = $('#searchInput').value.toLowerCase().trim();
  const category = $('#categoryFilter').value;
  const sort     = $('#sortSelect').value;

  /* Sla de zoekopdracht op zodat die bewaard blijft na herladen */
  saveLastSearch(query);

  /* Filter op categorie en zoektekst */
  let result = state.allItems.filter(item => {
    const matchesCategory = category ? item.category === category : true;
    const matchesSearch   = item.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  /* Sorteer op naam of prijs naargelang de gekozen optie */
  result = result.sort((a, b) => {
    if (sort === 'name-asc')  return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    const pa = a.currentPrice || 0;
    const pb = b.currentPrice || 0;
    return sort === 'price-asc' ? pa - pb : pb - pa;
  });

  state.filtered = result;
  updateCount(result.length);
  renderItems(result, $('#itemsGrid'), handleFavClick, handleCardClick);
};

/* Herfilter bij elke invoer in de zoekbalk of wijziging in de dropdowns */
$('#searchInput').addEventListener('input', applyFilters);
$('#categoryFilter').addEventListener('change', applyFilters);
$('#sortSelect').addEventListener('change', applyFilters);


/* =============================================
   FAVORIETEN
   ============================================= */

/* Verwerkt een klik op de favorietenknop van een itemkaart.
   Voegt het item toe of verwijdert het uit de favorieten,
   update de knopstatus en opent de notitiemodal bij toevoegen. */
const handleFavClick = (item, card) => {
  const btn          = card.querySelector('.fav-btn');
  const alreadyFaved = isFavourite(item.id);

  if (alreadyFaved) {
    /* Verwijder uit favorieten en reset de knop */
    removeFavourite(item.id);
    btn.textContent = '🤍';
    btn.classList.remove('active');
  } else {
    /* Voeg toe aan favorieten en open de notitiemodal */
    addFavourite(item.id);
    btn.textContent = '❤️';
    btn.classList.add('active');
    openNoteModal(item.id);
  }

  /* Herrender het favorieten-tabblad als dat actief is */
  updateFavCount(getFavourites().length);
  if (state.activeTab === 'favourites') renderFavourites();
};

/* Rendert alle favoriete items in het favorieten-raster.
   Toont een melding als de lijst leeg is. */
const renderFavourites = () => {
  const favIds   = getFavourites();
  const favItems = state.allItems.filter(item => favIds.includes(item.id));
  const grid     = $('#favouritesGrid');
  const noMsg    = $('#noFavMsg');

  if (favItems.length === 0) {
    grid.innerHTML = '';
    noMsg.classList.remove('hidden');
  } else {
    noMsg.classList.add('hidden');
    renderItems(favItems, grid, handleFavClick, handleCardClick);
  }
};

/* Toon het juiste favorieten-aantal bij het laden van de pagina */
updateFavCount(getFavourites().length);


/* =============================================
   TABBLADEN
   ============================================= */

/* Verwerkt tabbladklikken: markeert het actieve tabblad,
   toont het juiste paneel en rendert favorieten indien nodig. */
$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    /* Verwijder actieve klasse van alle tabbladen */
    $$('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.activeTab = tab.dataset.tab;

    if (state.activeTab === 'items') {
      /* Toon het itemraster, verberg het favorietenpaneel */
      $('#itemsGrid').classList.remove('hidden');
      $('#favouritesPanel').classList.add('hidden');
    } else {
      /* Toon het favorietenpaneel en render de favorieten */
      $('#itemsGrid').classList.add('hidden');
      $('#favouritesPanel').classList.remove('hidden');
      renderFavourites();
    }
  });
});


/* =============================================
   DETAILMODAL
   ============================================= */

/* Opent de detailmodal voor het aangeklikte item
   en vult de inhoud in via renderModal. */
const handleCardClick = async (item) => {
  const modal     = $('#modal');
  const modalBody = $('#modalBody');

  modal.classList.remove('hidden');
  renderModal(item, modalBody);
};

/* Sluit de detailmodal via de sluitknop */
$('#modalClose').addEventListener('click', () => $('#modal').classList.add('hidden'));

/* Sluit de detailmodal bij klikken buiten de inhoud (op de overlay) */
$('#modal').addEventListener('click', (e) => {
  if (e.target === $('#modal')) $('#modal').classList.add('hidden');
});


/* =============================================
   NOTITIEMODAL
   ============================================= */

/* Opent de notitiemodal voor een specifiek item.
   Laadt een eventueel bestaande notitie in het tekstvak. */
const openNoteModal = (itemId) => {
  state.noteTargetId = itemId;
  $('#noteInput').value = getNote(itemId);
  $('#noteError').classList.add('hidden');
  $('#noteModal').classList.remove('hidden');
};

/* Sluit de notitiemodal en reset het doelitem-ID */
$('#noteClose').addEventListener('click', () => {
  $('#noteModal').classList.add('hidden');
  state.noteTargetId = null;
});

/* Valideert en slaat de notitie op bij klikken op 'Opslaan'.
   Toont een foutmelding als het tekstvak leeg is.
   Herrendert de itemlijst en favorieten na opslaan. */
$('#noteSave').addEventListener('click', () => {
  const note    = $('#noteInput').value.trim();
  const errorEl = $('#noteError');

  if (note.length === 0) {
    /* Toon foutmelding bij lege notitie */
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  saveNote(state.noteTargetId, note);
  $('#noteModal').classList.add('hidden');
  state.noteTargetId = null;

  /* Herrender zodat eventuele notitie-indicatoren worden bijgewerkt */
  applyFilters();
  if (state.activeTab === 'favourites') renderFavourites();
});


/* =============================================
   SCROLL-ANIMATIES
   ============================================= */

/* IntersectionObserver die kaarten animeert van onzichtbaar naar
   zichtbaar zodra ze in beeld scrollen (fade + slide omhoog). */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* Maak de kaart zichtbaar en beweeg hem naar zijn eindpositie */
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        /* Stop met observeren na de eerste animatie */
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 } /* Animeer zodra 10% van de kaart zichtbaar is */
);

/* MutationObserver die nieuwe kaarten in het raster detecteert.
   Stelt de beginstijl in (onzichtbaar, iets naar beneden verschoven)
   en koppelt de IntersectionObserver voor de intree-animatie. */
const gridObserver = new MutationObserver(() => {
  $$('.item-card').forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    observer.observe(card);
  });
});

/* Begin met observeren van het itemraster op toegevoegde kindnodes */
gridObserver.observe($('#itemsGrid'), { childList: true });


/* =============================================
   OPSTARTEN
   ============================================= */

/* Start de applicatie door items te laden van de API */
loadItems();