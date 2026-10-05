# Animatiebrief: MIRA Find Your Color

## Gevoel
Editorial luxury. Denk aan het openslaan van een modemagazine, niet aan een app die stuitert.
- **Rustig en vloeibaar**, alsof gellak uitvloeit: zachte ease-out, nooit bounce of overshoot.
- **Eén groot moment** (de reveal). De rest is ondersteunend en kort.
- Beweging volgt de inhoud: wat je kiest, gaat mee naar het volgende scherm.

## Bewegingssysteem (zet dit als CSS-variabelen in `.mk`)
| Token | Waarde | Gebruik |
|---|---|---|
| `--mk-ease` | `cubic-bezier(.22, .61, .36, 1)` | standaard |
| `--mk-ease-pour` | `cubic-bezier(.65, 0, .35, 1)` | vloeistof, reveal |
| `--mk-fast` | 160ms | hover, druk |
| `--mk-base` | 320ms | schermovergangen |
| `--mk-slow` | 700ms | reveal, kleur |
| afstand | 8–16px | translate, nooit meer |

Alleen `transform`, `opacity`, `clip-path` en `filter` animeren (60fps op mobiel). Geen layout-properties.

## Momenten

### 1. Intro (`.mk-intro`)
- Het MIRA-teken (`.mk-mark`) tekent zichzelf: SVG-stroke van 0 naar 100% (stroke-dasharray), ~900ms.
- Daarna stagger: eyebrow → H1 → lede → hoofdstukkenlijst → knop, telkens 60ms, fade + 8px omhoog.
- Knop "Begin": zachte vulling van links naar rechts bij hover (achtergrond via clip-path), geen scale.

### 2. Vraag naar vraag (`.mk-q`)
- **Richting telt**: vooruit schuift het oude scherm 12px naar links weg en komt het nieuwe van rechts. "Vorige vraag" doet het omgekeerd.
- Nu vervangt `mount()` de inhoud direct. Bouw een `transition(oldNode, newNode, direction)` in `render()` (zie AGENTS.md).
- Opties staggeren 40ms bij binnenkomst.
- **Een optie kiezen** (`.mk-opt[aria-pressed="true"]`): Liquid Blue vult de kaart vanaf het klikpunt als een druppel die uitloopt (radial clip-path vanaf de pointer-coördinaten), ~360ms. Pas daarna wisselt het scherm. Nu staat er een vertraging van 160ms in de code; die mag 380ms worden.
- Meerkeuze (woorden): een gekozen chip krijgt een vinkje dat zich tekent; de teller "(1/2)" telt op.

### 3. Voortgang (`.mk-progress .mk-seg`)
- De balk loopt vloeiend door (dat doet hij al). Bij een nieuw hoofdstuk licht het segmentlabel kort op.

### 4. Inzichtscherm (`.mk-insight`)
- De eigenschappen-chips (`.mk-traits li`) "landen" één voor één, 80ms stagger, alsof ze verzameld worden. Dit is het spiegelmoment.

### 5. De reveal (`.mk-reveal`): het grote moment
Doel: spanning opbouwen in ~2,6 seconden en dan de kleur laten "uitvloeien".
1. Het MIRA-teken draait langzaam (staat er al), de stappen vinken één voor één af (`li.is-done`, staat er al). Maak van het bolletje een druppel die zich vult.
2. Bij de laatste stap: een **kleurdruppel** in de kleur van de match valt in het midden en vloeit uit tot hij het scherm vult (clip-path circle van 0 naar 150%), ~700ms, `--mk-ease-pour`.
3. De uitslag verschijnt vanuit die kleur: de kleur trekt terug naar de ronde productfoto van de match (FLIP-achtig).

**Kleur van de druppel:** er staan nog geen gecontroleerde hexcodes per kleur in de data. Haal de kleur uit de productfoto (canvas, gemiddelde van het midden van het flesje, met `crossOrigin='anonymous'`). Valt dat weg, gebruik dan Ocean Blue. Voeg in de data een optioneel veld `swatch` toe dat MIRA later kan invullen; als dat er is, gaat het voor.

### 6. Uitslag (`.mk-result`)
- H1 (type-naam): woord voor woord omhoog, 70ms stagger.
- **Matchpercentage** (`.mk-pct b`): telt op van 0 naar het getal in ~900ms, ease-out, `font-variant-numeric: tabular-nums` (staat er al).
- Productfoto (`.mk-match img`): schaal van .94 naar 1 met fade, en een heel zachte, trage glans die één keer over het flesje gaat.
- Secties (`.mk-section`) verschijnen op scroll (IntersectionObserver), fade + 12px. **Let op:** ze moeten zonder JS of observer óók zichtbaar zijn. Begin dus niet op `opacity: 0` in de CSS, zet de beginstaat pas in JS.
- Top 3 (`.mk-rank li`): stagger 90ms; de percentage-tekst telt mee op.

### 7. Commitment (`.mk-commit`)
- "Ja, dit ben ik": de knop wordt een zacht vinkje, de tekst "Dan hoort X bij jou." schrijft zich in.
- "Niet helemaal": de match-foto en naam crossfaden naar kleur 2 (geen harde wissel).

### 8. Bezwaren en bundel
- Een chip kiezen: het paneel klapt open met hoogte-animatie via `grid-template-rows: 0fr → 1fr`.
- Toevoegen aan winkelmand: de knop wordt kort "✓ In je winkelmand" (~1,4s) en daarna terug. Het kleine product-plaatje vliegt naar het winkelmandicoon in de header (`[href="/cart"]`) als dat bestaat; bestaat het niet, sla dit over.

### 9. Deelkaart (`.mk-share canvas`)
- Lichte tilt op hover (max 4°) op desktop. Geen tilt op touch.

## Niet doen
- Geen confetti, geen particles, geen geluid, geen schermschudden.
- Geen autoplay-video.
- Niets wat de uitslag langer dan ~3 seconden ophoudt.
- Geen animatie die inhoud verbergt tot je scrollt. Alles moet ook bij stilstand zichtbaar zijn.

## Reduced motion
Bij `prefers-reduced-motion: reduce`:
- geen translate, scale, tilt, druppel of tellers
- het percentage staat er direct
- de reveal duurt ±1s met alleen een fade
- schermwissels zijn een fade van 120ms
