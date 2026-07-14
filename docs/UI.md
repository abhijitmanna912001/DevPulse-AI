# DevPulse AI MVP UI/UX Design Specification

## Overall Design Philosophy

DevPulse AI should feel like a focused developer wellness cockpit: calm, useful, data-informed, and immediately understandable during a hackathon demo.

The MVP opens directly to the seeded Demo User dashboard. There is no login, onboarding gate, or marketing landing page. The first screen should show the product value within seconds: current recovery, burnout risk, recent trends, and an AI explanation that turns metrics into practical guidance.

Design principles:

- **Insight over raw metrics:** Charts and numbers should always lead toward interpretation.
- **Developer-tool clarity:** Use dense but readable layouts, precise labels, and minimal decoration.
- **Wellness without alarmism:** Risk states should be noticeable without making the app feel clinical or scary.
- **Demo-first speed:** Important widgets should be visible above the fold on desktop.
- **AI as explanation:** The UI should clearly present scores as backend-calculated and AI as a coach that explains and recommends.
- **Responsive by default:** Desktop is optimized for judges and demos; mobile remains fully usable with stacked layouts and simplified navigation.

## Color Palette

Use a neutral light interface with calm accents and accessible semantic colors.

### Base Colors

| Role | Color | Usage |
| --- | --- | --- |
| App background | `#F8FAFC` | Main page background. |
| Surface | `#FFFFFF` | Cards, panels, forms, modals. |
| Surface muted | `#F1F5F9` | Secondary panels and skeletons. |
| Border | `#E2E8F0` | Card borders, dividers, input borders. |
| Text primary | `#0F172A` | Main headings and metric values. |
| Text secondary | `#475569` | Labels, helper text, descriptions. |
| Text muted | `#94A3B8` | Placeholder and low-priority metadata. |

### Brand And Accent Colors

| Role | Color | Usage |
| --- | --- | --- |
| Primary | `#2563EB` | Primary buttons, active nav, key links. |
| Primary soft | `#DBEAFE` | Primary-tinted backgrounds and active states. |
| Recovery | `#14B8A6` | Recovery score and positive wellness signals. |
| AI accent | `#7C3AED` | AI Coach and AI Insight accents. |
| Sleep | `#6366F1` | Sleep widgets and chart lines. |
| Activity | `#22C55E` | Steps and movement widgets. |
| Workload | `#F97316` | Workload and coding session indicators. |
| Mood | `#EC4899` | Mood and energy widgets. |

### Risk Colors

| Risk Level | Color | Usage |
| --- | --- | --- |
| Low | `#16A34A` | Low-risk badge and chart markers. |
| Moderate | `#F59E0B` | Moderate-risk badge and alerts. |
| High | `#EA580C` | High-risk badge and warning states. |
| Critical | `#DC2626` | Critical-risk badge and urgent warning states. |

Accessibility notes:

- Do not rely on color alone for risk. Always pair color with a label and icon.
- Text over colored backgrounds must meet readable contrast.
- Use soft tinted backgrounds for badges and strong color only for icon/text emphasis.

## Theme Support

The MVP should ship with Light Theme only. However, colors should be expressed through semantic design tokens so Dark Mode can be added later without redesigning every component.

Recommended semantic tokens:

| Token | MVP Light Theme Usage |
| --- | --- |
| `background` | App background. |
| `surface` | Cards, panels, forms, and modals. |
| `surfaceMuted` | Secondary panels, skeletons, and subtle sections. |
| `border` | Dividers, card outlines, and input borders. |
| `textPrimary` | Headings, metric values, and important labels. |
| `textSecondary` | Body copy, helper text, and secondary labels. |
| `textMuted` | Metadata, placeholders, and disabled text. |
| `primary` | Primary actions and active navigation. |
| `accentAi` | AI Coach and AI Insight emphasis. |
| `accentRecovery` | Recovery Score and positive recovery states. |
| `riskLow` | Low burnout risk states. |
| `riskModerate` | Moderate burnout risk states. |
| `riskHigh` | High burnout risk states. |
| `riskCritical` | Critical burnout risk states. |
| `chartSleep` | Sleep chart series. |
| `chartActivity` | Activity chart series. |
| `chartWorkload` | Workload chart series. |
| `chartMood` | Mood and energy chart series. |

