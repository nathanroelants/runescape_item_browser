import { isFavourite, getNote } from './storage.js';
import { formatPrice } from './api.js';

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);


export const createItemCard = (item, onFavClick, onCardClick) => {
  const card = document.createElement('div');
  card.classList.add('item-card');
  card.dataset.id = item.id;

  const faved = isFavourite(item.id);
  const note  = getNote(item.id);

  card.innerHTML = `
    <button class="fav-btn ${faved ? 'active' : ''}" title="Add to favourites" aria-label="Favourite">
      ${faved ? '❤️' : '🤍'}
    </button>
    <img
      src="${item.icon}"
      alt="${item.name}"
      loading="lazy"
      onerror="this.src='https://oldschool.runescape.wiki/images/Coins_10000.png'"
    />
    <div class="item-name">${item.name}</div>
    <div class="item-meta">
      <span>${item.category}</span><br/>
      <span>${item.members ? '👑 Members' : 'Free to play'}</span><br/>
      <span>ID: ${item.id}</span>
    </div>
    <div class="item-price">${formatPrice(item.currentPrice)}</div>
    ${note ? `<div class="item-note">📝 ${note}</div>` : ''}
  `;


  card.addEventListener('click', (e) => {
    if (e.target.closest('.fav-btn')) return;
    onCardClick(item);
  });

  card.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    onFavClick(item, card);
  });

  return card;
};


export const renderItems = (items, container, onFavClick, onCardClick) => {
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p class="status-msg">No items found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    fragment.appendChild(createItemCard(item, onFavClick, onCardClick));
  });
  container.appendChild(fragment);
};

export const renderModal = (item, modalBody) => {
  modalBody.innerHTML = `
    <img
      src="${item.icon}"
      alt="${item.name}"
      onerror="this.src='https://oldschool.runescape.wiki/images/Coins_10000.png'"
    />
    <h2>${item.name}</h2>
    <table>
      <tr><td>Category</td><td>${item.category}</td></tr>
      <tr><td>Members</td><td>${item.members ? 'Yes 👑' : 'No'}</td></tr>
      <tr><td>Buy price</td><td>${formatPrice(item.priceHigh)}</td></tr>
      <tr><td>Sell price</td><td>${formatPrice(item.priceLow)}</td></tr>
      <tr><td>High alch</td><td>${item.highalch ? formatPrice(item.highalch) : '—'}</td></tr>
      <tr><td>Low alch</td><td>${item.lowalch ? formatPrice(item.lowalch) : '—'}</td></tr>
      <tr><td>GE limit</td><td>${item.limit ? item.limit.toLocaleString() : '—'}</td></tr>
      <tr><td>Item ID</td><td>${item.id}</td></tr>
    </table>
    <p class="modal-desc">${item.examine || 'No description available.'}</p>
  `;
};

export const setLoading = (visible) => {
  const el = $('#loadingMsg');
  visible ? el.classList.remove('hidden') : el.classList.add('hidden');
};

export const setError = (visible) => {
  const el = $('#errorMsg');
  visible ? el.classList.remove('hidden') : el.classList.add('hidden');
};

export const updateCount = (count) => {
  $('#itemCount').textContent = `Showing ${count} items`;
};

export const updateFavCount = (count) => {
  $('#favNum').textContent = count;
};
