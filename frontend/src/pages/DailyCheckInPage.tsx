import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { saveDailyCheckIn } from '../api/wellness';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useDashboard } from '../features/dashboard/useDashboard';
import { useToast } from '../hooks/useToast';

const checkInSchema = z.object({
  sleepHours: z.coerce
    .number()
    .min(0, 'Sleep must be at least 0')
    .max(24, 'Sleep cannot exceed 24'),
  moodScore: z.coerce.number().int().min(1, 'Mood must be 1-5').max(5, 'Mood must be 1-5'),
  energyScore: z.coerce.number().int().min(1, 'Energy must be 1-5').max(5, 'Energy must be 1-5'),
  workHours: z.coerce.number().min(0, 'Work must be at least 0').max(24, 'Work cannot exceed 24'),
  codingMinutes: z.coerce.number().int().min(0, 'Coding minutes must be positive'),
  steps: z.coerce.number().int().min(0, 'Steps must be positive'),
  breakCount: z.coerce.number().int().min(0, 'Breaks must be positive'),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
});

type CheckInFormValues = z.infer<typeof checkInSchema>;

const today = getTodayDate();

export function DailyCheckInPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const dashboardQuery = useDashboard();

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      sleepHours: 7,
      moodScore: 3,
      energyScore: 3,
      workHours: 8,
      codingMinutes: 300,
      steps: 6000,
      breakCount: 4,
      notes: '',
    },
  });

  useEffect(() => {
    const latestEntry = dashboardQuery.data?.data.latestEntry;

    if (!latestEntry || latestEntry.entryDate !== today) {
      return;
    }

    form.reset({
      sleepHours: latestEntry.sleepHours ?? 7,
      moodScore: latestEntry.moodScore ?? 3,
      energyScore: latestEntry.energyScore ?? 3,
      workHours: latestEntry.workHours ?? 8,
      codingMinutes: latestEntry.codingMinutes ?? 300,
      steps: latestEntry.steps ?? 6000,
      breakCount: latestEntry.breakCount ?? 4,
      notes: latestEntry.notes ?? '',
    });
  }, [dashboardQuery.data, form]);

  const saveMutation = useMutation({
    mutationFn: (values: CheckInFormValues) =>
      saveDailyCheckIn({
        ...values,
        entryDate: today,
        notes: values.notes?.trim() || undefined,
      }),
    onSuccess: async () => {
      showToast("Today's check-in saved.");
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/');
    },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">
              Daily Wellness Check-in
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {today} · Update today&apos;s recovery inputs in under a minute.
            </p>
          </div>
        </header>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sleep</CardTitle>
            </CardHeader>
            <CardContent>
              <Field
                label="Sleep Hours"
                error={form.formState.errors.sleepHours?.message}
                input={
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    max="24"
                    {...form.register('sleepHours')}
                  />
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood and Energy</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Mood"
                error={form.formState.errors.moodScore?.message}
                input={
                  <Input type="number" min="1" max="5" step="1" {...form.register('moodScore')} />
                }
              />
              <Field
                label="Energy"
                error={form.formState.errors.energyScore?.message}
                input={
                  <Input type="number" min="1" max="5" step="1" {...form.register('energyScore')} />
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workload</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Work Hours"
                error={form.formState.errors.workHours?.message}
                input={
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    max="24"
                    {...form.register('workHours')}
                  />
                }
              />
              <Field
                label="Coding Minutes"
                error={form.formState.errors.codingMinutes?.message}
                input={<Input type="number" min="0" step="1" {...form.register('codingMinutes')} />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity and Breaks</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Steps"
                error={form.formState.errors.steps?.message}
                input={<Input type="number" min="0" step="1" {...form.register('steps')} />}
              />
              <Field
                label="Breaks"
                error={form.formState.errors.breakCount?.message}
                input={<Input type="number" min="0" step="1" {...form.register('breakCount')} />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Field
                label="Notes"
                error={form.formState.errors.notes?.message}
                input={
                  <Textarea
                    placeholder="Anything affecting your recovery today?"
                    {...form.register('notes')}
                  />
                }
              />
            </CardContent>
          </Card>

          {saveMutation.isError ? (
            <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Could not save the check-in. Confirm the backend is running and try again.
            </p>
          ) : null}

          <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'Saving...' : 'Save check-in'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, input, error }: { label: string; input: ReactNode; error?: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {input}
      {error ? <span className="block text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function getTodayDate() {
  const date = new Date();
  const offsetMs = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}
