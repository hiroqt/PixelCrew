# Clean Frontend Architecture & Anti-Spaghetti Code Guide

## 1. Core Architectural Philosophy
Writing clean, maintainable frontend code means ensuring **any developer joining the codebase can understand, debug, and extend features without cognitive overload**.

Spaghetti code in frontend applications emerges from:
1. Giant 800-line monolithic component files.
2. Mixing server data fetching, business validation, UI rendering, and state management in one place.
3. Prop-drilling across 5+ component layers instead of localized composition.
4. Tightly coupled, brittle global states.
5. Inconsistent naming and unstructured directories.

---

## 2. Directory Structures: Modern vs. Classic/Legacy

### A. Modern Feature-Driven Architecture (Recommended: Next.js App Router / Vite React / Nuxt / SvelteKit)
```
src/
├── app/                        # Routing & Layout Shells (Next.js / SvelteKit / Nuxt)
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── analytics/page.tsx
│   └── api/                    # Route Handlers
│       └── projects/route.ts
├── features/                   # Domain-Driven Feature Modules (High Cohesion, Low Coupling)
│   ├── authentication/
│   │   ├── components/         # Feature-specific UI components
│   │   │   ├── login-form.tsx
│   │   │   └── auth-guard.tsx
│   │   ├── hooks/              # Custom business logic hooks
│   │   │   └── use-auth-session.ts
│   │   ├── services/           # API calls & data mutations
│   │   │   └── auth-api.ts
│   │   ├── types/              # TypeScript schemas & interfaces
│   │   │   └── auth.types.ts
│   │   └── index.ts            # Public feature API export boundary
│   └── analytics/
│       ├── components/
│       ├── hooks/
│       └── types/
├── components/                 # Shared, Dumb, Reusable Primitives (Design System)
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── toast.tsx
│   └── feedback/
├── lib/                        # Third-party wrappers, client singletons (Prisma, Supabase, Axios)
│   ├── db.ts
│   └── utils.ts
├── styles/                     # CSS design tokens, typography scales, theme variables
│   ├── globals.css
│   └── tokens.css
└── types/                      # Global / Ambient TypeScript definitions
    └── global.d.ts
```

### B. Classic / Multi-Page / Legacy Web Structure (Vite SPA, CRA, MPA, Vanilla JS/HTML/CSS)
```
src/
├── assets/                     # Static images, vectors, fonts
├── components/                 # Reusable UI widgets
│   ├── Header/
│   │   ├── Header.jsx
│   │   ├── Header.module.css
│   │   └── Header.test.jsx
│   └── Footer/
├── pages/                      # Page components (Vue Router / React Router v5/v6)
│   ├── Home/
│   └── Dashboard/
├── services/                   # HTTP API client services
│   └── api-client.js
├── store/                      # Redux / Vuex / Zustand stores
├── utils/                      # Helper functions, formatters, validators
│   ├── date-formatter.js
│   └── validation.js
└── index.js
```

---

## 3. The 5 Golden Rules of Anti-Spaghetti Code

### Rule 1: The 150-Line Component Limit
If a single component exceeds 150–200 lines of code, it is doing too much. Extract sub-components or extract business logic into custom hooks.

```tsx
// ❌ SPAGHETTI: 400-line monolithic file doing fetching, form state, modals, and rendering
export function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  // ... 50 lines of validation, 100 lines of JSX
}

// ✓ CLEAN: Clean separation of concerns
export function UserProfile() {
  const { user, isLoading, error } = useUserProfile();
  const { isEditing, openEditModal, closeEditModal } = useModalState();

  if (isLoading) return <ProfileSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="profile-container">
      <ProfileHeader user={user} onEdit={openEditModal} />
      <ProfileStats user={user} />
      <ProfileActivityHistory userId={user.id} />
      {isEditing && <EditProfileModal user={user} onClose={closeEditModal} />}
    </div>
  );
}
```

### Rule 2: Custom Hooks as Headless Logic Controllers
Never embed complex `useEffect`, API calls, or multi-step state transformations directly into JSX presentation components. Extract them into custom hooks (`useFeatureName`):

```tsx
// ✓ CLEAN: Custom Hook containing business logic
export function useProjectFilter(initialProjects: Project[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? p.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [initialProjects, searchQuery, selectedTag]);

  return {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    filteredProjects
  };
}
```

### Rule 3: Explicit Public API Boundaries (`index.ts`)
Features should only expose intentional public contracts. Internal helper functions must remain private within the feature directory:

```typescript
// src/features/analytics/index.ts
export { AnalyticsDashboard } from './components/analytics-dashboard';
export { useAnalyticsMetrics } from './hooks/use-analytics-metrics';
export type { MetricSummary } from './types/analytics.types';
// Do NOT export internal helpers like formatRawClickhouseTelemetry
```

### Rule 4: Self-Documenting Naming Conventions
- **Booleans**: Prefix with `is`, `has`, `should`, `can` (`isLoading`, `hasPermission`, `canSubmit`).
- **Event Handlers**: Prefix props with `on` (`onClick`, `onSave`) and implementations with `handle` (`handleClick`, `handleSave`).
- **Data Collections**: Use plural nouns (`users`, `activeProjects`, `metricsList`).

### Rule 5: Strict TypeScript Without `any`
Always define explicit interfaces, discriminating unions for UI states, and use Zod / Valibot for runtime validation at API boundaries.
