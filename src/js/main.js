
import '../css/style.css';
import { fetchAllItems, formatPrice } from './api.js';
import {
  getFavourites, addFavourite, removeFavourite, isFavourite,
  getTheme, saveTheme, getLastSearch, saveLastSearch,
  saveNote, getNote,
} from './storage.js';
import {
  $, $$, renderItems, renderModal, setLoading, setError, updateCount, updateFavCount,
} from './ui.js';

const state = {
  allItems:    [],
  filtered:    [],
  activeTab:   'items',
  noteTargetId: null,
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  $('#themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
};

applyTheme(getTheme());

$('#themeToggle').addEventListener('click', () => {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme(next);
});

const loadItems = async () => {
  setLoading(true);
  setError(false);

  try {
    const items = await fetchAllItems();
    state.allItems = items;


    populateCategoryDropdown(items);


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


const applyFilters = () => {
  const query    = $('#searchInput').value.toLowerCase().trim();
  const category = $('#categoryFilter').value;
  const sort     = $('#sortSelect').value;

  saveLastSearch(query);

  let result = state.allItems.filter(item => {
    const matchesCategory = category ? item.category === category : true;
    const matchesSearch   = item.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  result = result.sort((a, b) => {
    if (sort === 'name-asc')    return a.name.localeCompare(b.name);
    if (sort === 'name-desc')   return b.name.localeCompare(a.name);
    const pa = a.currentPrice || 0;
    const pb = b.currentPrice || 0;
    return sort === 'price-asc' ? pa - pb : pb - pa;
  });

  state.filtered = result;
  updateCount(result.length);
  renderItems(result, $('#itemsGrid'), handleFavClick, handleCardClick);
};

$('#searchInput').addEventListener('input', applyFilters);
$('#categoryFilter').addEventListener('change', applyFilters);
$('#sortSelect').addEventListener('change', applyFilters);

const handleFavClick = (item, card) => {
  const btn      = card.querySelector('.fav-btn');
  const alreadyFaved = isFavourite(item.id);

  if (alreadyFaved) {
    removeFavourite(item.id);
    btn.textContent = '🤍';
    btn.classList.remove('active');
  } else {
    addFavourite(item.id);
    btn.textContent = '❤️';
    btn.classList.add('active');
    openNoteModal(item.id);
  }

  updateFavCount(getFavourites().length);
  if (state.activeTab === 'favourites') renderFavourites();
};

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

updateFavCount(getFavourites().length);


$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.activeTab = tab.dataset.tab;


    if (state.activeTab === 'items') {
      $('#itemsGrid').classList.remove('hidden');
      $('#favouritesPanel').classList.add('hidden');
    } else {
      $('#itemsGrid').classList.add('hidden');
      $('#favouritesPanel').classList.remove('hidden');
      renderFavourites();
    }
  });
});


const handleCardClick = async (item) => {
  const modal     = $('#modal');
  const modalBody = $('#modalBody');

  modal.classList.remove('hidden');
  renderModal(item, modalBody);
};

$('#modalClose').addEventListener('click', () => $('#modal').classList.add('hidden'));


$('#modal').addEventListener('click', (e) => {
  if (e.target === $('#modal')) $('#modal').classList.add('hidden');
});


const openNoteModal = (itemId) => {
  state.noteTargetId = itemId;
  $('#noteInput').value = getNote(itemId);
  $('#noteError').classList.add('hidden');
  $('#noteModal').classList.remove('hidden');
};

$('#noteClose').addEventListener('click', () => {
  $('#noteModal').classList.add('hidden');
  state.noteTargetId = null;
});

$('#noteSave').addEventListener('click', () => {
  const note    = $('#noteInput').value.trim();
  const errorEl = $('#noteError');

  if (note.length === 0) {
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  saveNote(state.noteTargetId, note);
  $('#noteModal').classList.add('hidden');
  state.noteTargetId = null;

  applyFilters();
  if (state.activeTab === 'favourites') renderFavourites();
});


const observer = new IntersectionObserver(

  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);


const gridObserver = new MutationObserver(() => {
  $$('.item-card').forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(10px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    observer.observe(card);
  });
});

gridObserver.observe($('#itemsGrid'), { childList: true });

loadItems();
