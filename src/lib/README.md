# Library Documentation

## FSRS (Spaced Repetition)

Il sistema di spaced repetition è implementato usando la libreria `ts-fsrs`.

### Quick Start

```typescript
import { cardService, Rating } from '@/lib/storage';

// Crea una nuova card
const card = await cardService.create({
  front: 'serendipity',
  back: 'serendipità',
  context: 'It was pure serendipity that we met',
  contextTranslation: 'È stata pura serendipità che ci siamo incontrati',
  tags: ['sostantivi', 'livello-avanzato']
});

// Ottieni card dovute per review
const dueCards = await cardService.getDueCards();

// Processa una review
const updatedCard = await cardService.reviewCard(card.id, Rating.Good);
```

### Rating Values

- `Rating.Again` (1) - Non ricordata - card difficile, mostra presto
- `Rating.Hard` (2) - Difficile - ricordata con fatica
- `Rating.Good` (3) - Bene - ricordata normalmente (default consigliato)
- `Rating.Easy` (4) - Facile - ricordata facilmente, mostra tra molto tempo

## CardService API

### Creazione e Gestione

```typescript
// Crea card
await cardService.create(data);

// Leggi
await cardService.getAll();
await cardService.getById(id);
await cardService.getDueCards();
await cardService.getNewCards();

// Aggiorna
await cardService.update(id, { front: 'new value' });

// Elimina
await cardService.delete(id);
```

### Review

```typescript
// Review una card
const updated = await cardService.reviewCard(cardId, Rating.Good);
```

### Ricerca e Filtri

```typescript
// Ricerca full-text
const results = await cardService.search('serendipity');

// Filtra per tag
const cards = await cardService.getByTag('sostantivi');

// Ottieni tutti i tag
const tags = await cardService.getAllTags();
```

### Statistiche

```typescript
const stats = await cardService.getStats();
// {
//   totalCards: 100,
//   dueCards: 15,
//   newCards: 10,
//   learningCards: 5,
//   reviewedToday: 20,
//   currentStreak: 7,
//   longestStreak: 14,
//   lastReviewDate: Date
// }
```

### Import/Export

```typescript
// Export
const json = await cardService.exportData();
downloadFile(json, 'backup.json');

// Import
await cardService.importData(jsonString);
```

## Storage

Il sistema usa `localStorage` per semplicità. Per dataset grandi (>5MB), migrare a IndexedDB.

### Migrazione a IndexedDB

Se necessario, implementare un nuovo `StorageService` che usa IndexedDB mantenendo la stessa interfaccia.

## Types

```typescript
import { Card, CreateCardData, UserStats } from '@/lib/types';
```

Vedi `src/lib/types/card.ts` per la definizione completa dei tipi.
