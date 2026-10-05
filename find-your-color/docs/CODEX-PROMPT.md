# Prompt voor Codex

Plak het blok hieronder als eerste taak in Codex, met de repo `lucahendriks609/mira` gekoppeld.

---

```
Je werkt in de map find-your-color/ van deze repo. Lees eerst find-your-color/AGENTS.md en daarna find-your-color/docs/ANIMATIE-BRIEF.md en docs/OVERDRACHT.md.

Taak: voeg de animaties en micro-interacties uit ANIMATIE-BRIEF.md toe aan de MIRA Find Your Color-quiz.

Volgorde:
1. Bewegingstokens als CSS-variabelen in .mk (mira-fyc.css).
2. Een transitiesysteem in render()/mount() in src/mira-fyc.js: vooruit/achteruit tussen schermen, met behoud van focusbeheer en van render('keep') en render(index).
3. Intro, opties kiezen (druppelvulling vanaf het klikpunt), meerkeuze, inzichtscherm.
4. De reveal met de kleurdruppel in de kleur van de match. Haal de kleur uit de productfoto; voeg een optioneel veld `swatch` per kleur toe in mira-fyc-data.js dat voorgaat als het is ingevuld.
5. Uitslag: type-naam per woord, percentage dat optelt, secties op scroll (zichtbaar zonder JS), top 3, commitment-crossfade, bezwarenpaneel, bevestiging bij toevoegen aan winkelmand.
6. Reduced motion voor alles hierboven.

Grenzen:
- Scoring (profile, prefScore, score) niet wijzigen.
- Geen inhoud in de engine; tekst hoort in mira-fyc-data.js.
- Merkregels en de lijst 'niet toegestaan' uit AGENTS.md zijn hard.
- Geen nieuwe dependencies, tenzij het echt niet anders kan (dan GSAP via cdnjs met vaste versie).

Klaar = npm test groen, preview werkt op 360px en 1280px, reduced motion gecontroleerd, geen console-errors.
Lever een korte lijst van wat je hebt gebouwd en welke momenten je hebt overgeslagen, met de reden.
```