Theme rules:

- Components should reference semantic tokens, not hard-coded color names.
- Dark Mode is future scope and should not appear as an MVP toggle.
- Risk colors must remain distinguishable in any future theme through color, label, and icon.

## Typography

Recommended font:

- **Primary:** Inter or a similar modern sans-serif.
- **Fallback:** system UI sans-serif.

Typography scale:

| Style | Size | Weight | Usage |
| --- | --- | --- | --- |
| Page title | 28-32px | 700 | Dashboard and screen titles. |
| Section title | 18-20px | 650 | Card groups and major panels. |
| Card title | 14-16px | 600 | Widget headings. |
| Metric value | 28-40px | 700 | Scores and important numbers. |
| Body | 14-16px | 400-500 | Main readable content. |
| Caption | 12-13px | 500 | Metadata, labels, helper text. |

Typography rules:

- Use tabular numerals for scores, durations, dates, and chart labels.
- Avoid oversized hero typography inside the application.
- Keep line length short in AI insight cards and chat messages.
- Use sentence-case labels for a calm product tone.

## Spacing System

Use an 8px spacing system.

| Token | Value | Usage |
| --- | --- | --- |
| `xs` | 4px | Icon gaps, tiny offsets. |
| `sm` | 8px | Label/value spacing. |
| `md` | 16px | Card padding on mobile, form groups. |
| `lg` | 24px | Desktop card padding and grid gaps. |
| `xl` | 32px | Section spacing. |
| `2xl` | 48px | Page-level spacing. |

Layout rules:

- Cards should use 8px border radius.
- Avoid cards inside cards.
- Use full-width page bands or grid sections instead of decorative floating panels.
- Keep controls stable in size so loading states and dynamic text do not shift layout.

## Icon Strategy

Use Lucide React icons throughout the MVP.

Recommended icons:

| Concept | Icon |
| --- | --- |
| Dashboard | `LayoutDashboard` |
| Check-in | `ClipboardCheck` |
| AI Coach | `Sparkles` or `Bot` |
| Insights | `Lightbulb` |
| Weekly Summary | `CalendarDays` |
| Recovery | `Activity` |
| Burnout Risk | `Flame` or `AlertTriangle` |
| Sleep | `Moon` |
| Workload | `Code2` |
| Mood | `Smile` |
| Steps/Activity | `Footprints` |
| Save | `Save` |
| Send | `Send` |
| Refresh/Generate | `RefreshCw` |

Icon rules:

- Use icon+label for primary navigation.
- Use icon-only buttons only when a tooltip is available.
- Keep icons at 16-20px in cards and 20-24px in navigation.
- Use consistent stroke width and avoid custom SVGs unless a required icon is unavailable.

## Component Design Principles

- Components should be compact, predictable, and easy to scan.
- Primary actions use filled buttons; secondary actions use outline or ghost buttons.
- Form controls should have visible labels, helper text where useful, and inline validation.
- Chart components should include a text summary so users do not need to interpret visuals alone.
- AI surfaces should be visually distinct but not magical or decorative.
- Risk and recovery states should use labels, numbers, icons, and short explanations.
- Empty, loading, and error states should always offer a clear next action.

## Screen Designs

## Dashboard

### Purpose

The Dashboard is the first screen users and judges see. It should communicate the product value immediately by showing recovery, burnout risk, key wellness metrics, trends, and an AI recommendation.

### Layout

Desktop layout:

- App shell with left sidebar and top header.
- Header row with greeting, date, Demo User label, and primary CTA.
- Score hero row with Recovery Score Ring, Burnout Risk card, and AI Insight Card.
- Metric grid for sleep, workload, mood/energy, and activity.
- Trend chart section for 7-day wellness patterns.
- Bottom row with latest check-in summary and recommendations.

Mobile layout:

- Top app bar with compact navigation.
- Score cards stacked vertically.
- Metric cards in one-column layout.
- Charts become horizontally scrollable or simplified stacked charts.
- Primary CTA remains visible near the top.

### Component Hierarchy

- App Shell
- Navbar or Sidebar
- Page Header
- Recovery Score Ring
- Burnout Risk Card
- AI Insight Card
- Stat Card Grid
- Trend Chart Cards
- Latest Entry Summary
- Recommendation List

