# English Vocabulary Trainer - CLAUDE.md

## Project Overview
App web per memorizzazione vocaboli inglesi con tecnica Spaced Repetition (algoritmo FSRS).

**Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, ts-fsrs
**Target**: Mobile-first, responsive, a costo zero (deploy Vercel)

---

## Commands

### Development
```bash
# Sviluppo locale
npm run dev          # Avvia dev server (porta 3000)

# Build e preview
npm run build        # Build produzione
npm run start        # Preview build locale

# Quality checks
npm run lint         # Linting
npm run type-check   # TypeScript check
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Test in watch mode
npm run test:coverage # Coverage report
```

### Git Workflow
```bash
git status
git add .
git commit -m "feat: descrizione breve"
git push origin main
```

---

## Code Style

### TypeScript
- Usa **strict mode** sempre
- Tipi espliciti per funzioni pubbliche
- Evita `any`, usa `unknown` se necessario
- Props dei componenti tipizzate con interface

### React/Next.js
- **Componenti funzionali** con hooks
- **Server Components** di default (App Router)
- Client Components solo quando necessario (`'use client'`)
- Hooks personalizzati iniziano con `use*`

### Naming Conventions
```typescript
// Files
PascalCase.tsx          // Componenti
camelCase.ts            // Utils, hooks, servizi
kebab-case.css          // Styles (se presenti)

// Code
PascalCase              // Componenti, Tipi, Interface
camelCase               // Variabili, funzioni
UPPER_SNAKE_CASE        // Costanti
```

### Tailwind CSS
- Mobile-first (`base` → `sm:` → `md:` → `lg:`)
- Usa utility classes, evita CSS custom
- Raggruppa classi correlate:
  ```tsx
  <div className="
    flex flex-col gap-4           // Layout
    p-4 rounded-lg                // Spacing & borders
    bg-white dark:bg-gray-800     // Colors
    shadow-md hover:shadow-lg     // Effects
  ">
  ```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── ...                # Altre route
├── components/            # Componenti React
│   ├── ui/               # Componenti UI base
│   ├── flashcard/        # Componenti flashcard
│   ├── dashboard/        # Componenti dashboard
│   └── ...
├── lib/                   # Utilities e logica core
│   ├── fsrs/             # Wrapper ts-fsrs
│   ├── storage/          # localStorage/IndexedDB
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── hooks/                 # Custom React hooks
└── styles/               # Global styles (se necessari)
```

---

## Core Concepts

### 1. Card (Flashcard)
```typescript
interface Card {
  id: string;                    // UUID
  front: string;                 // Parola inglese
  back: string;                  // Traduzione italiana
  context: string;               // Frase esempio inglese
  contextTranslation: string;    // Traduzione frase
  tags: string[];                // Array di tag/categorie
  fsrsData: FSRSCard;           // Dati algoritmo FSRS
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. FSRS Integration
Usa libreria `ts-fsrs` per algoritmo spaced repetition:
```typescript
import { FSRS, Rating, Card as FSRSCard } from 'ts-fsrs';

const fsrs = new FSRS();
const scheduling = fsrs.repeat(card, Rating.Good);
```

Rating values:
- `Rating.Again` (1) - Non ricordata
- `Rating.Hard` (2) - Difficile
- `Rating.Good` (3) - Bene
- `Rating.Easy` (4) - Facile

### 3. Storage Strategy
- **localStorage**: Metadata leggeri, preferenze
- **IndexedDB**: Bulk data (carte, review logs)
- **Wrapper**: Astrazione per facilitare switch future

```typescript
// Esempio uso storage
const cardService = new CardService();
await cardService.saveCard(card);
const dueCards = await cardService.getDueCards();
```

---

## Feature Requirements

### Must Have (Sessioni 1-3)
- ✅ Flashcard con flip animation
- ✅ Sistema review con FSRS
- ✅ Gestione tag/categorie
- ✅ Dashboard statistiche
- ✅ Import/Export JSON
- ✅ Ricerca full-text

### Nice to Have (Sessione 4+)
- 🔄 PWA installabile
- 🔄 Sync cloud (Supabase)
- 🔄 Audio pronuncia
- 🔄 Dark mode
- 🔄 Gamification (streaks, achievements)

---

## Best Practices

### Spaced Repetition UX
1. **Frasi complete con contesto**, non parole isolate
2. **Production over recognition**: mostra italiano → chiedi inglese
3. **Feedback immediato**: mostra risposta corretta subito dopo
4. **Progress visible**: mostra % completamento sessione
5. **Sessioni brevi**: suggerisci 5-10 min (10-20 carte)

### Performance
- Lazy load componenti non critici
- Virtualizzazione per liste lunghe (>100 items)
- Debounce su ricerca
- IndexedDB per operazioni batch

### Accessibility
- Focus management per keyboard navigation
- ARIA labels per screen readers
- Color contrast WCAG AA
- Touch targets min 44x44px (mobile)

---

## Common Tasks

### Aggiungere Nuova Carta
```typescript
const newCard = await cardService.create({
  front: "serendipity",
  back: "serendipità",
  context: "It was pure serendipity that we met",
  contextTranslation: "È stata pura serendipità che ci siamo incontrati",
  tags: ["sostantivi", "livello-avanzato"]
});
```

### Review Session
```typescript
const dueCards = await cardService.getDueCards();
for (const card of dueCards) {
  const rating = await showCardAndGetRating(card);
  const updated = fsrs.processReview(card, rating);
  await cardService.update(updated);
}
```

### Esportare Dati
```typescript
const allData = await storageService.exportAll();
downloadJSON(allData, 'vocabulary-backup.json');
```

---

## Troubleshooting

### Issue: ts-fsrs TypeScript errors
**Soluzione**: Verifica versione compatibile, usa type assertions se necessario
```typescript
const fsrsCard: FSRSCard = card.fsrsData;
```

### Issue: localStorage quota exceeded
**Soluzione**: Migra a IndexedDB per dataset grandi (>5MB)

### Issue: Render performance lento
**Soluzione**: 
1. Usa React.memo per componenti pesanti
2. Virtualizza liste lunghe
3. Profila con React DevTools

---

## Deployment

### Vercel (Consigliato)
```bash
vercel              # Deploy interattivo
vercel --prod       # Deploy produzione
```

Environment variables (se necessarie):
```env
NEXT_PUBLIC_SUPABASE_URL=...      # Se usi sync cloud
NEXT_PUBLIC_SUPABASE_ANON_KEY=... # Se usi sync cloud
```

---

## Notes for Claude

- Quando crei componenti, includi sempre props TypeScript
- Testa su mobile usando Chrome DevTools (Responsive mode)
- Prima di implementare, crea piano in Plan Mode
- Dopo modifiche significative, suggerisci Git commit
- Se dubbio su UX, chiedi conferma prima di procedere

## Task Completion Notifications

Per task che richiedono più di 5 minuti:
- Alla fine, esegui: `notify-send "Claude Code" "Task completato: [descrizione]"`
- Esempio: dopo build produzione, dopo setup database, etc.
