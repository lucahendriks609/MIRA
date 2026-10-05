# MIRA Find Your Color

Een kleurenquiz van zeven vragen. Hij leidt via persoonlijkheid (45%), kleurtype (35%) en voorkeur (20%) naar een top 3 van MIRA Colors, met matchpercentage, Color Story en salesblokken.

## Snel starten
```bash
npm install
npm test
npm run preview   # open http://localhost:4173/preview/
```

## Live zetten in Shopify
1. Upload `src/mira-fyc.css`, `src/mira-fyc-data.js` en `src/mira-fyc.js` naar de theme-assets.
2. Upload de fonts (.woff2) en zet de bestandsnamen in de `@font-face` van de section.
3. Zet `shopify/sections/mira-find-your-color.liquid` in `/sections`.
4. Maak een pagina, bijvoorbeeld `/pages/find-your-color`, en voeg de section toe via de theme-editor. Vul daar de link naar het starterpack in.

## Aanpassen
Alles inhoudelijks staat in `src/mira-fyc-data.js`: vragen, scores, kleuren, Color Stories, weging en teksten. Zie `AGENTS.md` voor de regels en `docs/` voor de overdracht en de animatiebrief.