### User Interactions

- Click “Log today’s check-in” to open Daily Wellness Check-in.
- Click “Ask AI Coach” to open AI Coach Chat with suggested prompts.
- Click metric cards to view supporting detail or relevant trend chart.
- Click “Generate insight” if no current daily insight exists.
- Hover chart points on desktop; tap chart points on mobile.

### Primary CTA

`Log today’s check-in`

Secondary CTA:

`Ask AI Coach`

### Responsive Behavior

- Desktop: 12-column grid with score cards across the top.
- Tablet: 2-column card grid.
- Mobile: single-column layout with sticky top navigation and compact metric cards.

## Daily Wellness Check-in

### Purpose

The Daily Wellness Check-in lets the Demo User create or update one daily wellness entry. It should be fast enough to complete in under one minute.

### Layout

- Page header with selected date and save status.
- Form grouped into sections:
  - Sleep
  - Activity
  - Mood and energy
  - Workload
  - Breaks and notes
- Sticky action bar on mobile with Save button.
- Optional inline preview showing how entries affect dashboard signals.

### Component Hierarchy

- App Shell
- Page Header
- Date Picker
- Form Section Cards
- Numeric Inputs or Sliders
- Textarea
- Inline Validation Messages
- Save Button
- Toast

### User Interactions

- Select date.
- Enter sleep hours and sleep quality.
- Enter steps and exercise minutes.
- Select mood and energy scores.
- Enter work hours, coding minutes, and break count.
- Add optional notes.
- Save creates a new entry or patches an existing entry.
- After a successful save:
  - Show a success toast.
  - Refresh `/api/v1/dashboard/summary`.
  - Update the Recovery Score.
  - Refresh dashboard charts.
  - Refresh the AI Insight Card if a relevant cached or generated insight applies.

### Primary CTA

`Save check-in`

### Responsive Behavior

- Desktop: two-column form sections with notes spanning full width.
- Mobile: one-column form with sticky save action.
- Numeric controls should remain large enough for touch input.

## AI Coach Chat

### Purpose

The AI Coach Chat allows the user to ask natural-language questions about their wellness data. It should feel conversational while clearly grounded in backend-calculated metrics.

### Layout

Desktop layout:

- Main chat panel with message history.
- Right-side context panel showing recovery score, burnout risk, and recent metric summary.
- Suggested prompt chips above the input.
- Composer fixed to the bottom of the chat panel.

Mobile layout:

- Full-screen chat.
- Context panel collapses into a top summary card.
- Suggested prompts become horizontally scrollable chips.

### Component Hierarchy

- App Shell
- Chat Header
- Context Summary Panel
- Suggested Prompt Chips
- Message List
- AI Loading Message
- Chat Composer
- Safety Disclaimer

### User Interactions

- Type and send a question.
- Suggested prompts may be dynamically generated from the latest wellness entry, current recovery score, burnout risk score, and weekly trends.
- Click suggested prompts such as:
  - “Why am I tired this week?”
  - “How can I recover tomorrow?”
  - “Explain my burnout risk.”
  - “Summarize my last 7 days.”
  - “Why is my recovery lower today?”
  - “Should I exercise today?”
  - “What’s affecting my burnout score?”
  - “Summarize this week.”
  - “What should I prioritize tomorrow?”
- Retry if AI response fails.
- Continue an existing conversation.

### Primary CTA

`Send`

### Responsive Behavior

- Desktop: split view for chat and context.
- Tablet: context panel moves above chat.
- Mobile: chat-first layout with compact score summary.

## Insight History

### Purpose

Insight History lets users browse stored daily and weekly AI insight snapshots. It shows that DevPulse AI can track coaching narratives over time.

### Layout

- Page header with “Generate today’s insight” CTA.
- Filter tabs: All, Daily, Weekly.
- Chronological insight list.
- Selected insight detail panel on desktop.
- Inline metadata for period, recovery score, burnout risk, and risk level.

### Component Hierarchy

- App Shell
- Page Header
- Filter Tabs
- Insight List
- Insight Detail Panel
- Risk Badge
- Generate Insight Button
- Empty State

### User Interactions

