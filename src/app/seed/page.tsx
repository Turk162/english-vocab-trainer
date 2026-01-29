'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { cardService } from '@/lib/storage/card-service';
import { storageService } from '@/lib/storage/storage-service';

export default function SeedPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const seedCards = async () => {
    setStatus('seeding');
    setMessage('Creating test cards...');

    try {
      // Create 3 test cards
      const card1 = await cardService.create({
        front: 'serendipity',
        back: 'serendipità, casualità fortunata',
        context: 'It was pure serendipity that we met at the coffee shop',
        contextTranslation: 'È stata pura serendipità che ci siamo incontrati al bar',
        tags: ['sostantivi', 'avanzato'],
      });

      const card2 = await cardService.create({
        front: 'ephemeral',
        back: 'effimero, temporaneo',
        context: 'The beauty of cherry blossoms is ephemeral',
        contextTranslation: 'La bellezza dei fiori di ciliegio è effimera',
        tags: ['aggettivi', 'avanzato'],
      });

      const card3 = await cardService.create({
        front: 'ubiquitous',
        back: 'onnipresente, ovunque',
        context: 'Smartphones have become ubiquitous in modern society',
        contextTranslation: 'Gli smartphone sono diventati onnipresenti nella società moderna',
        tags: ['aggettivi', 'intermedio'],
      });

      // Set card1 and card2 as due NOW (modify fsrsData.due)
      const now = new Date();
      card1.fsrsData.due = now;
      card2.fsrsData.due = now;

      // Set card3 as due TOMORROW
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      card3.fsrsData.due = tomorrow;

      // Save updated cards (use storageService directly to update fsrsData)
      storageService.saveCard(card1);
      storageService.saveCard(card2);
      storageService.saveCard(card3);

      setStatus('success');
      setMessage(`Successfully created 3 test cards:
        • ${card1.front} (due NOW)
        • ${card2.front} (due NOW)
        • ${card3.front} (due tomorrow)`);
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seed Test Data</h1>
          <p className="text-gray-600">Create test cards for review system</p>
        </div>

        {status === 'idle' && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
            <p className="text-sm text-gray-700">
              This will create 3 test vocabulary cards:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>2 cards due NOW (ready for review)</li>
              <li>1 card due tomorrow (not ready)</li>
            </ul>
            <Button onClick={seedCards} fullWidth variant="primary">
              Create Test Cards
            </Button>
          </div>
        )}

        {status === 'seeding' && (
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 space-y-4">
            <div className="text-5xl text-center mb-2">✅</div>
            <pre className="text-sm text-green-800 whitespace-pre-wrap">{message}</pre>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => router.push('/review')} fullWidth variant="primary">
                Go to Review
              </Button>
              <Button onClick={() => router.push('/')} fullWidth variant="secondary">
                Go Home
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 space-y-4">
            <div className="text-5xl text-center mb-2">⚠️</div>
            <p className="text-red-800">{message}</p>
            <Button onClick={() => setStatus('idle')} fullWidth variant="danger">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
