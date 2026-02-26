# 💸 DivideAi

DivideAi is a lightweight web application that helps you **split** expenses with friends in a simple, mobile‑friendly interface.  
Users authenticate with Google, add friends, record shared expenses, and see per‑friend balances of who owes whom.

## ✨ Features

- Google Sign‑In authentication (Firebase Auth with Google provider).
- Multi language support: Portuguese and English, auto‑detected from browser with manual switch in the account screen.
- Friends list synced to Firestore, including profile picture when available.
- Shared expenses between you and a friend, with 50/50 or 100% split modes and “paid by me/friend” logic.
- Per‑friend balances showing what you owe or what they owe you, plus totals “to receive” and “to pay”.
- Mobile‑first UI with bottom navigation (Activity, Friends, Groups – coming soon, Account).

## 🧱 Tech Stack

- **Frontend**
  - HTML, CSS, JavaScript
  - Tailwind CSS via CDN
  - Font Awesome icons
  - Google Fonts (Roboto)

- **Backend / BaaS**
  - Firebase Authentication (Google provider, optional custom token login)
  - Cloud Firestore as main database
  - Realtime sync using Firestore listeners

## 🏗️ Architecture Overview

The app is a single‑page application that runs entirely in the browser and talks directly to Firebase.

Main concepts:

- **Authentication**
  - Google Sign‑In using Firebase Auth’s `GoogleAuthProvider`.
  - Optional support for custom token login (e.g. when `initialauthtoken` is present in the page).

- **Data model in Firestore**
  - All data is organized under an `artifacts/{appId}` root document, where `appId` is set to `DivideAI`.

### 👥 Public Profiles

- Path:  
  `artifacts/{appId}/public/data/profiles/{safeEmail}`

- `safeEmail` is the email with dots replaced (e.g. `user.name@gmail.com` → `user_name@gmail_com`).

- Example fields:
  - `uid`: Firebase Auth UID (when known)
  - `email`: user email
  - `displayName`: display name from Google or custom name
  - `photoURL`: profile photo URL, if available
  - `isGuest`: `true` if no public Google profile is found
  - `updatedAt`: timestamp in milliseconds

On login, the app saves/updates the current user profile in this collection.  
When adding a friend, it tries to load this profile to reuse name and photo.

### 🤝 User Friends

- Path:  
  `artifacts/{appId}/users/{uid}/friends/{friendDoc}`

- Each document represents one friend for that user.

- Example fields:
  - `email`
  - `displayName`
  - `photoURL`
  - `isGuest`
  - `addedAt`: timestamp in milliseconds

Friends are added via the “Add Friend” flow by providing a Google email.  
If a public profile document exists, the app reuses that data; otherwise it stores a “guest” friend with an optional custom name.

### 🧾 Shared Expenses

- Collection:  
  `artifacts/{appId}/sharedexpenses/{expenseId}`

- Each document represents one expense shared between the logged‑in user and a friend.

- Example fields:
  - `description`: short text
  - `amount`: number (total expense)
  - `date`: string date (e.g. `YYYY-MM-DD`)
  - `creatorEmail`: email of the user who created the expense
  - `friendEmail`: email of the other participant
  - `paidByEmail`: email of the person who actually paid
  - `splitType`: `"equal"` (50/50) or `"full"` (100% owed by the other person)
  - `timestamp`: numeric timestamp used for sorting
  - `involvedUsers`: array of emails, e.g. `[currentUser.email, friendEmail]`

The UI calculates balances per friend by iterating these documents:

- If current user paid:
  - Friend owes half or full amount according to `splitType`.
- If friend paid:
  - Current user owes half or full amount according to `splitType`.

## ☁️ Infrastructure Requirements

To run DivideAi you need:

- A Firebase project (e.g. created in the Firebase console).
- Enabled products:
  - **Authentication**
    - Sign‑in providers: Google enabled.
  - **Firestore**
    - Cloud Firestore database (production mode recommended).

- A Firebase Web App configuration with:
  - `apiKey`
  - `authDomain`
  - `projectId`
  - `storageBucket`
  - `messagingSenderId`
  - `appId`

Update the `firebaseConfig` object in the HTML/JS with your own values.

### 🌐 Hosting

Any static hosting solution works, for example:

- Firebase Hosting
- GitHub Pages
- Netlify
- Vercel
- S3 + CloudFront

You only need to serve:

- `index.html`
- `manifest.json`
- icons (e.g. `logo.png`)
- any other static assets

## 🔐 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para a coleção global de despesas partilhadas
    match /artifacts/DivideAI/shared_expenses/{expenseId} {
      // Permite ler se o e-mail do utilizador estiver na lista de envolvidos
      allow read: if request.auth != null && 
                  request.auth.token.email in resource.data.involvedUsers;
      
      // Permite criar se o utilizador estiver autenticado e se incluir a si próprio na lista
      allow create: if request.auth != null && 
                    request.auth.token.email in request.resource.data.involvedUsers;
      
      // Permite editar ou apagar se for o criador original
      allow update, delete: if request.auth != null && 
                             resource.data.creatorEmail == request.auth.token.email;
    }

    // Perfil público: qualquer um lê, apenas o dono escreve
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

1. Create a Firebase project and enable:
   - Authentication with Google provider.
   - Cloud Firestore.
2. Create a Web App in Firebase and copy the generated config.
3. Paste your `firebaseConfig` into the script section in `index.html`.
4. Serve the files with any static HTTP server (for example `firebase hosting`, `npx serve`, etc.).
5. Open the app in the browser, sign in with Google, add friends, and start adding shared expenses.

<br>

Written by [snackk](https://github.com/snackk)
