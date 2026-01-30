// Script to add sample cards with tags for testing
// Run this in browser console at http://localhost:3000/test-tags

const sampleCards = [
  {
    id: 'test-1',
    front: 'serendipity',
    back: 'serendipità',
    context: 'It was pure serendipity that we met',
    contextTranslation: 'È stata pura serendipità che ci siamo incontrati',
    tags: ['sostantivi', 'livello-avanzato', 'astratto'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fsrsData: {
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0,
      last_review: null,
    }
  },
  {
    id: 'test-2',
    front: 'ephemeral',
    back: 'effimero',
    context: 'The beauty of cherry blossoms is ephemeral',
    contextTranslation: 'La bellezza dei fiori di ciliegio è effimera',
    tags: ['aggettivi', 'livello-avanzato', 'natura'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fsrsData: {
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0,
      last_review: null,
    }
  },
  {
    id: 'test-3',
    front: 'resilient',
    back: 'resiliente',
    context: 'She remained resilient despite the challenges',
    contextTranslation: 'È rimasta resiliente nonostante le sfide',
    tags: ['aggettivi', 'livello-intermedio', 'psicologia'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fsrsData: {
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0,
      last_review: null,
    }
  },
  {
    id: 'test-4',
    front: 'ubiquitous',
    back: 'onnipresente',
    context: 'Smartphones have become ubiquitous in modern society',
    contextTranslation: 'Gli smartphone sono diventati onnipresenti nella società moderna',
    tags: ['aggettivi', 'livello-avanzato', 'tecnologia'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fsrsData: {
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0,
      last_review: null,
    }
  },
  {
    id: 'test-5',
    front: 'ameliorate',
    back: 'migliorare',
    context: 'These measures will ameliorate the situation',
    contextTranslation: 'Queste misure miglioreranno la situazione',
    tags: ['verbi', 'livello-intermedio', 'formale'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fsrsData: {
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0,
      last_review: null,
    }
  }
];

// Get existing cards or create new array
const existingCards = JSON.parse(localStorage.getItem('vocab_cards') || '[]');

// Add sample cards if they don't exist
sampleCards.forEach(card => {
  if (!existingCards.find(c => c.id === card.id)) {
    existingCards.push(card);
  }
});

// Save to localStorage
localStorage.setItem('vocab_cards', JSON.stringify(existingCards));

console.log('✅ Sample cards with tags added!');
console.log('Total cards:', existingCards.length);
console.log('Now reload the page to see the tags in TagFilter');
