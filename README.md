# ⚔️ RuneScape Item Browser

Een single-page webapplicatie waarmee je items van de RuneScape Grand Exchange kan verkennen, filteren, sorteren en opslaan als favorieten.

---

## Projectbeschrijving

Dit project haalt live itemdata op van de officiële RuneScape Grand Exchange API. Gebruikers kunnen items zoeken, filteren op categorie, sorteren op naam of prijs, en items opslaan als favorieten met persoonlijke notities. Alle voorkeuren worden bewaard in de browser via localStorage.

## Screenshots

> *(Screenshots toevoegen na deployment)*

---

## Gebruikte API

- **RuneScape Grand Exchange Catalogue API**
  - `https://secure.runescape.com/m=itemdb_rs/api/catalogue/items.json`
  - `https://secure.runescape.com/m=itemdb_rs/api/catalogue/detail.json`
  - Documentatie: https://runescape.wiki/w/Application_programming_interface

---

## Functionaliteiten

- 📦 Items ophalen van meerdere categorieën (Weapons, Armour, Potions, Runes, Food)
- 🔍 Zoekfunctie op itemnaam
- 🗂️ Filteren op categorie
- 🔃 Sorteren op naam (A→Z / Z→A) en prijs
- ❤️ Favorieten opslaan en beheren
- 📝 Persoonlijke notities per item (met formuliervalidatie)
- 🌙 Dark/light thema switcher (opgeslagen in localStorage)
- 📋 Detail modal per item met volledige GE info
- Responsive design

---

## Installatie

```bash
# 1. Clone de repository
git clone https://github.com/jouwusername/runescape-item-browser.git
cd runescape-item-browser

# 2. Installeer dependencies
npm install

# 3. Start de dev server
npm run dev

# 4. Of bouw voor productie
npm run build
npm run preview
```

Vereisten: Node.js 18+

---

## Technische vereisten — implementatie

### DOM manipulatie
| Concept | Bestand | Lijn |
|---|---|---|
| Elementen selecteren (`querySelector`, `querySelectorAll`) | `src/js/ui.js` | 9–10 |
| Elementen manipuleren (innerHTML, classList, dataset) | `src/js/ui.js` | 24–60 |
| Events aan elementen koppelen (`addEventListener`) | `src/js/main.js` | 36, 109–111, 158, 196, 200, 213, 219 |

### Modern JavaScript
| Concept | Bestand | Lijn |
|---|---|---|
| `const` en `let` | Overal in project | — |
| Template literals (backticks) | `src/js/ui.js` | 28–47 |
| Iteratie over arrays (`forEach`) | `src/js/main.js` | 158 |
| Array methodes (`.filter()`, `.sort()`, `.flat()`) | `src/js/main.js` | 85, 93, 60 |
| Arrow functions | `src/js/main.js` | 77, 118, 241 |
| Ternary operator | `src/js/main.js` | 87 |
| Callback functions | `src/js/main.js` | 109, 241 |
| Promises (`Promise.all`) | `src/js/main.js` | 52 |
| `async` & `await` | `src/js/main.js` | 47, 179 |
| Observer API (IntersectionObserver + MutationObserver) | `src/js/main.js` | 237, 261 |

### Data & API
| Concept | Bestand | Lijn |
|---|---|---|
| `fetch` om data op te halen | `src/js/api.js` | 34, 68 |
| JSON manipuleren en weergeven | `src/js/api.js` | 40–41, `src/js/ui.js` 29 |

### Opslag & validatie
| Concept | Bestand | Lijn |
|---|---|---|
| Formuliervalidatie | `src/js/main.js` | 223 |
| LocalStorage (favorieten, notities, thema, zoekopdracht) | `src/js/storage.js` | 14–54 |

### Styling & layout
| Concept | Beschrijving |
|---|---|
| CSS Grid | Items grid (`.items-grid`) — `src/css/style.css` lijn ~100 |
| Flexbox | Header controls, tabs — `src/css/style.css` lijn ~50 |
| CSS variabelen | Theme variabelen `:root` — `src/css/style.css` lijn 3 |
| Responsiveness | Media query `@media (max-width: 600px)` — `src/css/style.css` lijn ~220 |

### Tooling & structuur
- Project opgezet met **Vite**
- Folderstructuur: `src/css/`, `src/js/`, `index.html`, `vite.config.js`
- Build output naar `dist/`

---

## Folderstructuur

```
runescape-item-browser/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js      ← app entry point
        ├── api.js       ← API calls
        ├── ui.js        ← DOM rendering
        └── storage.js   ← localStorage helpers
```

---

## Gebruikte bronnen

- [RuneScape Wiki API documentatie](https://runescape.wiki/w/Application_programming_interface)
- [MDN Web Docs — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs — IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Vite documentatie](https://vitejs.dev/)
- AI chatlog: *(voeg hier link toe)*
