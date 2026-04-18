# 🧬 ImunoMap — Atlas Interactiv al Sistemului Imun

[![Electron](https://img.shields.io/badge/Electron-28-47848F)](https://www.electronjs.org/)
[![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3.28-F7B32B)](https://js.cytoscape.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**ImunoMap** este o aplicație desktop profesională care oferă o hartă interactivă, tip rețea, a sistemului imun uman. Integrează toate cunoștințele din *Janeway's Immunobiology* (ediția a 9-a) și din *Tehnici utilizate în imunologie* (Cianga, PIM 2008), oferind totodată **ImmunoScript** — un limbaj de programare specializat pentru imunologi și cercetători.

---

## 📚 Cuprins

1. [Descriere](#descriere)
2. [Funcționalități](#funcționalități)
3. [Instalare](#instalare)
4. [Structura aplicației](#structura-aplicației)
5. [ImmunoScript — referință de limbaj](#immunoscript--referință-de-limbaj)
6. [Arhitectură tehnică](#arhitectură-tehnică)
7. [Surse științifice](#surse-științifice)
8. [Construire pentru distribuție](#construire-pentru-distribuție)
9. [Licență](#licență)

---

## Descriere

ImunoMap oferă o perspectivă de sistem asupra imunologiei, cu accent pe **interactivitate** și pe **detaliu molecular**. Nu este doar un vizualizator — este un mediu complet care include:

- **Harta interactivă** a interacțiunilor imune (peste 50 de tipuri celulare, molecule, legături efectorii)
- **Diagrame moleculare** ale semnalizării TCR, BCR, JAK-STAT, NF-κB, complement
- **Genetică imună** — recombinare V(D)J, sistem HLA cu toate metodele moderne de tipare
- **Laboratorul complet** — peste 30 de tehnici, de la Ouchterlony la CRISPR/Cas9
- **Un limbaj de programare** propriu (ImmunoScript) pentru a scrie scripturi de simulare, tipare HLA, protocoale de laborator

---

## Funcționalități

### 🗺 Harta imună (Cytoscape)
- Peste 50 de noduri celulare, 30+ citokine, 10+ MHC, 5 Ig, 60+ markere CD
- Muchii color-codate pe tip de interacțiune (diferențiere, activare, inhibiție, ajutor, citotoxicitate, prezentare, secreție, recrutare)
- Layout-uri multiple (cose-bilkent, concentric, grid, BFS)
- Filtrare live pe clasă (celule, citokine, anticorpi, MHC)
- Panou de detalii lateral cu toate proprietățile din surse

### 🧬 Genetică
- Organizarea locuselor IGH, IGK, IGL, TRA, TRB, TRG, TRD
- Mecanismul V(D)J pas cu pas (RAG1/2, TdT, Artemis, DNA-PKcs, Ku, Ligase IV)
- AID, SHM, CSR — cu citokinele care direcționează switch-ul
- Sistemul HLA: polimorfism, nomenclatură 4-field, IMGT
- Metode de tipare: CDC, flow, PCR-SSP, PCR-SSOP, SBT, NGS
- Cross-match CDC / Flow / Virtual (Luminex SAB); DSA; PRA
- Toate modelele animale: inbred, congenic, chimera, SCID, nude, NSG, transgenic, KO, KI, CRISPR

### ⚗ Biochimie
- Cascada TCR completă (Lck → ZAP-70 → LAT → PLCγ1 → NFAT/NF-κB/AP-1)
- CD28 / CTLA-4 / PD-1 / LAG-3 / TIM-3 / TIGIT cu medicamentele specifice
- Cascada BCR (Lyn → Syk → Btk → BLNK) și complexul CD19/CD21/CD81
- JAK-STAT — toate citokinele cuplate cu JAK-ii și STAT-urile respective
- NF-κB canonic și non-canonic
- Procesarea antigenelor pe MHC-I (proteazom, TAP, PLC) și MHC-II (Ii, CLIP, HLA-DM/DO)
- Apoptoza — extrinsecă (Fas/TRAIL), intrinsecă (Bcl-2 family, MOMP)
- Inflamazom NLRP3 (CAPS, guta)
- Explozia respiratorie (CGD, test DHR)
- Cascada adeziunii leucocitare și LAD-1/2/3
- Complement — toate cele 3 căi, cu C3/C5 convertaze și bucla de amplificare

### 🔬 Tehnici de laborator
**Preluate aproape integral din Cianga (PIM 2008)**:
- Precipitare: Ouchterlony, Mancini, imunelectroforeză, IFE, rocket, IEF
- Aglutinare: directă/indirectă/Coombs (direct și indirect)
- Faza solidă: RIA, RIST, RAST, ELISA (toate variantele), ELISPOT, chemiluminiscență, Luminex xMAP, SPR/BLI
- Microscopie: IHC (ABC, PAP, APAAP), imunofluorescență, confocal, super-resolution, TissueFAXS
- Citometrie în flux: compensare, gating, spectral, CyTOF, ImageStream
- Biologie moleculară: extragere ADN/ARN, electroforeză, Southern/Northern/Western, PCR (toate variantele), secvențiere Sanger și NGS, ISH/FISH/CISH/RNAscope, clonare moleculară cu toți vectorii, CRISPR/Cas9 (WT, nickase, dCas9, base editors, prime editors)
- Evaluare funcțională: B (Ig totale, subclase, titre vaccin), T (PPD, MLC, QuantiFERON, proliferare), fagocite (NBT, DHR, chemotaxie), NK (K562, CD107a), complement (CH50, AH50), BAT

### 💻 ImmunoScript IDE
- Editor integrat cu auto-indent
- Executor live (Lexer → Parser → Interpreter — toate scrise de la zero în JavaScript)
- Consolă cu colorare pentru evenimente biologice
- Exemplu încărcabil cu un singur click
- Salvare scripturi cu extensia `.imuno`

### ▶ Simulator
- 5 scenarii pre-configurate (infecție virală acută, bacteriană, helmintică, vaccinare primară, autoimună)
- Timeline animat pas-cu-pas
- Evenimente cronologice cu detalii moleculare

---

## Instalare

### Cerințe
- Node.js 18+ (recomandat 20 LTS)
- npm 9+

### Pași
```bash
git clone <this-repo> imunomap
cd imunomap
npm install
npm start
```

Pentru modul de dezvoltare (cu DevTools deschise):
```bash
npm run dev
```

---

## Structura aplicației

```
imunomap/
├── main.js                  # Electron main process
├── preload.js               # Context bridge securizat (IPC whitelist)
├── package.json
├── src/
│   ├── index.html           # Shell-ul aplicației
│   ├── styles/main.css      # Tema întunecată profesională
│   ├── data/
│   │   ├── cells.js         # 50+ tipuri celulare (HSC → toate subsetele LT)
│   │   ├── molecules.js     # Ig, MHC, CD, citokine, chemokine, complement, PRR
│   │   ├── genetics.js      # V(D)J, HLA, AID, modele animale
│   │   ├── biochemistry.js  # Toate căile de semnalizare
│   │   ├── techniques.js    # 30+ tehnici din Cianga + Janeway
│   │   └── interactions.js  # Muchiile rețelei imune
│   ├── dsl/                 # ImmunoScript compiler
│   │   ├── lexer.js         # Tokenizer
│   │   ├── parser.js        # Recursive descent parser
│   │   ├── interpreter.js   # Tree-walker cu state biologic
│   │   └── stdlib.js        # Biblioteca standard cu obiecte imune pre-încărcate
│   └── js/
│       ├── app.js           # Router
│       └── views/
│           ├── map.js       # Cytoscape network
│           ├── genetics.js
│           ├── biochemistry.js
│           ├── techniques.js
│           ├── ide.js
│           └── simulator.js
└── assets/
    └── icon.png             # Icoană aplicație
```

---

## ImmunoScript — referință de limbaj

ImmunoScript este un limbaj expresiv, inspirat de sintaxa Python, cu **primitive imunologice native**.

### Tipuri de date
- **Numere cu unități**: `50ng`, `10uM`, `2.5pg`
- **Stringuri**: `"SARS-CoV-2"`
- **Liste**: `[IL-2, IL-12, IFN-γ]`
- **Obiecte**: `{ target: IL-6, sample: "ser" }`
- **Obiecte biologice**: rezultatul declarațiilor `cell`, `cytokine`, etc.

### Declarații
```
let x = 5
const MAX = 100
fn activate_B(cell, ligand) {
    return "activated: " + cell.name
}
```

### Declarații imunologice
```
cell myThCell {
    markers: ["CD3", "CD4"],
    cytokines: ["IFN-γ"],
    master_tf: "T-bet"
}

cytokine customIL {
    family: "common γ",
    targets: ["T", "NK"],
    functions: ["proliferare"]
}

antibody monoclonal_Ab {
    target: "CD20",
    isotype: "IgG1",
    use: "tratament LNH"
}
```

### Acțiuni imunologice
```
activate macrofag with IFN-γ
inhibit Th1 by IL-10
secrete Th1 with IFN-γ
kill celulă_infectată by TCD8
present antigen on MHC_II
recruit neutrofil via CXCL8
migrate DC to ganglion
express TCD4 with CCR7
```

### Săgeata de diferențiere
```
TCD4 -> Th1
TCD4 -> differentiate(target: Th17)
```

### Assay (experimente de laborator)
```
assay ELISA_IL6 {
    target: IL-6,
    sample: "ser",
    standard_curve: [0, 10, 50, 100, 500]
}
```

### Simulare
```
simulate response_to("SARS-CoV-2") for 14days
```

### Control flow
```
if x > 100 {
    print("high")
} elif x > 50 {
    print("medium")
} else {
    print("low")
}

for ck in CYTOKINES {
    print(ck.name)
}

while active {
    active = check_status()
}
```

### Pipe operator
```
TCD4 | differentiate | describe
```

### Funcții built-in (stdlib)
- `print(...args)` — afișează în consolă
- `describe(obj)` — listează proprietățile unui obiect bio
- `query(term)` — caută în toate datele după termen
- `differentiate(cell, options)` — produce un derivat celular
- `ELISA({ target, sample })` — simulare ELISA
- `flow_cytometry(sample, markers)` — simulare citometrie
- `PCR({ target, cycles })` — simulare PCR
- `simulate_response(pathogen, days)` — simulare răspuns complet
- `length`, `range`, `keys`, `values`, `push`, `concat`
- Math: `abs`, `min`, `max`, `round`, `floor`, `ceil`, `sqrt`, `pow`, `log2`, `log10`, `random`

### Exemplu complet
```
# Construiește o celulă CAR-T
cell carT {
    markers: ["CD3", "CD8", "CAR-CD19"],
    origin: "Lentivirus transdus",
    functions: ["Citotoxicitate anti-CD19+"]
}

# Diferențiere dintr-un TCD4 naiv
let my_Th1 = differentiate(TCD4, { with: [IL-12, IFN-γ] })
describe(my_Th1)

# Simulează un panou de citometrie
let flow = flow_cytometry("PBMC", [CD3, CD4, CD8, CD19, CD56])
describe(flow)

# Rulează un răspuns imun pe 14 zile
simulate_response("SARS-CoV-2", 14)
```

---

## Arhitectură tehnică

### Electron + renderer securizat
- `contextIsolation: true`
- `nodeIntegration: false`
- IPC whitelist prin `preload.js`

### Compiler ImmunoScript
Scris integral de la zero, fără dependințe externe:

1. **Lexer** (`src/dsl/lexer.js`) — scanner manual caracter-cu-caracter; suportă:
   - Numere cu unități (`50ng` tokenizat ca `{value: 50, unit: "ng"}`)
   - Identificatori cu hyphen (`HLA-DRB1`, `CD11b`, `IL-6`)
   - Comentarii `#`, `//`, `/* */`
   - Stringuri cu escape (`\n`, `\t`, `\\`)

2. **Parser** (`src/dsl/parser.js`) — recursive descent cu precedență corectă a operatorilor:
   - Block statements, expresii, control flow
   - Declarații imunologice (`cell`, `cytokine`, `antibody`, `pathogen`)
   - Acțiuni imunologice (`activate X with Y`)
   - Săgeata `->` pentru diferențiere
   - Pipe `|` pentru compunere funcțională

3. **Interpreter** (`src/dsl/interpreter.js`) — tree-walker cu:
   - Lanț de `Environment`-uri pentru scope lexical
   - Tipuri runtime: `BioObject`, `Quantity`
   - Event log pentru simulări
   - State biologic (celule, citokine, timp)
   - Protecție anti-bucle infinite

### Cytoscape.js pentru harta de rețea
- Layout `cose-bilkent` (plugin)
- Stilizare programatică pe bază de `kind` și `lineage`
- Highlight pentru neighborhood (vecini direcți)

---

## Surse științifice

Datele integrate în această aplicație provin din:

1. **Murphy K., Weaver C.** — *Janeway's Immunobiology*, 9th edition, Garland Science (Taylor & Francis), New York, 2017. ISBN 978-0-8153-4505-3. Utilizat pentru: structura modernă a imunității înnăscute și adaptative, ILC-uri, concept „effector module", γδ-TCR, AID/CSR, semnalizare mTOR/Akt, Tfh, imunitatea mucoaselor, checkpoint blockade, CAR-T, CRISPR/Cas9, mass spectrometry.

2. **Cianga P.** — *Tehnici utilizate în imunologie — Noțiuni introductive*, Editura PIM, Iași, 2008. Utilizat pentru: tehnicile complete de laborator, metodele tradiționale și moderne de tipare HLA, evaluarea funcțională a tuturor populațiilor celulare, biologia moleculară aplicată, modele animale.

Pentru informații de nomenclatură alelică HLA: [**IMGT/HLA Database**](https://www.ebi.ac.uk/ipd/imgt/hla/)

---

## Construire pentru distribuție

Aplicația folosește `electron-builder` pentru împachetare cross-platform:

```bash
# Toate platformele configurate
npm run build

# Individual
npm run build:win     # Windows (NSIS installer + portable)
npm run build:mac     # macOS (DMG)
npm run build:linux   # Linux (AppImage + DEB)
```

Output-ul ajunge în folderul `dist/`.

---

## Performanță și resurse

- Timp de pornire: ~1.5 sec (pe SSD modern)
- Consum RAM: ~180 MB (renderer) + ~100 MB (main) = ~280 MB
- Graph cu ~120 noduri și ~150 muchii — interactiv fluent la 60 fps
- ImmunoScript interpreter: ~100.000 pași/s (suficient pentru simulări de complexitate medie)

---

## Extinderi propuse (roadmap)

- [ ] Integrare cu BLAST/BLASTP pentru căutare secvențe V(D)J
- [ ] Import fișiere FCS (flow cytometry real)
- [ ] Export SVG/PNG pentru harta de rețea
- [ ] Monaco Editor cu autocomplete ImmunoScript
- [ ] Modul de comparare HLA între donor/receptor cu calcul DSA
- [ ] Arbori filogenetici pentru repertoire BCR/TCR
- [ ] Plugin system pentru noi tipuri de assay

---

## Licență

MIT License — vezi fișierul `LICENSE` pentru detalii.

Datele imunologice integrate sunt rezumate didactic; pentru utilizare clinică consultați întotdeauna sursele originale și literatura de specialitate curentă.

---

## Credits

Construit cu recunoștință față de:
- Prof. **Petru Cianga** (UMF „Grigore T. Popa" Iași) — pentru monografia excepțională de tehnici imunologice
- Autorii **Murphy, Weaver, Janeway** — pentru textbookul care a format generații de imunologi
- Comunitatea **Cytoscape.js** și **Electron** — pentru fundamentele open-source

---

<p align="center"><em>„Sistemul imun nu este o colecție de celule, ci o conversație molecular-celulară continuă."</em></p>