- Switch between All, Daily, and Weekly filters.
- Select an insight to view details.
- Generate today’s insight.
- Cached insight reuse should feel instant.
- New generation shows an AI loading state.

### Primary CTA

`Generate today’s insight`

### Responsive Behavior

- Desktop: list and detail side by side.
- Mobile: list-first; tapping an insight opens a detail view or modal.

## Weekly Summary

### Purpose

The Weekly Summary explains 7-day patterns across sleep, workload, mood, activity, recovery, and burnout risk.

### Layout

- Header with week range and “Ask about this week” CTA.
- Score movement row showing recovery and burnout risk changes.
- Trend chart band for key metrics.
- Metric comparison cards.
- Weekly AI summary card if available.
- Recommendation list for the next week.

### Component Hierarchy

- App Shell
- Week Selector or Week Label
- Score Movement Cards
- Trend Chart Band
- Metric Comparison Cards
- Weekly AI Insight Card
- Recommendation List

### User Interactions

- Hover or tap chart points.
- Open AI Coach with prefilled weekly context prompt.
- Generate weekly insight if none exists.
- Review recommendations for the next week.

### Primary CTA

`Ask about this week`

### Responsive Behavior

- Desktop: chart band and cards in a grid.
- Mobile: stacked cards with simplified charts.
- Weekly insight should appear near the top on mobile after scores.

## Empty States

### Purpose

Empty states should keep the demo moving and tell users exactly what to do next.

### Layout

- Friendly icon.
- Short title.
- One-sentence explanation.
- Primary CTA.
- Optional secondary link.

### Component Hierarchy

- Empty State Container
- Icon
- Title
- Description
- CTA Button

### User Interactions

- No entries: click “Log your first check-in”.
- No insights: click “Generate insight”.
- No chat messages: click a suggested prompt or type a question.

### Primary CTA

Context-specific:

- `Log your first check-in`
- `Generate insight`
- `Ask your first question`

### Responsive Behavior

- Center within the available panel.
- Keep text short on mobile.

## Loading States

### Purpose

Loading states should preserve layout stability and make the app feel responsive.

### Layout

- Dashboard skeleton cards for scores, metrics, and charts.
- Form save button shows busy state.
- AI chat shows an assistant typing skeleton.
- Insight generation shows a compact “Generating insight” state.

### Component Hierarchy

- Skeleton Card
- Skeleton Text
- Skeleton Chart
- Loading Button
- AI Typing Indicator

### User Interactions

- Disable duplicate submits during save or generate actions.
- Allow users to keep reading existing content while new AI content loads.

### Primary CTA

No new CTA during loading; preserve the previous action in disabled/loading state.

### Responsive Behavior

- Skeletons should match final content dimensions.
- Mobile skeletons stack like final mobile cards.

## Error States

### Purpose

Error states should recover gracefully from validation errors, API failures, and OpenAI failures.

### Layout

- Inline validation for form fields.
- Toast for save/delete success or failure.
- Page-level retry card for failed dashboard or history fetch.
- AI fallback card for OpenAI failures.

### Component Hierarchy

- Inline Field Error
- Toast
- Retry Card
- AI Fallback Message
- Error Badge

### User Interactions

- Retry failed data fetch.
- Correct invalid form fields.
- Continue using deterministic dashboard if AI fails.
- Ask another question after an AI fallback.

### Primary CTA

Context-specific:

- `Retry`
- `Save again`
- `Back to dashboard`

### Responsive Behavior

- Inline errors remain close to fields.
- Toasts appear bottom-right on desktop and bottom-center on mobile.

## Shared Components

## Navbar

- **Purpose:** Provide top-level navigation and product identity.
- **Visual behavior:** Compact header with DevPulse AI wordmark, Demo User indicator, and primary action.
- **States:** Default, active route, mobile collapsed.
- **Responsive notes:** Desktop may pair with sidebar; mobile uses top bar plus compact nav.

## Sidebar

- **Purpose:** Desktop navigation for Dashboard, Check-in, AI Coach, Insights, and Weekly Summary.
- **Visual behavior:** Fixed-width left rail with icon+label items.
- **States:** Active, hover, collapsed optional.
- **Responsive notes:** Hidden on mobile and replaced by top or bottom navigation.

## Stat Card

