'use client';

import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  const router = useRouter();
  return (
    <Container className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to English Vocab Trainer
        </h1>
        <p className="text-lg text-gray-600">
          Master English vocabulary with spaced repetition
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Learning</h3>
            <p className="text-sm text-gray-600">FSRS algorithm optimizes review timing</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">See your improvement over time</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Mobile First</h3>
            <p className="text-sm text-gray-600">Study anywhere, anytime</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary" fullWidth onClick={() => router.push('/review')}>
          Start Review
        </Button>
        <Button variant="secondary" fullWidth onClick={() => router.push('/cards')}>
          Browse Cards
        </Button>
      </div>
    </Container>
  );
}
