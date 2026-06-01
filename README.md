# 💸 DivideAi

DivideAi is a lightweight web application that helps you **split** expenses with friends in a simple, mobile‑friendly interface.  
Users authenticate with Google, add friends, record shared expenses, and see per‑friend balances of who owes whom.

## ✨ Features

- Google Sign‑In authentication (Firebase Auth with Google provider).
- Multi language support: Portuguese, English, and French — auto‑detected from browser with manual switch in the account screen.
- Friends list synced to Firestore, including profile picture when available.
- Shared expenses between you and a friend, with 50/50 or 100% split modes and "paid by me/friend" logic.
- Per‑friend balances showing what you owe or what they owe you, plus totals "to receive" and "to pay".
- Settle up (long‑press on a friend card) to zero out balances.
- Swipe‑to‑delete on individual expense items.
- Mobile‑first UI with bottom navigation (Activity, Friends, Groups – coming soon, Account).
- PWA support (manifest, apple‑mobile‑web‑app meta tags).

## 🧱 Tech Stack

- **Frontend**
  - React 18 + Vite
  - Tailwind CSS v3 (PostCSS)
  - react‑i18next for internationalization
  - Font Awesome icons
  - Google Fonts (Roboto)

- **Backend / BaaS**
  - Firebase Authentication (Google provider, optional custom token login)
  - Cloud Firestore as main database
  - Realtime sync using Firestore `onSnapshot` listeners

## 📁 Project Structure

```
├── index.html                 # Minimal Vite entry with PWA meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── logo.png
├── manifest.json
├── CNAME
└── src/
    ├── main.jsx               # ReactDOM.createRoot entry
    ├── App.jsx                # Auth gate, layout shell, state‑based view switching
    ├── firebase.js            # Firebase init (env vars or window config)
    ├── i18n/
    │   ├── index.js           # i18next setup with browser language detection
    │   ├── pt.json
    │   ├── en.json
    │   └── fr.json
    ├── hooks/
    │   ├── useAuth.js         # Auth state, login, logout, profile sync
    │   ├── useExpenses.js     # Firestore realtime expenses CRUD
    │   ├── useFriends.js      # Firestore realtime friends list + add
    │   └── useSearch.js       # Search term state
    ├── components/
    │   ├── AuthScreen.jsx     # Google login screen
    │   ├── Header.jsx         # Sticky header with search + avatar
    │   ├── BottomNav.jsx      # Bottom nav tabs + center FAB
    │   ├── Toast.jsx          # Toast notification
    │   ├── modals/
    │   │   ├── ExpenseModal.jsx
    │   │   ├── FriendModal.jsx
    │   │   └── SettleModal.jsx
    │   └── views/
    │       ├── ActivityView.jsx
    │       ├── FriendsView.jsx
    │       ├── FriendDetailsView.jsx
    │       ├── GroupsView.jsx
    │       └── AccountView.jsx
    ├── utils/
    │   ├── balance.js         # calculateFriendBalance logic
    │   └── gestures.js        # useLongPress + useSwipe hooks
    └── styles/
        └── index.css          # Tailwind directives + custom CSS variables
```

## 🏗️ Architecture Overview

The app is a React single‑page application that talks directly to Firebase. No backend server required — state‑based view switching (no React Router).

### Authentication

- Google Sign‑In using Firebase Auth's `GoogleAuthProvider`.
- Optional support for custom token login (`window.__initial_auth_token`).

### Data Model (Firestore)

All data is organized under `artifacts/DivideAI/`.

#### 👥 Public Profiles

- **Path:** `artifacts/DivideAI/public/data/profiles/{safeEmail}`
- `safeEmail` = email with dots replaced by underscores.
- Fields: `uid`, `email`, `displayName`, `photoURL`, `updatedAt`

#### 🤝 User Friends

- **Path:** `artifacts/DivideAI/users/{uid}/friends/{friendDoc}`
- Fields: `email`, `displayName`, `photoURL`, `isGuest`, `addedAt`

#### 🧾 Shared Expenses

- **Path:** `artifacts/DivideAI/shared_expenses/{expenseId}`
- Fields: `description`, `amount`, `date`, `creatorEmail`, `friendEmail`, `paidByEmail`, `splitType` (`equal`|`full`), `timestamp`, `involvedUsers[]`

Balance calculation:
- If current user paid → friend owes half (equal) or full amount.
- If friend paid → current user owes half (equal) or full amount.

## ☁️ Infrastructure Requirements

- A Firebase project with:
  - **Authentication** — Google provider enabled.
  - **Cloud Firestore** — production mode.
- Firebase Web App config values (set as environment variables):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

### 🌐 Hosting

Any static hosting works (GitHub Pages, Firebase Hosting, Netlify, Vercel).  
Deploy the `dist/` folder after running `npm run build`.

## 🔐 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/DivideAI/shared_expenses/{expenseId} {
      allow read: if request.auth != null && 
                  request.auth.token.email in resource.data.involvedUsers;
      allow create: if request.auth != null && 
                    request.auth.token.email in request.resource.data.involvedUsers;
      allow update, delete: if request.auth != null && 
                             resource.data.creatorEmail == request.auth.token.email;
    }

    match /artifacts/DivideAI/public/data/profiles/{profileId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                    request.auth.token.email.replace(".", "_") == profileId;
    }

    match /artifacts/DivideAI/users/{userId}/friends/{friendId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🖥️ Running Locally

1. Create a Firebase project and enable Authentication (Google) + Cloud Firestore.
2. Copy your Firebase config values.
3. In the project root:
   ```bash
   npm install
   ```
4. Create a `.env` file in the project root:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Open the app in the browser, sign in with Google, add friends, and start sharing expenses.

## 🚀 Building for Production

```bash
npm run build
```

Output goes to `dist/` — deploy this folder to your static host.

<br>

Written by [snackk](https://github.com/snackk)