- **Purpose:** Show a single metric with label, value, trend, and icon.
- **Visual behavior:** White surface, subtle border, compact spacing, clear numeric value.
- **States:** Default, positive trend, negative trend, warning, loading.
- **Responsive notes:** Two-column grid on tablet, single-column or compact two-column on mobile.

## Chart Card

- **Purpose:** Present trends for sleep, workload, activity, mood, recovery, or risk.
- **Visual behavior:** Title, short interpretation, chart, and legend.
- **States:** Loaded, empty, loading, error.
- **Responsive notes:** Charts simplify labels on mobile.

## AI Insight Card

- **Purpose:** Display AI-generated explanation and recommended action.
- **Visual behavior:** Subtle AI accent border or icon, not a decorative gradient panel.
- **States:** Generated, cached, fallback, loading.
- **Responsive notes:** Keep summary readable and avoid long paragraphs on mobile.

## Risk Badge

- **Purpose:** Communicate risk level clearly.
- **Visual behavior:** Label plus icon using risk colors.
- **States:** Low, Moderate, High, Critical.
- **Responsive notes:** Keep labels visible; do not use color alone.

## Recovery Score Ring

- **Purpose:** Show recovery score as the primary wellness signal.
- **Visual behavior:** Circular progress ring with score in center and short label.
- **States:** High recovery, moderate recovery, low recovery, loading.
- **Responsive notes:** Large on dashboard desktop; smaller in mobile summary.

## Buttons

- **Purpose:** Trigger primary and secondary actions.
- **Visual behavior:** Filled primary, outline secondary, ghost tertiary, destructive only for delete.
- **States:** Default, hover, active, disabled, loading.
- **Responsive notes:** Full-width primary buttons in mobile forms.

## Inputs

- **Purpose:** Capture numeric and text values.
- **Visual behavior:** Clear labels, helper text, visible border, inline errors.
- **States:** Default, focus, invalid, disabled.
- **Responsive notes:** Touch-friendly height on mobile.

## Textareas

- **Purpose:** Capture optional wellness notes or chat input.
- **Visual behavior:** Comfortable multiline field with character guidance.
- **States:** Default, focus, invalid, disabled.
- **Responsive notes:** Chat textarea should not cover previous messages on mobile.

## Modal

- **Purpose:** Confirm destructive actions or show focused details.
- **Visual behavior:** Centered surface with title, content, and clear actions.
- **States:** Open, closing, loading action.
- **Responsive notes:** Full-width bottom sheet style is acceptable on mobile.

## Toast

- **Purpose:** Confirm saves, deletes, generation, and recoverable errors.
- **Visual behavior:** Compact message with icon and optional action.
- **States:** Success, error, warning, info.
- **Responsive notes:** Bottom-right desktop, bottom-center mobile.

## Loading Skeletons

- **Purpose:** Preserve layout while data loads.
- **Visual behavior:** Neutral muted blocks matching final component size.
- **States:** Card, chart, text, chat response, score ring.
- **Responsive notes:** Use the same responsive layout as loaded components.

## Dashboard Widgets

## Recovery Score

- **Purpose:** Primary signal for current recovery.
- **Visual behavior:** Score ring with `0-100` value, label, and short interpretation.
- **State variants:** Strong, stable, strained, loading.
- **Responsive notes:** Top-left or first card on all layouts.

## Burnout Risk

- **Purpose:** Show backend-calculated burnout risk.
- **Visual behavior:** Numeric score, Risk Badge, and top contributing factors.
- **State variants:** Low, Moderate, High, Critical.
- **Responsive notes:** Always visible above fold.

## Sleep

- **Purpose:** Summarize sleep duration, sleep quality, and trend.
- **Visual behavior:** Moon icon, average hours, target comparison, mini chart.
- **State variants:** On target, below target, missing data.
- **Responsive notes:** Compact card on mobile.

## Workload

- **Purpose:** Show work hours and coding minutes.
- **Visual behavior:** Code icon, average workload, trend direction, warning if high.
- **State variants:** Balanced, elevated, high, missing data.
- **Responsive notes:** Pair with burnout risk on desktop.

## Mood

- **Purpose:** Show mood and energy patterns.
- **Visual behavior:** Mood icon, average mood/energy scores, trend label.
- **State variants:** Improving, stable, declining, missing data.
- **Responsive notes:** Keep chart simple on mobile.

