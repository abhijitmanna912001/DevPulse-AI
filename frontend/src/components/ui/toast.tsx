import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { ToastContext, type ToastContextValue } from './toast-context';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast(nextMessage) {
        setMessage(nextMessage);
        window.setTimeout(() => setMessage(null), 3000);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-card border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-700 shadow-lg">
          <CheckCircle2 className="h-5 w-5" />
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
