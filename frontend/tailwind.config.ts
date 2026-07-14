import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        recovery: 'hsl(var(--recovery))',
        ai: 'hsl(var(--ai))',
        sleep: 'hsl(var(--sleep))',
        activity: 'hsl(var(--activity))',
        workload: 'hsl(var(--workload))',
        mood: 'hsl(var(--mood))',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