## Activity

- **Purpose:** Show steps and exercise minutes.
- **Visual behavior:** Activity icon, average steps, movement minutes, target comparison.
- **State variants:** On target, low activity, improving, missing data.
- **Responsive notes:** Use short labels and compact progress bar.

## AI Recommendation

- **Purpose:** Translate metrics into one practical action.
- **Visual behavior:** AI icon, short recommendation, optional “Ask why” link.
- **State variants:** Generated, cached, fallback, loading.
- **Responsive notes:** Place near top on mobile after scores.

## Trend Charts

- **Purpose:** Show 7-day or 30-day movement across key metrics.
- **Visual behavior:** Recharts line or area charts with restrained colors.
- **State variants:** Loaded, loading, empty, error.
- **Responsive notes:** Reduce axis labels and use tap tooltips on mobile.

## Complete User Flow

1. User opens DevPulse AI.
2. App loads Demo User dashboard using `/api/v1/dashboard/summary`.
3. User sees recovery score, burnout risk, metric cards, trends, and latest AI insight if available.
4. User clicks `Log today’s check-in`.
5. User enters sleep, activity, mood, energy, work, coding minutes, breaks, and notes.
6. App saves the entry using the wellness entry create or patch endpoint.
7. App shows a success toast, refreshes `/api/v1/dashboard/summary`, and updates Recovery Score, charts, and the AI Insight Card if applicable.
8. User returns to Dashboard and sees updated deterministic scores and trends.
9. User clicks `Generate today’s insight` if no valid insight exists.
10. App uses cached insight when available or generates a new one through `/api/v1/insights/generate`.
11. User opens AI Coach and asks a question such as “Why am I tired this week?”
12. AI Coach explains backend-calculated trends and gives safe, practical recommendations.
13. User views Insight History or Weekly Summary to understand longer-term patterns.

## Animation Guidelines

Use Framer Motion only for subtle interface feedback. Animations should help users understand state changes without distracting from health insights.

Recommended animations:

- Card fade-ins when dashboard data first loads.
- Chat message entrance when user or assistant messages appear.
- Skeleton-to-content transitions after API responses.
- Score update transitions when recovery or burnout values change.

Avoid:

- Constant looping animations.
- Decorative motion that does not communicate state.
- Large page transitions that slow down the demo.
- Excessive bouncing, spinning, or attention-grabbing effects.

## Recommended Frontend Libraries

- **Tailwind CSS:** Styling, layout, responsive utilities, and design tokens.
- **shadcn/ui:** Accessible primitives for buttons, inputs, tabs, dialogs, toasts, and form controls.
- **Lucide React:** Icons for navigation, metrics, actions, and status indicators.
- **Recharts:** Dashboard and weekly trend charts.
- **Framer Motion:** Subtle animations only, such as score ring entrance, card fade/slide, chat message arrival, and skeleton-to-content transitions.

## Implementation Notes

- Do not build a login screen for the MVP.
- Default route should open the Demo User dashboard.
- Demo Mode should start with seeded realistic wellness data so the dashboard, charts, and insights are meaningful immediately.
- Include a `Reset Demo Data` action to restore the original seeded dataset before or between hackathon demos.
- Treat `Reset Demo Data` as a hackathon Demo User utility, not authentication or admin scope.
- Keep dashboard score values visually distinct from AI-generated text.
- Label AI content as coaching guidance, not medical advice.
- Use `/api/v1/health` only for system health checks, not UI data.
- Use `/api/v1/dashboard/summary` as the dashboard source of truth.
- Use `POST /api/v1/wellness/entries` for new daily entries and `PATCH /api/v1/wellness/entries/:id` for partial updates.
- Use `/api/v1/ai/chat` for chat responses.
- Use `/api/v1/insights` and `/api/v1/insights/latest` for stored insight history.
- Use `/api/v1/insights/generate` for AI insight generation, respecting cached responses.
- Keep OpenAI loading and fallback states visible but calm.
- Avoid decorative gradients, nested cards, and marketing-style hero layouts inside the app.
- Ensure all important interactions are usable with keyboard navigation.
- Ensure text and controls fit cleanly on mobile without overlap.
