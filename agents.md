# agents.md - Project Context for AI Agents
## Project Overview
**DivideAI** is an expense-splitting web app. Users sign in with Google, add friends, create shared expenses, and track who owes whom.
## Key Facts
| Item | Value |
|------|-------|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS v3 (PostCSS, not CDN) |
| i18n | react-i18next - pt.json, en.json, fr.json |
| State management | React hooks (no Redux, no router) |
| Backend | Firebase Auth (Google) + Cloud Firestore (realtime listeners) |
| Deployment | Static files to GitHub Pages (frontend/dist/) |
| Package manager | npm |
| Node entry | frontend/src/main.jsx |
## Firestore Data Model
All paths are under artifacts/DivideAI/:
- **Profiles:** public/data/profiles/{email_with_dots_as_underscores}
- **Friends:** users/{uid}/friends/{docId}
- **Expenses:** shared_expenses/{docId} - queried with where(involvedUsers, array-contains, email)
## Architecture Decisions
- **No React Router** - view switching is state-based (currentView in App.jsx).
- **No external state library** - all state in hooks (useAuth, useExpenses, useFriends, useSearch).
- **Gestures** - custom useLongPress (500ms, haptic) and useSwipe (45px threshold) hooks in src/utils/gestures.js.
- **Firebase config** - loaded from VITE_FIREBASE_* env vars or window.__FIREBASE_CONFIG__.
## File Responsibilities
| File/Dir | Purpose |
|----------|---------|
| src/App.jsx | Root component: auth gate, view rendering, modal orchestration |
| src/firebase.js | Firebase app/auth/db initialization |
| src/hooks/useAuth.js | onAuthStateChanged, Google login, logout, profile save |
| src/hooks/useExpenses.js | Realtime expense listener, add/update/delete |
| src/hooks/useFriends.js | Realtime friends listener, add friend with profile lookup |
| src/components/views/ActivityView.jsx | Main screen: grouped-by-friend cards with balances |
| src/components/views/FriendDetailsView.jsx | Per-friend expense list, monthly grouping, swipe-to-delete |
| src/utils/balance.js | calculateFriendBalance(expenses, friendEmail, userEmail) |
## Conventions
- All components are functional (hooks only).
- Tailwind utility classes are used verbatim - no custom component classes.
- CSS variables for Material Design 3 dark theme are in src/styles/index.css.
- Translation keys are flat (no nesting) in JSON files.
## Commands
```
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
```
## Important Constraints
- UI/UX must remain pixel-identical to the original monolithic index.html.
- Touch interactions: swipe threshold 45px, long-press 500ms with navigator.vibrate(50).
- Firebase collection paths must not change (existing user data depends on them).
- The settle mechanism creates a new expense doc with splitType full and description Liquidacao de Contas.
