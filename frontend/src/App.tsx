import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
              <section className="rounded-card border border-border bg-surface p-8 text-center shadow-sm">
                <p className="text-sm font-medium text-slate-500">DevPulse AI</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">Project foundation ready</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  Frontend routing, React Query, Tailwind CSS, and shadcn/ui configuration are
                  scaffolded. Product screens and features will be implemented next.
                </p>
              </section>
            </div>
          </main>
        }
      />
    </Routes>
  );
}

export default App;
