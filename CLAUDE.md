# Tonic

Tonic is a personal macro-tracking recipe app for people who lift and cook. Users save their own ingredients with macros, build recipes from them (the app calculates totals), and log what they eat in a diary with adjustable amounts. Following friends is optional and secondary.

It started as a cocktail-sharing app for a web dev bootcamp final project; the cocktail code is being replaced step by step. See `BACKLOG.md` for the goal and plan.

The owner is relearning web development after a year away, so clarity matters more than cleverness.

## Stack and structure

- `client/`: React 19 (Create React App), React Router 7, CSS Modules, react-hot-toast, Cloudinary for image uploads
- `server/`: Express 5, MongoDB (Atlas), bcrypt
  - `server.js`: routes
  - `api_handlers/`: one file per drink/recipe endpoint
  - `user_handlers/`: signup and login
  - `db.js`: the shared MongoDB client
- Database name: `tonic`
- Package manager: **yarn** (v1). Node 20.

## Running the app

Two terminals, both started from the `Tonic` folder:

```bash
cd server && yarn dev     # API on http://localhost:8000 (restarts on save)
cd client && yarn start   # website on http://localhost:3000
```

The client proxies `/api` and `/user` requests to port 8000.

## Branches

- **`main`**: the owner's hands-on learning branch. The owner writes the code. Claude explains, gives hints and reviews diffs, but does not edit app code on `main` unless asked.
- **Other branches** (e.g. `tonic-supercharged1`): Claude builds features using the workflow below.

## Workflow (non-`main` branches)

1. **One task at a time.** Tasks come from `BACKLOG.md`. Only work on a task when the owner asks.
2. **Plan first.** Before writing code, say what will change, which files, and why. Wait for an OK.
3. **Build in small steps** that leave the app working.
4. **Explain afterwards:** a short summary of what changed and why, plus a simple explanation of any concept the owner may not have seen before.
5. **Owner tests** in the browser.
6. **Commit only after asking.** Suggest a commit message, commit when the owner says OK. Ask before pushing too.
7. When a task is done, check it off in `BACKLOG.md`.

## Guardrails

- Never read, print, edit or commit `server/.env` (it holds the database password).
- Install packages **inside** `client/` or `server/`, never in a parent folder. Check the current folder before `yarn add`.
- Stage files by name. Check `git status` before committing.
- Don't make large rewrites or rename many files without a plan the owner approved.
- Don't delete database data without asking.

## Engineering rules

**Comments**
- Add comments generously. Explain *why* the code does something, not just *what*.

**Server**
- The server must handle **any** request safely, not just ones from our forms. Hiding something in the UI is not protection.
- Validate every field from `req.body` / `req.params`:
  - Check the type **before** calling methods on it: `typeof name !== 'string' || !name.trim()`
  - For arrays, use `.some()` in a normal `if`. Never `return` from inside `.forEach()`; it doesn't stop the handler.
  - Optional fields: only validate them if they were sent (`!== undefined`).
- Clean input (`trim`, `toLowerCase` for emails) **before** checking for duplicates, and save the cleaned value.
- Passwords never leave the server. Strip them from any user object before sending it.
- Empty results are not errors: return `200` with an empty array, not `404`. Use `404` only when the thing asked for doesn't exist (e.g. a user ID).
- IDs from the URL or request body are strings and need `new ObjectId(id)`. IDs read out of the database are already `ObjectId`s.
- Routes that need a login use the `requireAuth` middleware (`server/auth.js`) and get the user from `req.userId`. Never trust a user ID from `req.body` or the URL for permissions.
- Owned things (ingredients, recipes, diary) store `ownerId`; edit/delete must check `ownerId` equals `req.userId` (answer `403` if not).

**Login (client)**
- Requests that need a login use `authFetch` from `useAuth()` instead of `fetch`. It adds the token and handles expired logins.
- Log in and out with `login(user, token)` / `logout()` from `useAuth()`, not `setUser`.

**Client**
- Phone first: style for a narrow phone screen first, then add `@media (min-width: ...)` rules for bigger screens. Buttons and inputs must be easy to tap.
- Every list page handles four states: loading, error, empty (friendly message), and results.
- Guard against a logged-out `user` (`null`) before using `user._id`.
- Any value a `useEffect` uses goes in its dependency array.
- Don't import a component under the name `Error` (it hides JavaScript's built-in `Error`). Use `ErrorMessage`.
- Hooks (`useState`, `useEffect`, `useAuth`...) go before any early `return`.

**Style**
- Use `===` / `!==`, not `==` / `!=`.
- Commit messages: start with a present-tense verb, around 50–70 characters (e.g. `fix crash on My Recipes when user has no drinks`).

## Planned work

Planned work is tracked in `BACKLOG.md`.
