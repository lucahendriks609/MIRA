/* MIRA Find Your Color — inhoud en instellingen.
   Alles wat inhoudelijk is staat hier: vragen, antwoorden, eigenschappen, seizoenen, kleuren en weging.
   De engine (mira-fyc.js) bevat geen inhoud. Pas dit bestand aan om vragen, scores, kleuren of Color Stories te wijzigen. */
window.MIRA_FYC = {

  /* ---------- Weging ----------
     Hoofdonderdelen tellen samen op tot 1. Sub-weging binnen 'voorkeur' telt ook op tot 1. */
  scoringWeights: {
    personality: 0.45,
    season: 0.35,
    preference: 0.20,
    preferenceParts: { family: 0, style: 0, intensity: 1, depth: 0, occasion: 0 } /* v1 vraagt alleen subtiel/opvallend; zet gewichten aan als je vragen toevoegt */,
    /* Familiescore: 'vertrouwd' beloont gekozen families, 'nieuw' geeft ook andere families een kans. */
    familyFit: { familiar: { inFamily: 1.0, outFamily: 0.2 }, new: { inFamily: 0.6, outFamily: 0.75 }, none: 0.6 },
    /* Hoe zwaar een stijl- of gelegenheidsmatch telt als die niet overeenkomt. */
    softMiss: 0.3,
    /* Uitslag */
    topCount: 3,
    maxPerFamily: 2,          /* niet meer dan 2 kleuren uit dezelfde familie in de top 3 */
    maxDisplayPercent: 99,    /* nooit "100%": het blijft een persoonlijke aanbeveling */
    minDisplayPercent: 50
  },

  /* ---------- Persoonlijkheid ----------
     key: interne naam. label: NL woord in de uitslag. attr: bijvoeglijke vorm. essence: zelfstandig naamwoord ("Amarone staat voor ..."). adjective/noun: bouwstenen voor de type-naam ("The Elegant Adventurer").
     lead: openingszin als dit je sterkste eigenschap is. twist: tweede zin als dit je tweede eigenschap is. */
  personalityTraits: {
    confident:   { label: 'zelfverzekerd', attr: 'zelfverzekerde', essence: 'zelfvertrouwen', adjective: 'Bold',        noun: 'Icon',       lead: 'Je weet wat je wilt en je staat er vol voor.',                                   twist: 'Daaronder zit een stille kracht die je aan niemand hoeft te bewijzen.' },
    romantic:    { label: 'romantisch',    attr: 'romantische', essence: 'romantiek', adjective: 'Romantic',    noun: 'Dreamer',    lead: 'Je kijkt met een zachte blik naar de wereld en ziet schoonheid in kleine dingen.', twist: 'Daarbij heb je een romantische kant die alles wat zachter maakt.' },
    calm:        { label: 'rustig',        attr: 'rustige', essence: 'rust', adjective: 'Serene',      noun: 'Soul',       lead: 'Je brengt rust mee, waar je ook binnenkomt.',                                     twist: 'Toch blijf je kalm, ook als het om je heen druk is.' },
    creative:    { label: 'creatief',      attr: 'creatieve', essence: 'creativiteit', adjective: 'Creative',    noun: 'Artist',     lead: 'Je ziet mogelijkheden waar anderen een leeg vel zien.',                           twist: 'Daarnaast heb je een creatieve kant die altijd iets eigens toevoegt.' },
    adventurous: { label: 'avontuurlijk',  attr: 'avontuurlijke', essence: 'avontuur', adjective: 'Adventurous', noun: 'Adventurer', lead: 'Je zoekt het nieuwe op en zegt sneller ja dan nee.',                              twist: 'Maar er mag altijd iets onverwachts in zitten.' },
    elegant:     { label: 'elegant',       attr: 'elegante', essence: 'elegantie', adjective: 'Elegant',     noun: 'Muse',       lead: 'Je houdt van verfijning en kiest bewust, tot in de details.',                     twist: 'En je doet het met een vanzelfsprekende elegantie.' },
    playful:     { label: 'speels',        attr: 'speelse', essence: 'speelsheid', adjective: 'Playful',     noun: 'Spark',      lead: 'Je neemt het leven licht en maakt van gewone momenten iets leuks.',               twist: 'Met een speelse knipoog die nooit ver weg is.' },
    mysterious:  { label: 'mysterieus',    attr: 'mysterieuze', essence: 'mysterie', adjective: 'Mysterious',  noun: 'Enigma',     lead: 'Je laat niet alles meteen zien, en juist dat maakt je interessant.',              twist: 'Met een geheimzinnige kant die je niet aan iedereen laat zien.' },
    warm:        { label: 'warm',          attr: 'warme', essence: 'warmte', adjective: 'Warm',        noun: 'Heart',      lead: 'Mensen voelen zich snel thuis bij jou.',                                          twist: 'Met een warmte die mensen vanzelf naar je toe trekt.' },
    optimistic:  { label: 'optimistisch',  attr: 'optimistische', essence: 'optimisme', adjective: 'Radiant',     noun: 'Optimist',   lead: 'Je ziet eerst wat er kan, en dat werkt aanstekelijk.',                            twist: 'En je kijkt altijd naar wat er mogelijk is.' }
  },

  /* ---------- Kleurtype (seizoen) ---------- */
  seasonTraits: {
    spring: { label: 'Lente',  title: 'Lentetype',  profile: { tone: 'warm', depth: 'licht', chroma: 'helder' },  text: 'Warm, licht en helder. Frisse, warme tinten zoals perzik, koraal en zacht goud laten je waarschijnlijk het meest stralen.' },
    summer: { label: 'Zomer',  title: 'Zomertype',  profile: { tone: 'koel', depth: 'licht', chroma: 'zacht' },   text: 'Koel, zacht en gedempt. Poederroze, mauve, blauwgrijs en zachte nudes vallen waarschijnlijk mooi bij je.' },
    autumn: { label: 'Herfst', title: 'Herfsttype', profile: { tone: 'warm', depth: 'diep', chroma: 'zacht' },    text: 'Warm, diep en aards. Olijf, mokka, bordeaux en warme nudes passen waarschijnlijk het best bij je.' },
    winter: { label: 'Winter', title: 'Wintertype', profile: { tone: 'koel', depth: 'diep', chroma: 'helder' },  text: 'Koel, helder en met contrast. Diep rood, zwart, puur wit en kobalt passen waarschijnlijk het best bij je.' }
  },

  /* ---------- Labels voor kleurkenmerken ---------- */
  labels: {
    family: { nude: 'nude', roze: 'roze', rood: 'rood', bruin: 'bruin', paars: 'paars', blauw: 'blauw', groen: 'groen', grijs: 'grijs', zwart: 'zwart', wit: 'wit', metallic: 'metallic', topper: 'transparante glans' },
    tone: { warm: 'warme', cool: 'koele', neutral: 'neutrale' },
    depth: { light: 'lichte', medium: 'medium', deep: 'diepe' },
    chroma: { bright: 'heldere', muted: 'zachte' },
    style: { classy: 'classy', romantic: 'romantisch', bold: 'bold', fresh: 'fresh', timeless: 'tijdloos', playful: 'speels' }
  },

  /* ---------- Hoofdstukken ---------- */
  chapters: [
    { key: 'personality', title: 'Who are you?',          intro: 'Eerst jij.' },
    { key: 'season',      title: 'What makes you glow?',  intro: 'Dan wat jou laat stralen.' },
    { key: 'preference',  title: 'What do you love?',     intro: 'Tot slot je smaak.' }
  ],

  /* ---------- Vragen ----------
     type: 'single' of 'multi' (met max). Ieder antwoord heeft 'effects':
       personality: { trait: punten }   season: { seizoen: punten }   pref: { sleutel: waarde } */
  questions: [
    /* WHO ARE YOU? */
    { id: 'room', chapter: 'personality', type: 'single', title: 'Je loopt een volle ruimte binnen. Wat doe je?', answers: [
      { label: 'Ik kijk eerst rustig rond', sub: 'en zie meer dan anderen denken', effects: { personality: { mysterious: 2, calm: 1 } } },
      { label: 'Ik maak meteen contact', sub: 'binnen vijf minuten ken ik iemand', effects: { personality: { warm: 2, playful: 1 } } },
      { label: 'Ik neem vanzelf de leiding', sub: 'iemand moet het doen', effects: { personality: { confident: 2 } } },
      { label: 'Ik zoek wat nieuw of anders is', sub: 'de interessantste hoek', effects: { personality: { creative: 2, adventurous: 1 } } }
    ] },
    { id: 'mood', chapter: 'personality', type: 'single', title: 'Welke sfeer voelt het meest als jij?', answers: [
      { label: 'Een diner bij kaarslicht', effects: { personality: { romantic: 2, mysterious: 1 } } },
      { label: 'Een zondagochtend in linnen', effects: { personality: { calm: 2, optimistic: 1 } } },
      { label: 'Een roadtrip langs de kust', effects: { personality: { adventurous: 2, playful: 1 } } },
      { label: 'Een galerie met witte muren', effects: { personality: { elegant: 2, creative: 1 } } },
      { label: 'Een terras vol mensen en muziek', effects: { personality: { playful: 2, warm: 1 } } },
      { label: 'Een jazzclub na middernacht', effects: { personality: { mysterious: 2, confident: 1 } } }
    ] },
    { id: 'words', chapter: 'personality', type: 'multi', min: 2, max: 2, title: 'Kies twee woorden die bij je passen', hint: 'Precies twee.', answers: [
      { label: 'Krachtig', effects: { personality: { confident: 2 } } },
      { label: 'Romantisch', effects: { personality: { romantic: 2 } } },
      { label: 'Rustig', effects: { personality: { calm: 2 } } },
      { label: 'Creatief', effects: { personality: { creative: 2 } } },
      { label: 'Avontuurlijk', effects: { personality: { adventurous: 2 } } },
      { label: 'Elegant', effects: { personality: { elegant: 2 } } },
      { label: 'Warm', effects: { personality: { warm: 2 } } },
      { label: 'Speels', effects: { personality: { playful: 2 } } },
      { label: 'Mysterieus', effects: { personality: { mysterious: 2 } } },
      { label: 'Optimistisch', effects: { personality: { optimistic: 2 } } }
    ] },

    /* WHAT MAKES YOU GLOW? */
    { id: 'metal', chapter: 'season', type: 'single', title: 'Wat staat je mooier: goud of zilver?', hint: 'Goud wijst op een warme ondertoon, zilver op een koele.', answers: [
      { label: 'Goud', effects: { season: { spring: 2, autumn: 2 } } },
      { label: 'Zilver', effects: { season: { summer: 2, winter: 2 } } },
      { label: 'Allebei, of ik weet het niet', effects: { season: {} } }
    ] },
    { id: 'look', chapter: 'season', type: 'single', title: 'Welke omschrijving lijkt het meest op jou?', answers: [
      { label: 'Licht en fris', sub: 'blond, lichte ogen, blozende huid', effects: { season: { spring: 3, summer: 1 } } },
      { label: 'Zacht en koel', sub: 'asblond of lichtbruin, grijs- of blauwgroene ogen', effects: { season: { summer: 3 } } },
      { label: 'Warm en aards', sub: 'koper, kastanje of warm bruin, groene of bruine ogen', effects: { season: { autumn: 3, spring: 1 } } },
      { label: 'Donker en uitgesproken', sub: 'donker haar, veel contrast met je huid of ogen', effects: { season: { winter: 3, autumn: 1 } } }
    ] },

    /* WHAT DO YOU LOVE? */
    { id: 'intensity', chapter: 'preference', type: 'single', title: 'Subtiel of opvallend?', answers: [
      { label: 'Subtiel', sub: 'verzorgd, niemand kijkt twee keer', effects: { pref: { intensity: 1 } } },
      { label: 'Ertussenin', sub: 'gezien, niet geschreeuwd', effects: { pref: { intensity: 2 } } },
      { label: 'Opvallend', sub: 'mijn handen mogen praten', effects: { pref: { intensity: 3 } } }
    ] },
    { id: 'pain', chapter: 'preference', type: 'single', title: 'Wat gaat er nu vaak mis als je een kleur kiest?', answers: [
      { label: 'Ik koop kleuren die ik daarna bijna niet draag', effects: { pref: { pain: 'unworn' } } },
      { label: 'Ik kies eigenlijk altijd dezelfde kleur', effects: { pref: { pain: 'same' } } },
      { label: 'Op mijn hand oogt een kleur anders dan in het flesje', effects: { pref: { pain: 'flat' } } },
      { label: 'Ik weet nooit precies wat bij me past', effects: { pref: { pain: 'unsure' } } },
      { label: 'Niets, ik zoek gewoon iets nieuws', effects: { pref: { pain: 'none' } } }
    ] }
  ],


  /* ---------- Salesmechaniek ----------
     insights: inzicht vóór een hoofdstuk (Challenger). {pref} en {season} worden de weging in procenten.
     mirror: kop boven de eigenschappen die we tot dan toe zien (spiegelen).
     reveal: korte opbouw vóór de uitslag. {n} = aantal kleuren.
     painLabels: benoemen de frustratie die iemand bij vraag 'pain' koos (tactical empathy).
     commitment: kleine 'ja' op de uitslag.
     objections: 'Wat houdt je nog tegen?' als dropdown (Isolate & Close). action bepaalt wat de engine toont:
       lamp | skill | two | work | later | close */
  insights: {
    season: {
      eyebrow: 'Goed om te weten',
      title: 'Het flesje vertelt je niet alles',
      text: 'Een kleur kies je vaak op hoe het flesje eruitziet. Maar dezelfde kleur kan op de ene hand stralen en op de andere vlak ogen. Dat zit vooral in je ondertoon: warm, koel of neutraal. Daarom kijken we nu naar jou, niet naar het flesje.',
      mirror: 'Wat we tot nu toe zien',
      cta: 'Verder naar je kleurtype'
    }
  },

  reveal: {
    title: 'We leggen je antwoorden naast alle {n} MIRA Colors',
    steps: ['Jouw persoonlijkheid', 'Jouw kleurtype', 'Jouw stijl', 'Jouw top 3'],
    stepMs: 650
  },

  painLabels: {
    unworn: 'Je zei dat je kleuren koopt die je daarna bijna niet draagt. Dat gebeurt vaak als een kleur bij je smaak past, maar niet bij jou. Daarom telde je persoonlijkheid hier het zwaarst.',
    same: 'Je zei dat je eigenlijk altijd dezelfde kleur kiest. Vertrouwd, maar ook een gewoonte. Deze match past bij wie je al bent en is toch een stap verder.',
    flat: 'Je zei dat een kleur op je hand anders oogt dan in het flesje. Dat ligt vaak aan je ondertoon. Daarom telde je kleurtype hier voor {season}% mee.',
    unsure: 'Je zei dat je nooit precies weet wat bij je past. Nu heb je een startpunt dat uitgaat van jou, niet van een trend.',
    none: ''
  },

  commitment: {
    question: 'Herken je jezelf hierin?',
    yes: 'Ja, dit ben ik',
    no: 'Niet helemaal',
    yesText: 'Dan hoort {color} bij jou.',
    noText: 'Dan is {color} misschien meer jij. Deze kleur legt meer nadruk op {essence}.',
    backTo: 'Terug naar {color}'
  },

  objectionsTitle: 'Wat houdt je nog tegen?',
  objectionsHint: 'Tik open wat het dichtst bij komt.',
  backDoor: 'Staat er nog iets tussen jou en {color}?',
  backDoorNo: 'Nee, ik ga voor {color}',
  backDoorYes: 'Ja, nog iets',
  workYes: '{color} past bij een werkdag en bij alles wat daarna komt.',
  workAlt: 'Zoek je iets stillers voor kantoor? {alt} past ook bij je, met {percent}% match, en valt zachter op.',
  twoCta: 'Neem {a} en {b}',
  laterCta: 'Alle MIRA Colors',
  closeCta: 'Leg {color} in je winkelmand',
  objections: [
    { id: 'lamp', option: 'Ik heb nog geen lamp', action: 'lamp',
      empathy: 'Het klinkt alsof je nog niet weet of je het hele ritueel in huis wilt halen.',
      answer: 'Een kleur wordt pas echt vast onder licht. Gellak hardt uit onder UV/LED, dus een lamp hoort erbij. Je neemt hem los, of begint in \u00e9\u00e9n keer met het starterpack.' },
    { id: 'skill', option: 'Ik weet niet of ik het zelf kan', action: 'skill',
      empathy: 'Het klinkt alsof dit ritueel tot nu toe van iemand anders was.',
      answer: 'Elke vaste hand begon met een eerste keer. In de Glow Guide staat het ritueel stap voor stap, van prep tot top coat.',
      link: { label: 'Lees de Glow Guide', url: '/blogs/glow-guides/stap-voor-stap-de-perfecte-gelpolish-manicure-thuis' } },
    { id: 'two', option: 'Ik twijfel tussen twee kleuren', action: 'two',
      empathy: 'Het klinkt alsof ze allebei een kant van jou laten zien.',
      answer: 'Dan hoef je niet te kiezen. De ene draag je nu, de andere bewaar je voor een ander verhaal.' },
    { id: 'work', option: 'Past het wel bij mijn werk?', action: 'work',
      empathy: 'Het klinkt alsof je een kleur zoekt die ook op maandagochtend klopt.',
      answer: '' },
    { id: 'later', option: 'Ik wil eerst nog rondkijken', action: 'later',
      empathy: 'Het klinkt alsof je liever zeker weet dan snel kiest. Dat past bij je.',
      answer: 'Een goede kleur mag rijpen. Bewaar je kaart hieronder, dan vind je hem zo terug. Of leg je top 3 naast alle andere MIRA Colors.' },
    { id: 'close', option: 'Niets, ik ga ervoor', action: 'close',
      empathy: '',
      answer: 'Dan wacht {color} op je.' }
  ],

  /* ---------- Ritueel (onder de uitslag) ---------- */
  ritual: {
    starterPackUrl: '',   /* TODO Luca: link naar het MIRA starterpack */
    bundleTitle: 'Maak je ritueel compleet',
    bundleText: 'Base coat eronder, top coat erover. Zo draag je {color} zoals hij bedoeld is.',
    bundle: ['mira-gellak-base-coat', 'mira-signature-top-coat-no-wipe'],
    lamp: 'mira-glow-go-led-lamp',
    essentials: [
      { handle: 'mira-glow-go-led-lamp', why: 'Gellak hardt uit onder UV/LED-licht.' },
      { handle: 'mira-signature-nail-prep', why: 'Een schone nagel voordat je begint.' },
      { handle: 'mira-gellak-base-coat', why: 'De eerste laag onder je kleur.' },
      { handle: 'mira-signature-top-coat-no-wipe', why: 'Glans en afwerking, zonder afnemen.' },
      { handle: 'mira-banana-file', why: 'Voor vorm en een strakke rand.' },
      { handle: 'mira-signature-gelpolish-remover', why: 'Voor als je weer verder wilt.' }
    ]
  },

  /* ---------- Kleuren ----------
     Persoonlijkheid en Color Story zijn CONCEPT (storyStatus: 'concept') tot MIRA ze per kleur vastlegt.
     season: hoe goed de kleur bij elk seizoenstype past (0-1), afgeleid van ondertoon, diepte en helderheid. Vrij aan te passen.
     appearance: warm/cool/neutral, light/medium/deep, soft/clear, contrast low/high. */
  colors: [
    {"handle": "roze-gellak-alba", "name": "Alba", "family": "roze", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "neutral", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.8, "romantic": 0.7, "elegant": 0.6}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.7, "winter": 0.5}, "style": ["romantic", "timeless"], "occasion": ["everyday", "work"], "story": "Alba betekent dageraad. Het eerste roze licht boven het landschap: zacht, sereen en nog vol belofte.", "storyStatus": "concept"},
    {"handle": "witte-gellak-alpino", "name": "Alpino", "family": "wit", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.8, "elegant": 0.7, "creative": 0.3}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.4, "winter": 0.6}, "style": ["fresh", "timeless"], "occasion": ["everyday", "work", "special"], "story": "Van de Alpen. Melkwit als verse sneeuw, een stille basis voor alles wat nog komt.", "storyStatus": "concept"},
    {"handle": "rood-paarse-gellak-amarena", "name": "Amarena", "family": "rood", "finish": "creme", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"confident": 0.8, "mysterious": 0.6, "romantic": 0.5}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["bold", "classy"], "occasion": ["evening", "special"], "story": "De donkere Italiaanse kers. Diep roodpaars, verleidelijk en vol karakter.", "storyStatus": "concept"},
    {"handle": "beige-nude-gellak-amaretto", "name": "Amaretto", "family": "nude", "finish": "creme", "characteristics": {"tone": "warm", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"warm": 0.9, "calm": 0.6, "elegant": 0.5}, "season": {"spring": 1.0, "summer": 0.8, "autumn": 0.9, "winter": 0.3}, "style": ["timeless", "classy"], "occasion": ["everyday", "work"], "story": "Vernoemd naar de Italiaanse likeur. Warm en uitnodigend, als een avond die nergens heen hoeft.", "storyStatus": "concept"},
    {"handle": "bordeaux-rode-gellak-amarone", "name": "Amarone", "family": "rood", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "neutral", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"confident": 0.8, "elegant": 0.8, "mysterious": 0.5}, "season": {"spring": 0.4, "summer": 0.7, "autumn": 1.0, "winter": 0.7}, "style": ["classy", "bold"], "occasion": ["evening", "work", "special"], "story": "De wijn uit Veneto. Diep wijnrood, met de rust van iemand die niets hoeft te bewijzen.", "storyStatus": "concept"},
    {"handle": "amber-goud-gellak-ambra", "name": "Ambra", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "clear", "contrast": "low"}, "personality": {"warm": 0.8, "optimistic": 0.6, "creative": 0.5}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.8, "winter": 0.6}, "style": ["classy", "playful"], "occasion": ["evening", "special"], "story": "Amber in de mediterrane zon. Een gouden gloed die pas echt leeft in het licht.", "storyStatus": "concept"},
    {"handle": "rood-gellak-amore-mio", "name": "Amore Mio", "family": "rood", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "clear", "contrast": "low"}, "personality": {"romantic": 0.9, "confident": 0.7, "warm": 0.6}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.8, "winter": 0.6}, "style": ["romantic", "bold"], "occasion": ["evening", "special"], "story": "Mijn liefde. Rood met een hart dat sneller klopt, passie en Italiaanse allure in één streek.", "storyStatus": "concept"},
    {"handle": "grijze-gellak-ardesia", "name": "Ardesia", "family": "grijs", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "neutral", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.7, "elegant": 0.7, "confident": 0.4}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 1.0, "winter": 0.6}, "style": ["timeless", "classy"], "occasion": ["work", "everyday"], "story": "Leisteen na een zomerse regenbui. Kracht en rust in één neutrale tint.", "storyStatus": "concept"},
    {"handle": "transparant-zilver-blauwe-gellak-astro", "name": "Astro", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"creative": 0.7, "mysterious": 0.6, "playful": 0.4}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["fresh", "playful"], "occasion": ["everyday", "special"], "story": "Sterrenlicht op kalm water. Een etherische glans die vanuit elke hoek anders oplicht.", "storyStatus": "concept"},
    {"handle": "rosegouden-gellak-aurata", "name": "Aurata", "family": "metallic", "finish": "metallic", "characteristics": {"tone": "warm", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "clear", "contrast": "low"}, "personality": {"romantic": 0.6, "warm": 0.6, "optimistic": 0.6}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.6, "winter": 0.5}, "style": ["romantic", "playful"], "occasion": ["evening", "special"], "story": "Verguld. Het zachte gouden licht van de Italiaanse ochtendzon.", "storyStatus": "concept"},
    {"handle": "roze-gellak-baciata", "name": "Baciata", "family": "roze", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.9, "warm": 0.6, "playful": 0.4}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["romantic"], "occasion": ["everyday", "special"], "story": "Gekust. De zachte blos die achterblijft na een kus.", "storyStatus": "concept"},
    {"handle": "beige-taupe-gellak-biscotto", "name": "Biscotto", "family": "nude", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.8, "warm": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["timeless"], "occasion": ["everyday", "work"], "story": "Koekje, naar de romige tinten van Italiaans gebak. Rustig, warm en altijd goed.", "storyStatus": "concept"},
    {"handle": "wijnrood-gellak-bordo", "name": "Bordo", "family": "rood", "finish": "creme", "characteristics": {"tone": "warm", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "warm", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"confident": 0.8, "elegant": 0.7, "romantic": 0.4}, "season": {"spring": 0.5, "summer": 0.4, "autumn": 1.0, "winter": 0.5}, "style": ["classy", "bold"], "occasion": ["evening", "work", "special"], "story": "Bordeauxrood als fluweel. Klassiek, warm en verleidelijk.", "storyStatus": "concept"},
    {"handle": "bordeauxrode-gellak-borgogna", "name": "Borgogna", "family": "rood", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "neutral", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"elegant": 0.8, "confident": 0.7, "mysterious": 0.4}, "season": {"spring": 0.4, "summer": 0.7, "autumn": 1.0, "winter": 0.7}, "style": ["classy", "timeless"], "occasion": ["evening", "special"], "story": "Bourgondië en zijn diepe wijnen. Tijdloze elegantie met een sensuele rand.", "storyStatus": "concept"},
    {"handle": "donkergroen-zwart-metallic-gellak-bosincanto", "name": "Bosincanto", "family": "groen", "finish": "metallic", "characteristics": {"tone": "neutral", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "neutral", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"mysterious": 0.9, "adventurous": 0.6, "confident": 0.6}, "season": {"spring": 0.4, "summer": 0.7, "autumn": 1.0, "winter": 0.7}, "style": ["bold"], "occasion": ["evening", "special"], "story": "Een betoverd Italiaans woud. Bijna zwart groen, met licht dat je pas van dichtbij ziet.", "storyStatus": "concept"},
    {"handle": "transparant-zilver-glitter-gellak-brina-gelata", "name": "Brina Gelata", "family": "topper", "finish": "glitter", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"playful": 0.7, "optimistic": 0.6, "creative": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["playful", "fresh"], "occasion": ["special", "evening"], "story": "Bevroren rijp. IJskristallen in het eerste ochtendlicht.", "storyStatus": "concept"},
    {"handle": "transparant-parelmoer-wit-gellak-brivido", "name": "Brivido", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"calm": 0.6, "elegant": 0.6, "creative": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["fresh"], "occasion": ["everyday", "special"], "story": "Rilling. Het frisse, tintelende gevoel van een koele bries.", "storyStatus": "concept"},
    {"handle": "mokka-bruine-gellak-brunetto", "name": "Brunetto", "family": "bruin", "finish": "creme", "characteristics": {"tone": "warm", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "warm", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"confident": 0.7, "warm": 0.7, "elegant": 0.6}, "season": {"spring": 0.5, "summer": 0.4, "autumn": 1.0, "winter": 0.5}, "style": ["classy", "timeless"], "occasion": ["everyday", "evening"], "story": "Espresso, diep en warm. Krachtig zonder ooit luid te worden.", "storyStatus": "concept"},
    {"handle": "bruine-nude-gellak-cacao", "name": "Cacao", "family": "bruin", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"warm": 0.9, "calm": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["timeless"], "occasion": ["everyday", "work"], "story": "Cacao en melkchocolade. Warmte en verfijning in een natuurlijke tint.", "storyStatus": "concept"},
    {"handle": "oudroze-nude-gellak-caffe-crema", "name": "Caffé Crema", "family": "nude", "finish": "creme", "characteristics": {"tone": "warm", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.7, "elegant": 0.7, "romantic": 0.5}, "season": {"spring": 1.0, "summer": 0.8, "autumn": 0.9, "winter": 0.3}, "style": ["timeless", "classy"], "occasion": ["everyday", "work"], "story": "De crema op een Italiaanse koffie. Subtiel, romig en zeker niet saai.", "storyStatus": "concept"},
    {"handle": "bruine-gellak-camelia", "name": "Camelia", "family": "bruin", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "neutral", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.8, "warm": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 1.0, "winter": 0.6}, "style": ["romantic", "timeless"], "occasion": ["everyday", "evening"], "story": "De cameliabloem. Warm bruin met een romantische mauve ondertoon.", "storyStatus": "concept"},
    {"handle": "lichtgrijze-gellak-cenerella", "name": "Cenerella", "family": "grijs", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.9, "elegant": 0.6, "creative": 0.3}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.4, "winter": 0.6}, "style": ["timeless", "fresh"], "occasion": ["work", "everyday"], "story": "Naar cenere, as. Een zachte asgrijze rust die bij alles past.", "storyStatus": "concept"},
    {"handle": "kobalt-blauwe-gellak-cobalto", "name": "Cobalto", "family": "blauw", "finish": "creme", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"confident": 0.9, "adventurous": 0.7, "creative": 0.5}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["bold"], "occasion": ["evening", "special"], "story": "Kobalt, de diepblauwe zee langs de Italiaanse kust. Helder genoeg om op te vallen.", "storyStatus": "concept"},
    {"handle": "koraalroze-gellak-corallina", "name": "Corallina", "family": "roze", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "clear", "contrast": "low"}, "personality": {"optimistic": 0.9, "playful": 0.7, "warm": 0.6}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.8, "winter": 0.6}, "style": ["fresh", "playful"], "occasion": ["everyday", "special"], "story": "Koraal en zonovergoten kustdagen. Vrolijk, warm en toch verfijnd.", "storyStatus": "concept"},
    {"handle": "beige-gouden-gellak-creta", "name": "Creta", "family": "nude", "finish": "shimmer", "characteristics": {"tone": "warm", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"warm": 0.7, "elegant": 0.7, "calm": 0.5}, "season": {"spring": 1.0, "summer": 0.8, "autumn": 0.9, "winter": 0.3}, "style": ["classy", "timeless"], "occasion": ["everyday", "special"], "story": "Het zonovergoten mediterrane landschap. Nude met een warme gouden gloed.", "storyStatus": "concept"},
    {"handle": "transparant-zilveren-paars-blauwe-gellak-cristallo", "name": "Cristallo", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"creative": 0.7, "playful": 0.5, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["fresh", "playful"], "occasion": ["everyday", "special"], "story": "Kristal. Helder, sprankelend en net dat beetje extra.", "storyStatus": "concept"},
    {"handle": "poederroze-gellak-desideria", "name": "Desideria", "family": "roze", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.8, "calm": 0.6, "elegant": 0.6}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.4, "winter": 0.6}, "style": ["romantic", "timeless"], "occasion": ["everyday", "work"], "story": "Verlangen. Een poederzacht roze vol stille elegantie.", "storyStatus": "concept"},
    {"handle": "rosegouden-metallic-gellak-divina", "name": "Divina", "family": "metallic", "finish": "metallic", "characteristics": {"tone": "warm", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "clear", "contrast": "low"}, "personality": {"romantic": 0.7, "optimistic": 0.6, "elegant": 0.6}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.6, "winter": 0.5}, "style": ["romantic", "playful"], "occasion": ["special", "evening"], "story": "Goddelijk. Roségoud dat het licht vangt zonder overdadig te worden.", "storyStatus": "concept"},
    {"handle": "lichtroze-gellak-dolce-vita", "name": "Dolce Vita", "family": "roze", "finish": "creme", "characteristics": {"tone": "warm", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "clear", "contrast": "low"}, "personality": {"optimistic": 0.8, "playful": 0.6, "warm": 0.6}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.6, "winter": 0.5}, "style": ["fresh", "romantic"], "occasion": ["everyday"], "story": "Het zoete leven. Genieten van kleine momenten, in zacht lichtroze.", "storyStatus": "concept"},
    {"handle": "perzik-roze-gellak-dolcetto", "name": "Dolcetto", "family": "roze", "finish": "creme", "characteristics": {"tone": "warm", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "clear", "contrast": "low"}, "personality": {"playful": 0.7, "optimistic": 0.7, "romantic": 0.5}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.6, "winter": 0.5}, "style": ["fresh", "playful"], "occasion": ["everyday"], "story": "Klein zoetje. Perzikroze met een natuurlijke gloed.", "storyStatus": "concept"},
    {"handle": "nude-beige-gellak-duna", "name": "Duna", "family": "nude", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "neutral", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.9, "elegant": 0.6, "warm": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.7, "winter": 0.5}, "style": ["timeless"], "occasion": ["everyday", "work"], "story": "Duin. Zonverwarmd zand en de zachte tinten van het mediterrane landschap.", "storyStatus": "concept"},
    {"handle": "donker-groene-glitter-gellak-eclissi", "name": "Eclissi", "family": "groen", "finish": "glitter", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"mysterious": 0.9, "creative": 0.6, "confident": 0.5}, "season": {"spring": 0.2, "summer": 0.8, "autumn": 0.8, "winter": 1.0}, "style": ["bold"], "occasion": ["evening", "special"], "story": "Eclips. Het samenspel van licht en duisternis, met een glinstering die het licht vangt.", "storyStatus": "concept"},
    {"handle": "rode-gellak-fiamma", "name": "Fiamma", "family": "rood", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "clear", "contrast": "low"}, "personality": {"confident": 0.9, "warm": 0.7, "adventurous": 0.5}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.8, "winter": 0.6}, "style": ["bold", "classy"], "occasion": ["evening", "special"], "story": "Vlam. Warmte, kracht en energie in een klassiek helderrood.", "storyStatus": "concept"},
    {"handle": "pastelblauwe-gellak-fiordaliso", "name": "Fiordaliso", "family": "blauw", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.7, "creative": 0.6, "optimistic": 0.5}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.4, "winter": 0.6}, "style": ["fresh"], "occasion": ["everyday"], "story": "Korenbloem. Natuurlijke schoonheid en sereniteit in pastelblauw.", "storyStatus": "concept"},
    {"handle": "roze-gellak-fiore-mio", "name": "Fiore Mio", "family": "roze", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "neutral", "depth": "light", "clarity": "clear", "contrast": "low"}, "personality": {"romantic": 0.8, "playful": 0.6, "optimistic": 0.5}, "season": {"spring": 1.0, "summer": 0.8, "autumn": 0.5, "winter": 0.7}, "style": ["romantic", "fresh"], "occasion": ["everyday"], "story": "Mijn bloem. Zacht, speels en elegant, als jonge bloemblaadjes.", "storyStatus": "concept"},
    {"handle": "grijs-taupe-gellak-fumo-rosa", "name": "Fumo Rosa", "family": "grijs", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "medium", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "neutral", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.8, "elegant": 0.7, "mysterious": 0.4}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 1.0, "winter": 0.6}, "style": ["timeless", "classy"], "occasion": ["work", "everyday"], "story": "Roze rook. Een vergrijsde taupe met net genoeg warmte.", "storyStatus": "concept"},
    {"handle": "granaat-rode-gellak-granato", "name": "Granato", "family": "rood", "finish": "creme", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"confident": 0.8, "elegant": 0.6, "romantic": 0.5}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["classy", "bold"], "occasion": ["evening", "special"], "story": "Granaatsteen. Een uitgesproken rood dat de aandacht trekt en verfijnd blijft.", "storyStatus": "concept"},
    {"handle": "licht-roze-gellak-incanta", "name": "Incanta", "family": "roze", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.7, "calm": 0.7, "playful": 0.3}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.4, "winter": 0.6}, "style": ["romantic"], "occasion": ["everyday"], "story": "Pure zachtheid. Een romig lichtroze met een vleugje romantiek.", "storyStatus": "concept"},
    {"handle": "licht-roze-parelmoer-gellak-incanto", "name": "Incanto", "family": "roze", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"romantic": 0.7, "creative": 0.5, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["romantic"], "occasion": ["special", "everyday"], "story": "Betovering. Lichtroze met een dromerige parelmoerglans.", "storyStatus": "concept"},
    {"handle": "lavendel-paarse-gellak-iride", "name": "Iride", "family": "paars", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"creative": 0.8, "playful": 0.6, "mysterious": 0.4}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["playful", "fresh"], "occasion": ["everyday", "special"], "story": "Prisma. Lavendel dat met het licht van kleur verschuift.", "storyStatus": "concept"},
    {"handle": "transparant-turquoise-gellak-laguna-blu", "name": "Laguna Blu", "family": "topper", "finish": "glitter", "characteristics": {"tone": "cool", "depth": "medium", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "medium", "clarity": "clear", "contrast": "low"}, "personality": {"adventurous": 0.7, "optimistic": 0.7, "playful": 0.6}, "season": {"spring": 0.7, "summer": 0.9, "autumn": 0.5, "winter": 1.0}, "style": ["fresh", "playful"], "occasion": ["everyday", "special"], "story": "Een Italiaanse lagune. Kristalhelder turquoise met fijne schittering.", "storyStatus": "concept"},
    {"handle": "transparant-glitter-gellak-lampo", "name": "Lampo", "family": "topper", "finish": "glitter", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"playful": 0.8, "optimistic": 0.6, "adventurous": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["playful", "bold"], "occasion": ["special", "evening"], "story": "Lichtflits. Een heldere sparkle die vanuit elke hoek anders schittert.", "storyStatus": "concept"},
    {"handle": "transparant-goud-glitter-gellak-lucea", "name": "Lucea", "family": "topper", "finish": "glitter", "characteristics": {"tone": "warm", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "clear", "contrast": "low"}, "personality": {"warm": 0.7, "romantic": 0.6, "optimistic": 0.5}, "season": {"spring": 1.0, "summer": 0.5, "autumn": 0.6, "winter": 0.5}, "style": ["classy", "playful"], "occasion": ["evening", "special"], "story": "Kaarslicht. Transparant goud met een verfijnde sparkle.", "storyStatus": "concept"},
    {"handle": "transparante-roze-glitter-gellak-lumina", "name": "Lumina", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "neutral", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "neutral", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.6, "romantic": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.7, "winter": 0.5}, "style": ["fresh", "romantic"], "occasion": ["everyday"], "story": "Het zachte spel van licht. Natuurlijk, met net dat beetje extra glans.", "storyStatus": "concept"},
    {"handle": "zilver-grijs-gellak-lunare", "name": "Lunare", "family": "metallic", "finish": "metallic", "characteristics": {"tone": "cool", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"mysterious": 0.8, "elegant": 0.7, "calm": 0.4}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.6, "winter": 0.7}, "style": ["classy"], "occasion": ["evening", "work"], "story": "Maanlicht. Koel zilvergrijs dat verandert met elk licht.", "storyStatus": "concept"},
    {"handle": "beige-gellak-mielora", "name": "Mielora", "family": "nude", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"warm": 0.8, "elegant": 0.6, "calm": 0.5}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["timeless", "classy"], "occasion": ["everyday", "work"], "story": "Honing. Zachte beige met een gouden warmte.", "storyStatus": "concept"},
    {"handle": "mokka-bruin-gellak-moka-dolce", "name": "Moka Dolce", "family": "bruin", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"warm": 0.8, "calm": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["timeless"], "occasion": ["everyday", "work"], "story": "Romige mokka. Zacht bruin, warm en verzorgd.", "storyStatus": "concept"},
    {"handle": "chocolade-bruine-gellak-morena", "name": "Morena", "family": "bruin", "finish": "creme", "characteristics": {"tone": "warm", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "warm", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"confident": 0.7, "warm": 0.7, "mysterious": 0.4}, "season": {"spring": 0.5, "summer": 0.4, "autumn": 1.0, "winter": 0.5}, "style": ["classy", "bold"], "occasion": ["evening", "everyday"], "story": "Pure chocolade. Diepbruin met een zachte warmte.", "storyStatus": "concept"},
    {"handle": "grijs-blauwe-gellak-nebbia", "name": "Nebbia", "family": "grijs", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.9, "elegant": 0.5, "creative": 0.4}, "season": {"spring": 0.5, "summer": 1.0, "autumn": 0.4, "winter": 0.6}, "style": ["fresh", "timeless"], "occasion": ["work", "everyday"], "story": "Ochtendmist. Koel grijs met een vleugje helder blauw.", "storyStatus": "concept"},
    {"handle": "witte-gellak-neve", "name": "Neve", "family": "wit", "finish": "creme", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 2}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"elegant": 0.6, "creative": 0.6, "calm": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["fresh", "timeless"], "occasion": ["everyday", "special"], "story": "Verse sneeuw. Puur wit voor eenvoud, een French of verfijnde details.", "storyStatus": "concept"},
    {"handle": "zwarte-gellak-notte", "name": "Notte", "family": "zwart", "finish": "creme", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"mysterious": 0.9, "confident": 0.8, "elegant": 0.6}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["bold", "classy"], "occasion": ["evening", "special"], "story": "Nacht. Kracht en verfijning in intens zwart.", "storyStatus": "concept"},
    {"handle": "turquoiseblauw-gellak-oceano-blu", "name": "Oceano Blu", "family": "blauw", "finish": "creme", "characteristics": {"tone": "cool", "depth": "medium", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "medium", "clarity": "clear", "contrast": "low"}, "personality": {"adventurous": 0.8, "optimistic": 0.7, "playful": 0.5}, "season": {"spring": 0.7, "summer": 0.9, "autumn": 0.5, "winter": 1.0}, "style": ["fresh", "bold"], "occasion": ["everyday", "special"], "story": "De mediterrane zee. Fris turquoiseblauw dat direct een vleugje zomer brengt.", "storyStatus": "concept"},
    {"handle": "grijs-bruin-gellak-onice", "name": "Onice", "family": "grijs", "finish": "shimmer", "characteristics": {"tone": "neutral", "depth": "deep", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "neutral", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"mysterious": 0.7, "elegant": 0.7, "calm": 0.4}, "season": {"spring": 0.4, "summer": 0.7, "autumn": 1.0, "winter": 0.7}, "style": ["classy"], "occasion": ["evening", "work"], "story": "Onyx. Een natuursteen met nuances die tot leven komen in het licht.", "storyStatus": "concept"},
    {"handle": "bruin-taupe-gellak-oscuro", "name": "Oscuro", "family": "bruin", "finish": "shimmer", "characteristics": {"tone": "warm", "depth": "deep", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"confident": 0.6, "mysterious": 0.6, "elegant": 0.6}, "season": {"spring": 0.5, "summer": 0.4, "autumn": 1.0, "winter": 0.5}, "style": ["classy"], "occasion": ["evening", "everyday"], "story": "Donker en chic, met een gouden glans die meebeweegt met het licht.", "storyStatus": "concept"},
    {"handle": "olijfgroen-gellak-pietra", "name": "Pietra", "family": "groen", "finish": "creme", "characteristics": {"tone": "neutral", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "neutral", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.8, "elegant": 0.6, "adventurous": 0.4}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 1.0, "winter": 0.6}, "style": ["timeless", "fresh"], "occasion": ["everyday", "work"], "story": "Steen. Gepolijste natuursteen in een ingetogen grijsgroen.", "storyStatus": "concept"},
    {"handle": "oudroze-gellak-rosabella", "name": "Rosabella", "family": "roze", "finish": "shimmer", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.8, "warm": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["romantic"], "occasion": ["everyday", "special"], "story": "Oudroze met een delicate parelmoerglans. Zacht, met een bijzondere diepte.", "storyStatus": "concept"},
    {"handle": "metallic-roze-rose-gellak-rosaura", "name": "Rosaura", "family": "roze", "finish": "metallic", "characteristics": {"tone": "neutral", "depth": "medium", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "neutral", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.7, "elegant": 0.7, "mysterious": 0.3}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 1.0, "winter": 0.6}, "style": ["classy", "romantic"], "occasion": ["evening", "special"], "story": "De gloed van rosé. Mauve-roze met een subtiel metallic effect.", "storyStatus": "concept"},
    {"handle": "robijnrode-gellak-rubino-rosso", "name": "Rubino Rosso", "family": "rood", "finish": "creme", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"confident": 0.9, "romantic": 0.6, "adventurous": 0.4}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["bold", "classy"], "occasion": ["evening", "special"], "story": "Robijn. Intens rood, klassiek, krachtig en chic.", "storyStatus": "concept"},
    {"handle": "zand-beige-gellak-sabbia", "name": "Sabbia", "family": "nude", "finish": "creme", "characteristics": {"tone": "warm", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"calm": 0.9, "warm": 0.6, "elegant": 0.4}, "season": {"spring": 1.0, "summer": 0.8, "autumn": 0.9, "winter": 0.3}, "style": ["timeless"], "occasion": ["everyday", "work"], "story": "Zonverwarmd zand aan de mediterrane kust. Rustig en natuurlijk.", "storyStatus": "concept"},
    {"handle": "aubergine-paars-rode-gellak-segreto-nero", "name": "Segreto Nero", "family": "paars", "finish": "glitter", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"mysterious": 0.9, "confident": 0.6, "romantic": 0.5}, "season": {"spring": 0.2, "summer": 0.8, "autumn": 0.8, "winter": 1.0}, "style": ["bold", "classy"], "occasion": ["evening", "special"], "story": "Zwart geheim. Diep aubergine dat zijn karakter pas in het licht laat zien.", "storyStatus": "concept"},
    {"handle": "mira-signature-gelpolish-selenia", "name": "Selenia", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"mysterious": 0.6, "creative": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["fresh"], "occasion": ["everyday", "special"], "story": "De maan. Zacht zilver met een koele blauwe reflectie.", "storyStatus": "concept"},
    {"handle": "groene-gellak-selva", "name": "Selva", "family": "groen", "finish": "creme", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"adventurous": 0.7, "confident": 0.7, "calm": 0.4}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["bold", "classy"], "occasion": ["evening", "everyday"], "story": "Een weelderig woud. De rust en kracht van de natuur in smaragdgroen.", "storyStatus": "concept"},
    {"handle": "transparant-wit-zilver-gellak-stellina", "name": "Stellina", "family": "topper", "finish": "shimmer", "characteristics": {"tone": "cool", "depth": "light", "chroma": "bright", "intensity": 1}, "appearance": {"undertone": "cool", "depth": "light", "clarity": "clear", "contrast": "high"}, "personality": {"optimistic": 0.6, "playful": 0.6, "romantic": 0.4}, "season": {"spring": 0.8, "summer": 1.0, "autumn": 0.3, "winter": 1.0}, "style": ["fresh", "playful"], "occasion": ["everyday", "special"], "story": "Kleine ster. Wit en zilver met een zachte, bijzondere glow.", "storyStatus": "concept"},
    {"handle": "bruin-gellak-tartufo", "name": "Tartufo", "family": "bruin", "finish": "metallic", "characteristics": {"tone": "warm", "depth": "deep", "chroma": "muted", "intensity": 2}, "appearance": {"undertone": "warm", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"warm": 0.6, "confident": 0.6, "mysterious": 0.5}, "season": {"spring": 0.5, "summer": 0.4, "autumn": 1.0, "winter": 0.5}, "style": ["classy"], "occasion": ["evening", "everyday"], "story": "Truffel. Aardse bruintinten met een elegante glans.", "storyStatus": "concept"},
    {"handle": "grijs-metalic-glitter-gellak-tempesta", "name": "Tempesta", "family": "grijs", "finish": "glitter", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "muted", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "soft", "contrast": "high"}, "personality": {"adventurous": 0.7, "mysterious": 0.7, "confident": 0.6}, "season": {"spring": 0.2, "summer": 0.8, "autumn": 0.8, "winter": 1.0}, "style": ["bold"], "occasion": ["evening", "special"], "story": "Storm. Diepgrijs met een sprankelend metallic effect.", "storyStatus": "concept"},
    {"handle": "toffee-beige-gellak-toffina", "name": "Toffina", "family": "nude", "finish": "creme", "characteristics": {"tone": "warm", "depth": "medium", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "medium", "clarity": "soft", "contrast": "low"}, "personality": {"warm": 0.8, "calm": 0.6, "elegant": 0.5}, "season": {"spring": 0.8, "summer": 0.7, "autumn": 1.0, "winter": 0.4}, "style": ["timeless"], "occasion": ["everyday", "work"], "story": "Romige toffee. Warm beige met een vleugje mauve.", "storyStatus": "concept"},
    {"handle": "peach-roze-gellak-velluto", "name": "Velluto", "family": "roze", "finish": "shimmer", "characteristics": {"tone": "warm", "depth": "light", "chroma": "muted", "intensity": 1}, "appearance": {"undertone": "warm", "depth": "light", "clarity": "soft", "contrast": "low"}, "personality": {"romantic": 0.7, "elegant": 0.7, "warm": 0.4}, "season": {"spring": 1.0, "summer": 0.8, "autumn": 0.9, "winter": 0.3}, "style": ["romantic", "classy"], "occasion": ["everyday", "special"], "story": "Fluweel. Een nude basis met een zachte, rijke glans.", "storyStatus": "concept"},
    {"handle": "groene-gellak-verdalia", "name": "Verdalia", "family": "groen", "finish": "metallic", "characteristics": {"tone": "cool", "depth": "deep", "chroma": "bright", "intensity": 3}, "appearance": {"undertone": "cool", "depth": "deep", "clarity": "clear", "contrast": "high"}, "personality": {"adventurous": 0.8, "creative": 0.6, "mysterious": 0.5}, "season": {"spring": 0.3, "summer": 0.5, "autumn": 0.5, "winter": 1.0}, "style": ["bold"], "occasion": ["evening", "special"], "story": "De mediterrane natuur. Groen en blauw samen, karaktervol en luxe.", "storyStatus": "concept"}
  ]
};
