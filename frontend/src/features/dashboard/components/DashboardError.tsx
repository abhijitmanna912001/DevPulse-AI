import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-red-50 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-950">Dashboard unavailable</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              The frontend could not load the live dashboard data. Confirm the backend is running
              and try again.
            </p>
            <Button className="mt-6" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
