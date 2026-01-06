# KioskSurvey AI Agent Instructions

## Project Overview
KioskSurvey is a touch-friendly web application for creating and conducting surveys in kiosk/tablet environments. It's a static SvelteKit site (no server) with offline-first design using browser localStorage for persistence.

**Key Decision**: All state persists to localStorage via `svelte-persisted-store`, making the app fully functional without a backend. Surveys and results survive page reloads.

## Architecture

### State Management (`src/lib/stores.ts`)
- **Single source of truth**: `surveys` store (persisted array of Survey objects)
- No separate stores for individual survey fields—derive from the main array
- Each Survey contains: `id`, `question`, `answers[]`, `results{}`, `appearance{}`
- Results stored as `Record<answerId, voteCount>` (e.g., `{ "uuid-1": 5, "uuid-2": 3 }`)

**Key patterns**:
- Use `surveys.update()` with immutable updates (spread operators)
- Never mutate arrays/objects directly; always create new references
- `recordAnswer(surveyId, answerId)` increments vote counts
- `resetSurveyResults(surveyId)` clears results to `{}`
- IDs generated with `crypto.randomUUID()` for surveys and answers

### Routing & Navigation
- **Static site**: Deployed via `@sveltejs/adapter-static` (static HTML output)
- Routes use **group structure** for organization:
  - `(app)/` — main survey management routes
  - `(resources)/` — web manifest, static resources
- Navigation via **query parameters**: `/survey?id=<uuid>`, `/results?id=<uuid>`
- Pages derive survey data from stores: `let survey = $derived($surveys.find(...))`

**Route breakdown**:
- `(app)/+page.svelte` — survey management (create, edit, delete, reset)
- `survey/+page.svelte` — taking a survey (displays question, answer buttons)
- `results/+page.svelte` — view aggregated results with progress bars
- Layout (`+layout.svelte`) — applies dynamic background color, language/theme switchers

### Internationalization (i18n) with Paraglide
- **Messages stored in**: `messages/en.json`, `messages/de.json`
- **Generated runtime**: `src/lib/paraglide/` (auto-generated, don't edit)
- Import messages: `import { m } from "$lib/paraglide/messages.js"`
- Usage: `m.key_name()` or `m.key_name({}, { locale: 'en' })` for specific locale
- Dynamic content (e.g., survey question defaults) generated per-language via `generateDefaultsForLanguage(locale)`

### Styling & UI
- **Tailwind CSS** with **shadcn-svelte** component library
- Dynamic colors applied via inline styles (survey appearance colors)
- **Contrast calculation**: `getContrastColor(hexColor)` returns 'white' or 'black' for text
- Dark mode toggle via `mode-watcher` and `ModeSwitcher` component

## Key Development Workflows

### Build & Deployment
```bash
bun install          # Install dependencies
bun run dev          # Dev server on :5173
bun run build        # Static build → /build directory (required for preview/e2e)
bun run preview      # Preview production build locally
```

### Testing
```bash
bun run test:unit    # Vitest (client: jsdom, server: node)
bun run test:e2e     # Playwright (requires `bun run build` first)
bun run test         # Both unit & e2e in sequence
```

**Test setup**:
- Client tests: `src/**/*.svelte.test.ts` (jsdom environment)
- Server tests: `src/**/*.test.ts` excluding svelte tests (node environment)
- E2E: `e2e/*.test.ts` (uses preview server on :4173)
- Playwright clears localStorage in `beforeEach` for test isolation

### Development Commands
```bash
bun run check        # svelte-check + typescript validation
bun run check:watch  # Same with file watching
bun run lint         # ESLint + Prettier check
bun run format       # Auto-format with Prettier
bun run storybook    # Component stories on :6006
```

## Critical Patterns & Conventions

### Component Usage
- Reusable components in `src/lib/components/ui/` (shadcn-svelte provided)
- Custom components: `ConfirmDialog`, `EditSurveyDialog`, `LanguageSwitcher`, `ModeSwitcher`
- Use `bind:show` for modal/dialog state (two-way binding)

### Dialog/Modal Pattern (EditSurveyDialog example)
```typescript
let { show = $bindable(), surveyIdToEdit } = $props<{ show: boolean, surveyIdToEdit: string | null }>();
let currentSurvey = $derived(surveyIdToEdit ? $surveys.find(s => s.id === surveyIdToEdit) : undefined);
// Sync UI state when dialog opens via $effect
$effect(() => { if (show && currentSurvey) { /* sync editable state */ } });
```

### Confirmation Dialogs
Wrap destructive actions (delete, reset) with `ConfirmDialog`:
```svelte
<ConfirmDialog
    bind:show={showDeleteConfirm}
    title={m.delete_survey_title()}
    message={m.confirm_delete_survey_message_generic()}
    onConfirm={confirmDeleteSurvey}
    onCancel={cancelDeleteSurvey}
/>
```

### Color Handling
- Store colors as hex strings: `#eed7f9` (light), `#767cf9` (dark)
- Calculate contrast with: `getContrastColor(surveyAppearance.backgroundColor)`
- Dynamic inline styles: `` style="background-color: {survey?.appearance.buttonColor}" ``

### Derived State Pattern (Svelte 5 Runes)
```typescript
let surveyId = $derived(page.url.searchParams.get('id'));
let survey = $derived(surveyId ? $surveys.find(s => s.id === surveyId) : undefined);
let totalVotes = $derived(survey ? Object.values(survey.results).reduce((a,b) => a+b, 0) : 0);
```
Always use `$derived` for computed values dependent on stores—**never** manually sync state.

### Store Update Pattern
```typescript
surveys.update(current => 
    current.map(survey => 
        survey.id === targetId 
            ? { ...survey, question: newQ, appearance: { ...survey.appearance, ...newColors } }
            : survey
    )
);
```

## File Structure Reference
- **`src/lib/stores.ts`** — Core state management (Survey interfaces, store functions)
- **`src/lib/utils/`** — Utilities (`color.ts` for contrast, `response.ts` for responses)
- **`src/lib/components/`** — Reusable UI components
- **`src/routes/(app)/`** — Main app pages (survey management, taking surveys, results)
- **`messages/`** — JSON translation files (edit here, not in paraglide/)
- **`project.inlang/`** — Paraglide config (don't edit unless updating i18n setup)

## Common Tasks

### Add a New Survey Feature
1. Update `Survey` interface in `src/lib/stores.ts`
2. Add store function to manage the new field (e.g., `updateSurveyFeature()`)
3. Update pages that display/edit surveys (`+page.svelte`, `EditSurveyDialog.svelte`)
4. Add i18n keys to `messages/{en,de}.json`
5. Test with unit tests in `src/lib/stores.test.ts`

### Add Translations
1. Edit `messages/en.json` and `messages/de.json`
2. **Do not** edit `src/lib/paraglide/` (auto-generated)
3. Run `bun run build` to regenerate paraglide runtime
4. Import new key: `import { m } from "$lib/paraglide/messages.js"`

### Fix E2E Test Failures
- E2E tests clear localStorage before each test
- Playwright config starts preview server on :4173 automatically
- Use specific selectors: avoid generic `.flex.gap-4` if possible
- Import message keys to verify text: `import * as m_en from '../messages/en.json'`

## Known Limitations & Design Decisions
- **No server**: Static site only—no backend database or API
- **Offline-first**: All persistence via localStorage; no cloud sync
- **Single question per survey**: By design (kiosk simplicity)
- **UUID-based IDs**: Collision-free but not human-readable
- **Locale persistence**: Current locale not persisted; defaults to browser language
