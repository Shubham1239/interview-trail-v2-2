# Interview Trail — backend

Node.js + Express + MongoDB (Mongoose) API for the Interview Experience
Sharing Platform. JWT auth, role-based access (user/moderator/admin).
Built to match the frontend's `src/api/*.js` calls exactly.

## Setup

    npm install
    cp .env.example .env
    # set MONGODB_URI (local mongod, or a free Atlas cluster)
    # set JWT_SECRET to any long random string
    npm run dev

Runs on **port 5001** by default — port 5000 clashes with AirPlay
Receiver on macOS, so this avoids that.

## Folder structure

    src/
      config/db.js          Mongoose connection
      models/                User, Post, Comment (Mongoose schemas)
      middleware/
        auth.js               requireAuth — verifies JWT, loads req.user
        roles.js               requireRole('moderator') — RBAC gate
        errorHandler.js       centralizes error responses
      controllers/            one file per resource, thin route handlers
      routes/                 authRoutes, postRoutes, commentRoutes
      app.js                   express app + middleware wiring
      server.js               connects to Mongo, starts listening

## API surface

    POST   /api/auth/register        { name, email, password } -> { token, user }
    POST   /api/auth/login           { email, password }       -> { token, user }
    GET    /api/auth/me              (auth)                    -> user
    POST   /api/auth/logout          (auth)                    -> { ok }

    GET    /api/posts                ?page&pageSize&q&tags&sortBy&company
    GET    /api/posts/:postId
    POST   /api/posts                (auth)
    PUT    /api/posts/:postId        (auth, author or mod/admin)
    DELETE /api/posts/:postId        (auth, author or mod/admin)
    POST   /api/posts/:postId/vote   (auth) { direction: -1|0|1 }

    GET    /api/posts/:postId/comments
    POST   /api/posts/:postId/comments             (auth) { body }
    DELETE /api/posts/:postId/comments/:commentId  (auth, author or mod/admin)

## Notes for when you study this

- **JWT flow**: `authController.js` signs `{ sub: userId }` on login/register.
  `middleware/auth.js` verifies it on every protected route and loads the
  fresh user from MongoDB — so a role change or ban takes effect on the
  very next request, not just at token-issue time.
- **RBAC**: `requireRole('moderator')` in `middleware/roles.js` ranks
  roles numerically (user < moderator < admin) and mirrors the frontend's
  `hasMinRole()` — keep both in sync if you add a role.
- **Voting**: each post stores a `votes: [{ user, direction }]` array;
  `score` is computed in the `toJSON` transform, not stored, so it can
  never drift out of sync with the raw votes.
- **Search**: `Post` has a MongoDB text index on title/body/company/tags,
  used by `GET /api/posts?q=...`.
- Nothing here is deployed — this all needs a running MongoDB
  (local `mongod` or a free Atlas cluster) to actually work.
