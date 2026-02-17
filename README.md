# GymTracker — AI-Powered Fitness Companion

A modern, dark-themed fitness tracking app built with Next.js. Track your meals with AI-powered photo analysis, monitor body progress over time, and generate personalized workout plans — all powered by Google Gemini AI.

## Features

- **Food Tracking** — Snap a photo of your meal and AI analyzes calories, macros, and individual food items
- **Progress Tracking** — Upload body photos, log weight/measurements, and get AI physique analysis
- **Training Plans** — AI generates personalized workout plans based on your goals, fitness level, and equipment
- **Dashboard** — Daily calorie summary, active training plan, latest progress at a glance
- **Offline-First** — All data stored locally in the browser (no account needed)

## Tech Stack

| Category | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 2.5 Flash |
| Icons | Lucide React |
| Charts | Recharts |
| Dates | date-fns |

## Getting Started

### Prerequisites

- **Node.js 20+** (use `nvm use 20` if you have nvm)
- **Gemini API Key** — free, no credit card required

### Setup

```bash
# Clone and install
cd gymtracker
npm install

# Add your Gemini API key
# Edit .env.local and replace "your_key_here" with your actual key
# Get a free key at: https://aistudio.google.com/apikey

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (dark theme, bottom nav)
│   ├── page.tsx                  # Dashboard
│   ├── globals.css               # Tailwind + dark theme variables
│   ├── food/
│   │   ├── page.tsx              # Food log + daily totals
│   │   └── [id]/page.tsx         # Meal detail view
│   ├── progress/
│   │   ├── page.tsx              # Progress photo gallery + weight chart
│   │   └── [id]/page.tsx         # Progress detail view
│   ├── training/
│   │   ├── page.tsx              # Training plans list
│   │   └── [id]/page.tsx         # Full plan with workout days
│   └── api/ai/
│       ├── analyze-food/route.ts
│       ├── analyze-progress/route.ts
│       └── generate-plan/route.ts
├── components/
│   ├── ui/                       # Reusable primitives
│   ├── layout/                   # BottomNav, Header
│   ├── food/                     # Food section components
│   ├── progress/                 # Progress section components
│   └── training/                 # Training section components
├── hooks/                        # Custom React hooks
├── lib/
│   ├── ai/                       # Gemini client, prompts, parsers
│   ├── storage/                  # Storage abstraction layer
│   └── utils/                    # Image compression, dates, constants
└── types/                        # TypeScript type definitions
```

## Architecture

### How It Works

```
User interacts with Pages
    → Pages use Custom Hooks for data & logic
    → Hooks use Storage Layer for CRUD operations
    → AI features route through API Routes → Gemini API
    → UI built from reusable Components
```

### Storage Layer (No Database — Yet)

Data is stored in **browser localStorage** using an abstracted interface pattern:

```
IStorageService<T> (interface)
    └── LocalStorageService (current — browser storage)
    └── SupabaseService    (future — just swap the factory)
    └── FirebaseService    (future — just swap the factory)
```

All methods are async so swapping to a real database only requires changing **one file** (`src/lib/storage/index.ts`). No other code changes needed.

**Current limitations:**
- Data lives only in your browser (not synced across devices)
- Clearing browser data deletes everything
- ~5-10MB storage limit

### AI Integration

All AI calls go through **server-side API routes** to keep the Gemini API key secure:

| Route | Input | Output |
|---|---|---|
| `POST /api/ai/analyze-food` | Meal photo + meal type | Food items, calories, macros, health rating |
| `POST /api/ai/analyze-progress` | Body photo (+ optional previous) | Body fat estimate, muscle notes, recommendations |
| `POST /api/ai/generate-plan` | Goal, level, days, equipment | Full workout plan with exercises |

**Flow:** Browser sends image/params → API route (server) → Gemini API → Parse JSON response → Return to browser

### Custom Hooks

| Hook | Purpose |
|---|---|
| `useFood` | CRUD for meals, daily calorie/macro totals, AI food analysis |
| `useProgress` | CRUD for progress entries, AI body analysis, get latest |
| `useTraining` | CRUD for plans, set active plan, AI plan generation |
| `useImageUpload` | File selection, image compression, thumbnail creation |

### UI Components

**Primitives (`components/ui/`):**

| Component | Purpose |
|---|---|
| `Button` | 4 variants — primary (lime), secondary, ghost, danger |
| `Card` | Dark card with zinc border, rounded corners |
| `Input` | Styled input with label |
| `Select` | Dropdown with label |
| `Badge` | Colored pill labels |
| `Modal` | Bottom sheet (mobile) / centered dialog (desktop) |
| `ImageUpload` | Drag-drop + camera capture + preview |
| `LoadingSpinner` | Animated spinner with optional text |
| `EmptyState` | Icon + message + action for empty pages |

**Layout:**

| Component | Purpose |
|---|---|
| `BottomNav` | Fixed 4-tab navigation — Dashboard, Progress, Food, Training |
| `Header` | Sticky top bar with title, back button, action slot |

### Theme

Dark gym-style aesthetic:
- **Background:** Near-black (`#09090b`)
- **Cards:** Dark zinc with subtle borders
- **Accent:** Lime green (`#84cc16`)
- **Macro Colors:** Protein = blue, Carbs = amber, Fat = red, Fiber = green

## User Flow Example (Food)

```
1. Tap Food tab → see daily totals and meal log
2. Tap "+" → modal opens with upload form
3. Upload/take a photo of your meal
4. Image gets compressed and a thumbnail is created
5. Tap "Analyze with AI" → photo sent to Gemini
6. AI returns: food items, calories, macros, health rating
7. Review results, tap "Save"
8. Meal saved to localStorage, appears in log
9. Daily totals update automatically
```

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — today's calories, quick actions, active plan, latest progress |
| `/food` | Daily macro summary + meal log + add new meal with AI |
| `/food/[id]` | Full meal detail — photo, macro bars, food items, health notes |
| `/progress` | Weight trend chart + progress photo grid + add entry with AI |
| `/progress/[id]` | Full progress detail — photo, measurements, AI analysis |
| `/training` | Plans list with activate/delete + generate new plan with AI |
| `/training/[id]` | Full plan view with expandable workout days and exercises |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI features) | Google Gemini API key — [get one free](https://aistudio.google.com/apikey) |

## License

MIT
