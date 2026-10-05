# AGENTS.md: MIRA Find Your Color

Instructies voor coding agents (Codex, Claude Code en anderen) die in deze map werken.

## Wat dit is
Een kleurenquiz voor houseofmira.com, de Shopify-winkel van MIRA | House of Cosmetics (premium Europese gellak).
7 vragen → persoonlijkheidstype ("The Elegant Muse") → MIRA Color Match met matchpercentage → top 3 → salesblokken.
Vanilla JS, geen framework, geen build-stap. Draait als Shopify-section.

## Bestanden
| Bestand | Rol | Aanpassen? |
|---|---|---|
| `src/mira-fyc-data.js` | **Alle inhoud**: vragen, antwoorden, eigenschappen, seizoenen, 68 kleuren, weging, teksten voor inzicht/reveal/bezwaren | Alleen copy en scores. Bron van waarheid. |
| `src/mira-fyc.js` | Engine: scoring (puur, bovenin) + UI-rendering (onder het blok `/* ===== UI ===== */`) | Ja, voor animaties en UI |
| `src/mira-fyc.css` | Alle styling, gescoped onder `.mk` | Ja |
| `shopify/sections/mira-find-your-color.liquid` | Shopify-section, laadt de assets, instellingen | Alleen als het nodig is |
| `preview/index.html` | Lokale preview met voorbeeldproductdata | Ja |
| `test/*.test.js` | Data- en scoringcheck + volledige doorklik in jsdom | Moeten groen blijven |
| `docs/` | Overdracht, animatiebrief, bron van de tags | Eerst lezen |

## Commando's
```bash
npm install          # jsdom voor de flow-test
npm test             # moet groen zijn vóór elke commit
npm run preview      # http://localhost:4173/preview/
```

## Architectuurregels
- **Geen inhoud in de engine.** Nieuwe tekst, vragen of kleuren gaan in `mira-fyc-data.js`. De opdrachtgever eist dit.
- **Scoring niet aanraken** (`profile`, `prefScore`, `score`) tenzij gevraagd. `window.MIRA_FYC_ENGINE.score(answers)` is de publieke API; de tests gebruiken hem.
- **Rendering loopt via `render(opt)`**: `mount()` vervangt het scherm. `render('keep')` her-rendert de uitslag met behoud van scrollpositie (commitment, bezwaren). `render(index)` her-rendert een meerkeuzevraag en houdt de focus. Overgangen horen hier.
- **Geen dependencies** zonder goede reden. Als je een animatiebibliotheek nodig hebt: GSAP via cdnjs met een vaste versie, geladen in de Liquid-section. Liever de Web Animations API + CSS.
- Werkt op mobiel vanaf 360px, geen horizontale scroll, 16px zijmarge.
- Toetsenbord en screenreader: focusbeheer houden, `aria-pressed` op opties, `role="status"` op de reveal.
- **`prefers-reduced-motion` altijd respecteren**: dan geen beweging, alleen een korte fade of niets.

## Merkregels (hard)
- Kleuren: Coated Crème `#FDF5EC` (achtergrond), Ocean Blue `#48BCC5`, Drip Blue `#0C7B7B`, Liquid Blue `#A7D3D7`, inkt `#0A5C5C`.
- **Brush Brown komt in dit ontwerp niet voor.** Brush Brown gaat alleen samen met Coated Crème, nooit met blauwtinten, en de quiz is op blauw gebouwd.
- Type: Arquitecta (koppen, hoofdletters, letterspatiëring) en Futura PR (body). Jost is alleen een stand-in in de preview.
- Toon: editorial luxury met poëzie, geen hyperbole, geen uitroeptekens in merkcopy. Copy in het Nederlands; de slogan blijft altijd Engels: "Because every color tells a story".
- Productfoto's komen uit Shopify. Voeg geen eigen swatch-kleuren toe die niet gecontroleerd zijn.

## Sales en juridisch (hard)
Toegestaan en ingebouwd: inzicht vóór een hoofdstuk, antwoorden terugspiegelen, de pijn benoemen, een reveal-moment, een commitmentvraag, bezwaren afhandelen met een achterdeurvraag, een bundel, een voorraadmelding **alleen op basis van echte Shopify-voorraad**.
Niet toegestaan:
- neppe timers, neppe tellers ("127 vrouwen kozen…"), neppe lage voorraad
- **vooraf aangevinkte vakjes voor extra producten** (mag niet in de EU)
- schuldgevoel-knoppen ("Nee, ik wil er niet mooi uitzien")
- een verplicht e-mailadres vóór de uitslag
- gezondheids- of resultaatclaims over nagels
- een matchpercentage van 100%, of het percentage brengen als wetenschappelijk (`maxDisplayPercent: 99` blijft)

## Klaar betekent
- `npm test` groen
- preview werkt op 360px en op 1280px
- reduced motion gecontroleerd
- geen console-errors
