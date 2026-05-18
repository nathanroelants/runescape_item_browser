/* =============================================
   IMPORTS
   ============================================= */

/* Favoriet- en notitiecheck vanuit localStorage */
import { isFavourite, getNote } from './storage.js';
/* Prijsformattering (getal → "1.234 gp") */
import { formatPrice } from './api.js';


/* =============================================
   DOM-HULPFUNCTIES
   ============================================= */

/* Verkorte versie van document.querySelector */
export const $ = (selector) => document.querySelector(selector);
/* Verkorte versie van document.querySelectorAll */
export const $$ = (selector) => document.querySelectorAll(selector);


/* =============================================
   ITEMKAART AANMAKEN
   ============================================= */

/* Maakt een itemkaart aan als DOM-element.
   - Toont sprite, naam, categorie, members-status, prijs en eventuele notitie.
   - Klikken op de kaart opent de detailmodal via onCardClick.
   - Klikken op het hartje wisselt het favoriet via onFavClick. */
export const createItemCard = (item, onFavClick, onCardClick) => {
  const card = document.createElement('div');
  card.classList.add('item-card');
  /* Sla het item-ID op als data-attribuut voor eventuele DOM-lookups */
  card.dataset.id = item.id;

  /* Haal de huidige favoriet- en notitiestatus op */
  const faved = isFavourite(item.id);
  const note  = getNote(item.id);

  card.innerHTML = `
    <!-- Favorietenknop: rood hart als actief, wit hart als inactief -->
    <button class="fav-btn ${faved ? 'active' : ''}" title="Add to favourites">
      ${faved ? '❤️' : '🤍'}
    </button>

    <!-- Pixelart-sprite; valt terug op een muntje als de afbeelding niet laadt -->
    <img
      src="${item.icon}"
      alt="${item.name}"
      loading="lazy"
      onerror="this.src='https://oldschool.runescape.wiki/images/Coins_10000.png'"
    />

    <!-- Itemnaam -->
    <div class="item-name">${item.name}</div>

    <!-- Secundaire metadata: categorie, members-status en item-ID -->
    <div class="item-meta">
      <span>${item.category}</span><br/>
      <span>${item.members ? ' Members' : 'Free to play'}</span><br/>
      <span>ID: ${item.id}</span>
    </div>

    <!-- Huidige Grand Exchange-prijs -->
    <div class="item-price">${formatPrice(item.currentPrice)}</div>

    <!-- Notitiebadge, alleen zichtbaar als er een notitie is opgeslagen -->
    ${note ? `<div class="item-note"> ${note}</div>` : ''}
  `;

  /* Klik op de kaart zelf → open detailmodal
     (sla over als de klik op de favorietenknop was) */
  card.addEventListener('click', (e) => {
    if (e.target.closest('.fav-btn')) return;
    onCardClick(item);
  });

  /* Klik op de favorietenknop → wissel favorietstatus
     stopPropagation voorkomt dat de kaartclick ook afvuurt */
  card.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    onFavClick(item, card);
  });

  return card;
};


/* =============================================
   ITEMRASTER RENDEREN
   ============================================= */

/* Wist de container en vult hem met kaarten voor elk item.
   Gebruikt een DocumentFragment voor betere DOM-performantie.
   Toont een melding als de gefilterde lijst leeg is. */
export const renderItems = (items, container, onFavClick, onCardClick) => {
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p class="status-msg">No items found.</p>';
    return;
  }

  /* Fragment bundelt alle kaarten in één DOM-operatie */
  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(createItemCard(item, onFavClick, onCardClick)));
  container.appendChild(fragment);
};


/* =============================================
   DETAILMODAL RENDEREN
   ============================================= */

/* Vult de inhoud van de detailmodal met alle beschikbare
   itemdata: sprite, naam, statstabel en onderzoekstekst.
   Alle prijzen worden geformatteerd via formatPrice. */
export const renderModal = (item, modalBody) => {
  modalBody.innerHTML = `
    <!-- Grote sprite bovenaan de modal -->
    <img src="${item.icon}" alt="${item.name}"
      onerror="this.src='https://oldschool.runescape.wiki/images/Coins_10000.png'" />

    <h2>${item.name}</h2>

    <!-- Statstabel met alle relevante itemgegevens -->
    <table>
      <tr><td>Category</td><td>${item.category}</td></tr>
      <tr><td>Members</td><td>${item.members ? 'Yes' : 'No'}</td></tr>
      <tr><td>Buy price</td><td>${formatPrice(item.priceHigh)}</td></tr>
      <tr><td>Sell price</td><td>${formatPrice(item.priceLow)}</td></tr>
      <tr><td>High alch</td><td>${item.highalch ? formatPrice(item.highalch) : '—'}</td></tr>
      <tr><td>Low alch</td><td>${item.lowalch  ? formatPrice(item.lowalch)  : '—'}</td></tr>
      <tr><td>GE limit</td><td>${item.limit    ? item.limit.toLocaleString() : '—'}</td></tr>
      <tr><td>Item ID</td><td>${item.id}</td></tr>
    </table>

    <!-- In-game onderzoekstekst; fallback als die ontbreekt -->
    <p class="modal-desc">${item.examine || 'No description available.'}</p>
  `;
};


/* =============================================
   STATUS- EN TELMELDINGEN
   ============================================= */

/* Toont of verbergt de laadmelding ("Loading items...") */
export const setLoading = (visible) => {
  const el = $('#loadingMsg');
  visible ? el.classList.remove('hidden') : el.classList.add('hidden');
};

/* Toont of verbergt de foutmelding ("Failed to load items.") */
export const setError = (visible) => {
  const el = $('#errorMsg');
  visible ? el.classList.remove('hidden') : el.classList.add('hidden');
};

/* Update de itemteller in de statusbalk ("Showing X items") */
export const updateCount = (count) => {
  $('#itemCount').textContent = `Showing ${count} items`;
};

/* Update het favorieten-aantal naast het hartje in de statusbalk */
export const updateFavCount = (count) => {
  $('#favNum').textContent = count;
};
