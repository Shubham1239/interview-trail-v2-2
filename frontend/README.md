# Interview Trail — frontend

React 18 + Vite + Recoil + Tailwind. Talks to the backend in `../backend`.

## Setup

    npm install
    cp .env.example .env      # point VITE_API_BASE_URL at your backend
    npm run dev

## Folder structure — flat, one level of nesting

    src/
      main.jsx           entry point — wraps App in RecoilRoot
      App.jsx             routes + session bootstrap (axios <-> Recoil wiring)
      routes.js            every URL path, named once
      roles.js              ROLES + role-comparison helpers

      atoms/               Recoil state — one file per domain
        auth.js               token, current user, auth-loading flag
        posts.js               normalized post store, feed ids/pagination, per-post votes/comments
        filters.js              feed search/sort/tag state
        toast.js                toast notification queue

      selectors/            derived Recoil state
        auth.js                isAuthenticated
        posts.js                feedPostsSelector, postByIdSelector

      api/                  one axios instance + one file per backend resource
        axios.js               the shared axios client (token header, 401 handling)
        auth.js, posts.js, comments.js

      hooks/                small reusable hooks
        useAuth.js, useToast.js, useDebounce.js

      utils/
        date.js                formatRelativeDate

      components/
        ui/                   generic building blocks: Button, Card, Input,
                                Badge, Loader, Modal, Toast
        Navbar.jsx, Footer.jsx, ErrorBoundary.jsx, ProtectedRoute.jsx
        PostCard.jsx, VoteButtons.jsx, CommentSection.jsx, SearchBar.jsx,
        AuthForm.jsx           — feature-specific components, used by one or two pages

      pages/                 one component per route
        LoginPage.jsx, RegisterPage.jsx, FeedPage.jsx, PostPage.jsx,
        PostFormPage.jsx (handles both create and edit), DashboardPage.jsx

## How to extend this

- **New page**: add a file to `pages/`, add its `<Route>` in `App.jsx`, add its
  path to `routes.js`.
- **New piece of state**: add an atom to the right file in `atoms/` (or a new
  file if it's a new domain). Add a selector in `selectors/` only if some page
  needs a *derived* view of it (e.g. filtered/joined data).
- **New backend endpoint**: add one function to the matching file in `api/`
  (or a new file for a new resource). Never call `axios` directly from a
  component or page — always go through `api/axios.js`.
- **New reusable UI piece** (used by 2+ places, no page-specific logic):
  `components/ui/`. Something tied to one feature (votes, comments, the post
  form): `components/`.
- **Theme changes**: edit `tailwind.config.js` (`ink`, `paper`, `trailmark`,
  `pine`, `brick` tokens) rather than hardcoding hex values in components.

## What's stubbed, not built

- Dashboard panels (report review, user management, analytics) are shells —
  the backend endpoints don't exist yet.
- No tests, no TypeScript, no Redux/Zustand.

## Code style

Every function in this codebase uses the `function` keyword — no arrow
functions, including inside `.map()`, event handlers, and Recoil
atom/selector definitions. Keep new code consistent with that.
