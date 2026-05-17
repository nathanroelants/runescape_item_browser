# RS Item Browser

Webapplicatie voor het vak Web Advanced. Je kan items van de OSRS Grand Exchange opzoeken, filteren en opslaan als favoriet.


Functionaliteiten:

- Items ophalen van de OSRS Wiki API
- Zoeken op naam
- Filteren op categorie
- Sorteren op naam of prijs
- Items opslaan als favoriet
- Notities toevoegen aan favorieten
- Dark/light mode

Gebruikte API:

OSRS wiki Real-time Prices API https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices
- https://prices.runescape.wiki/api/v1/osrs/latest
- https://prices.runescape.wiki/api/v1/osrs/mapping

Technische vereisten:

DOM manipulatie:  
- Elementen selecteren
- Elementen manipuleren
- Events aan elementen koppelen

Modern JavaScript:  
- Gebruik van constanten
- Template literals
- Iteratie over arrays
- Array methodes
- Arrow functions
- Conditional (ternary) operator (moderne if..else)
- Callback functions
- Promises
- Async & Await
- Observer API (1 is voldoende)

Data & API:  
- Fetch om data op te halen
- JSON manipuleren en weergeven

Opslag & validatie:  
- Formulier validatie
- Gebruik van LocalStorage 

Styling & layout:  
- Basis HTML layout (flexbox of CSS grid kan hiervoor worden gebruikt)
- Basis CSS
- Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes,...)

Tooling & structuur:  
- Project is opgezet met Vite 
- Een correcte folderstructuur wordt aangehouden (gescheiden html, css en js files, src folder, dist folder, ...)

Installatie:
- download de code van https://github.com/nathanroelants/runescape_item_browser
- extract de files
- open de folder in terminal
- run:
-  npm install
-  npm run dev

Screenshots:
<img width="1920" height="1080" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/71dd4f65-35dc-4e88-8eb8-52e270ff169d" />
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/b8676800-100b-49c6-b5f3-4714d392bbab" />
<img width="1920" height="1080" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/734448f2-2011-4344-bb66-a5946737b708" />
<img width="1920" height="1080" alt="Screenshot (14)" src="https://github.com/user-attachments/assets/1faeb3f9-21d7-426f-8239-2bcf98941370" />
<img width="1920" height="1080" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/5a92a10d-6989-49c5-b100-d8bb16c76a1a" />


Bronnen:

- https://runescape.wiki/w/Application_programming_interface
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- https://vitejs.dev/
