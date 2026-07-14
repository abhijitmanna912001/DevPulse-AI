import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Bot, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { askAiCoach } from '../api/ai';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { useDashboard } from '../features/dashboard/useDashboard';
import type { AiChatMessage } from '../types/ai';

const suggestedPrompts = [
  'Why is my recovery low today?',
  'Should I exercise today?',
  'Summarize this week.',
  'How can I reduce burnout?',
];

export function AiCoachPage() {
  const dashboardQuery = useDashboard();
  const [message, setMessage] = useState('');
  const [currentExchange, setCurrentExchange] = useState<{
    user: AiChatMessage;
    assistant: AiChatMessage;
  } | null>(null);

  const aiMutation = useMutation({
    mutationFn: askAiCoach,
    onSuccess: (response) => {
      setCurrentExchange({
        user: response.data.userMessage,
        assistant: response.data.assistantMessage,
      });
      setMessage('');
    },
  });

  function submitMessage(nextMessage = message) {
    const trimmed = nextMessage.trim();

    if (!trimmed || aiMutation.isPending) {
      return;
    }

    aiMutation.mutate(trimmed);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <Link
                to="/"
                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-ai" />
                AI Coach
              </CardTitle>
              <p className="text-sm leading-6 text-slate-500">
                Ask about your latest backend-calculated wellness scores and check-in context.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreRow
                label="Recovery"
                value={formatScore(dashboardQuery.data?.data.scores.recoveryScore)}
              />
              <ScoreRow
                label="Burnout"
                value={formatScore(dashboardQuery.data?.data.scores.burnoutRiskScore)}
              />
              <ScoreRow label="Risk" value={dashboardQuery.data?.data.scores.riskLevel ?? '-'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Prompts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 lg:flex-col">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="rounded-card border border-border bg-surface px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary"
                  type="button"
                  onClick={() => submitMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        <section className="flex min-h-[72vh] flex-col rounded-card border border-border bg-surface shadow-sm">
          <header className="border-b border-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-card bg-violet-50 text-ai">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-950">Developer Wellness Coach</h1>
                <p className="text-sm text-slate-500">Uses summarized metrics, not raw history.</p>
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {!currentExchange && !aiMutation.isPending ? (
              <div className="rounded-card border border-dashed border-border bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  Start with a wellness question.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The coach can explain scores, suggest recovery priorities, and summarize trends.
                </p>
              </div>
            ) : null}

            {currentExchange ? (
              <>
                <ChatBubble role="USER" content={currentExchange.user.content} />
                <ChatBubble role="ASSISTANT" content={currentExchange.assistant.content} />
              </>
            ) : null}

            {aiMutation.isPending ? (
              <ChatBubble
                role="ASSISTANT"
                content="Thinking through your latest dashboard context..."
              />
            ) : null}

            {aiMutation.isError ? (
              <div className="rounded-card border border-red-200 bg-red-50 p-4 text-sm font-medium leading-6 text-red-700">
                AI Coach is unavailable. Check `OPENAI_API_KEY` on the backend and try again.
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-border p-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage();
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Textarea
                className="min-h-16 flex-1"
                placeholder="Ask about your recovery, burnout risk, or what to prioritize next."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button className="sm:h-16" type="submit" disabled={aiMutation.isPending}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-card bg-slate-50 px-3 py-2">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="font-mono text-sm font-bold text-slate-950">{value}</span>
    </div>
  );
}

function ChatBubble({ role, content }: { role: 'USER' | 'ASSISTANT'; content: string }) {
  const isUser = role === 'USER';

  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          isUser
            ? 'max-w-2xl rounded-card bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground'
            : 'max-w-2xl rounded-card border border-border bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700'
        }
      >
        {content}
      </div>
    </div>
  );
}

function formatScore(value: number | undefined) {
  return value === undefined ? '-' : value.toString();
}
