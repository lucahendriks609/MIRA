# Overdracht: stand van zaken (5 oktober 2026)

## Wat er werkt
- **Flow:** intro → 3 hoofdstukken (Who are you? · What makes you glow? · What do you love?) → 7 vragen → reveal → uitslag.
- **Scoring:** 45% persoonlijkheid, 35% kleurtype, 20% voorkeur. Alle 68 gellakkleuren worden gescoord. De top 3 heeft maximaal 2 kleuren uit dezelfde familie. Het percentage loopt van 50 tot 99.
- **Uitslag:**
  - persoonlijkheidstype, bijvoorbeeld "The Elegant Muse";
  - de benoemde pijn uit vraag 7;
  - de perfect match met Color Story, waarom het bij haar persoonlijkheid en kleurtype past, en Shop/winkelmand;
  - "Herken je jezelf hierin?";
  - top 3;
  - "This color tells your story";
  - de bundel: kleur + base coat + top coat;
  - "Wat houdt je nog tegen?";
  - de deelkaart in storyformaat.
- **Live:** de engine haalt producten, prijzen, varianten en foto's zelf op uit `/products.json?limit=250`. Winkelmand via `/cart/add.js` en het event `cart:refresh`. Delen via de Web Share API met een fallback naar downloaden.

## Open, in te vullen door MIRA
| Wat | Waar | Status |
|---|---|---|
| Link naar het starterpack | Instelling in de Liquid-section (of `ritual.starterPackUrl` in de data) | ontbreekt |
| Fontbestanden Arquitecta + Futura PR (.woff2) | theme-assets + bestandsnamen in de section | ontbreekt |
| Betekenis per kleur (persoonlijkheidstags + Color Story) | `colors[].personality` en `colors[].story` | **concept** (`storyStatus: 'concept'`) |
| Swatch-hex per kleur (voor animaties) | nieuw veld `colors[].swatch` | ontbreekt |
| Seizoenswaarden per kleur | `colors[].season` | berekend uit ondertoon, diepte en helderheid; mag MIRA overschrijven |

## Bekend
- Vier kleuren komen in simulaties nooit als nummer 1 uit: Borgogna, Lumina, Moka Dolce en Rosabella. Ze komen wel in een top 3. Hun tags lijken te veel op die van buurkleuren. Dat lost zich op als MIRA per kleur een eigen betekenis vastlegt.
- `/cart/add.js` en `cart:refresh` zijn de standaard in Dawn-achtige themes. Een ander theme kan een ander event verwachten om het winkelmandje bij te werken.
- De deelkaart tekent de productfoto op een canvas. Als de Shopify-CDN geen CORS-header geeft, kan opslaan of delen falen. Op het eigen domein werkt het normaal; test dit live.
- "Nog maar een paar op voorraad" werkt alleen met voorraadtracking in Shopify, met een drempel in de section (standaard 5).

## Later (architectuur houdt er rekening mee)
12 seizoenen, een selfie of upload, Find Your BIAB, resultaten mailen of opslaan, Glow Points, trendkleuren, segmenten in de e-mailmarketing. De engine is regelgebaseerd, zonder AI; persoonlijke tekst via AI kan er later bij.

## Bron
`docs/kleurtags-bron.txt` is de tabel waaruit de 68 kleuren zijn opgebouwd: familie, finish, ondertoon, diepte, helderheid, intensiteit, persoonlijkheid, stijl, gelegenheid en Color Story. De productteksten op houseofmira.com waren de basis.
