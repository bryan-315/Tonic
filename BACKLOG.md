# Tonic Backlog

How this file works:
- **Feature**: a big thing the app can do.
- **User story**: one piece of it, from a user's point of view, with a checklist of what "done" means.
- **Task**: a small step to build it. Check it off when it's done and committed.

Work top to bottom unless decided otherwise.

## The goal

Tonic is a **personal macro-tracking recipe app**, mainly for lifters who cook.
- Users create their own **ingredients** with their own macros.
- They combine ingredients into **recipes**, and the app calculates the totals.
- A **diary** logs what they actually ate each day, with adjustable amounts.
- Social features (following friends) are optional and come last. The app must be fully useful without them.
- **Phone first:** every page is designed for a phone screen first, then made to look good on a computer. Long-term goal: a real phone app (PWA first, maybe React Native later) that reuses the same server.
- **Simple for beginners:** only calories are required. Everything else is optional.

### How the math works

Each ingredient stores **one serving**, described in as many units as the user wants, plus the macros for that serving:

> Whey: **1 scoop = 30 g** → 120 kcal, 24 g protein
> Potatoes: **100 g** → 77 kcal, 2 g protein
> Egg: **1 piece = 50 g** → 72 kcal, 6 g protein

All the units in a serving mean the same amount of food. So the user can enter whichever unit is easiest, and one formula works for all of them:

> macros used = macros × (amount used ÷ serving amount in that unit)
> 2 scoops → 120 × (2 ÷ 1) = 240 kcal
> 45 g whey → 120 × (45 ÷ 30) = 180 kcal

Totals are always **calculated**, never typed in by hand.

---

## 1. Reliable database connection

**Story:** As a user, I want pages to load without random "Internal server error" messages, so the app feels dependable.

Done when:
- [x] Two requests at the same time never break each other
- [x] The server connects to MongoDB once, when it starts
- [x] If the database can't be reached at startup, the server says so clearly

Tasks (plan approved in chat, 2026-11-19):
- [x] `db.js`: add `connectToDb()` (connect once + ping) and export a shared `db`
- [x] `server.js`: connect first, then `listen`; if it fails, print a clear message and exit
- [x] All 13 handlers: import `db`, remove `client.connect()` / `client.close()` / `finally` and the `'in'` / `'out'` logs (`getIngredients.js` never connected at all)
- [x] Close the connection politely on Ctrl+C
- [x] Leave `batchimport.js` alone (one-off script; removed in Feature 2)
- [x] Test: fire ~10 requests at once, none should fail

**Decided:** keep using the `tonic` database on this branch (it only has test data).

---

## 2. Real login (security)

Moved before Ingredients (2026-11-19) so every new route is built with real login from day one, instead of being redone later.

**Story:** As a user, I want only me to be able to see my diary and change my ingredients and recipes.

Done when:
- [x] The server can tell who is making a request from a signed token, without trusting a user ID sent by the browser
- [ ] Creating, editing and deleting require a valid login (each new route in Features 3+ uses `requireAuth`)
- [ ] Trying to change someone else's things is refused (each new route checks `ownerId === req.userId`)
- [x] When my login expires, I'm logged out with a clear message

Tasks (built 2026-11-20):
- [x] Server: add `jsonwebtoken`; `JWT_SECRET` in `.env` (owner adds it; server refuses to start without it)
- [x] Server: login and signup return `{ user, token }` (token lasts 30 days)
- [x] Server: `requireAuth` middleware (`server/auth.js`): reads `Authorization: Bearer <token>`, sets `req.userId`, else `401`
- [x] Server: `GET /api/me` returns the logged-in user (used to check the token on app load)
- [x] Server: fix `cleanEmail` missing `const` in `logIn.js`
- [x] Client: AuthContext stores the token next to the user, with `login()` / `logout()`
- [x] Client: `authFetch()` (from `useAuth()`) adds the token to requests; on `401` it logs out with a toast
- [x] Client: Login/Signup use the new response; fix Login's `setLoading` before validation
- [x] Old drink routes stay as they are (they're replaced in Feature 4)

---

## 3. Ingredients

**Story 2.1:** As a user, I want to create my own ingredients with their macros, using whatever amount is on the label, so I never have to look them up again.

Done when:
- [x] I can create an ingredient: name, serving, calories, protein, carbs, fat
- [x] The serving has at least one `{ amount, unit }`, e.g. `1 scoop`
- [x] I can add more units for the same serving ("+ add unit"), e.g. `1 scoop` = `30 g` = `2 tbsp`
- [x] Units are typed by me (scoop, g, ml, cup, slice...) and can't repeat within one ingredient
- [x] Only calories are required; protein, carbs and fat are optional (so beginners can start with just calories)
- [ ] A blank optional macro counts as 0 in totals (totals arrive with recipes, Feature 4)
- [x] Amounts must be more than 0; macros can't be negative (no upper limit)
- [x] Ingredient names are unique per user, ignoring capitals (different users can share names)

**Story 2.2:** As a user, I want to add an extra unit to an ingredient later (e.g. I bought a scale and now know a scoop is 30 g), so I'm not stuck with the first unit I picked.

Done when:
- [x] Editing an ingredient lets me add or remove units
- [ ] I can't remove a unit that a recipe still uses (or I get a clear warning) (Feature 4)

**Story 2.3:** As a user, I want to choose what happens to my recipes when I delete an ingredient they use.

Done when:
- [x] If no recipe uses it: a simple "Delete Whey?" confirm
- [ ] If recipes use it, I'm asked: "Whey is used in 2 recipes (Shake, Pancakes)." **[Delete from recipes too] [Keep it in recipes] [Cancel]** (Feature 4)
- [ ] "Delete from recipes too" removes it everywhere (those recipes' totals change) (Feature 4)
- [ ] "Keep it in recipes" hides it from my ingredient list, but recipes still show it and count its macros; it just can't be opened or edited (Feature 4)
- [ ] "Keep" is done with a **soft delete** (`deleted: true`), not a real delete (Feature 4)
- [x] I can see a list of my ingredients
- [x] I can edit and delete my ingredients

Tasks (built 2026-11-20):
- [x] Server: `ingredients` collection with `ownerId` (the old cocktail collection was already empty)
- [x] Server: create / list / get / edit / delete routes, all behind `requireAuth`, with shared validation (`helpers/validateIngredient.js`) and owner check (`helpers/findOwnIngredient.js`)
- [x] Client: "My Ingredients" page + sidebar link
- [x] Client: create / edit ingredient form (`IngredientForm.js`), phone first; checks number boxes before sending
- [x] Remove the old ingredient routes, `batchimport.js` and the cocktail images

---

## 4. Recipes built from ingredients

**Decided (2026-11-20):**
- Recipes are **private** for now (like ingredients). The "All Recipes" page goes away and comes back as the friends feed in Feature 6.
- Old test drinks in the database get deleted in step 4e, when the drink code is removed.
- A recipe stores only `{ ingredientId, amount, unit }`; totals are always calculated from the ingredient's current macros.

Build steps (each tested and committed on its own):
- [x] **4a** Server: recipes API + one shared macro-math function (well tested): `client/src/utils/macros.js` + `macros.test.js` (run `yarn test` in `client/`)
- [ ] **4b** Recipe form (pick ingredients, amount + unit, live totals) + My Recipes list
- [ ] **4c** Recipe page: adjust amounts without saving, reset, portions
- [ ] **4d** Ingredient delete dialog (used in recipes → delete / keep / cancel), soft delete, block removing a used unit
- [ ] **4e** Remove drinks: pages, likes, badge, old data; rename sidebar; update home page

**Design decisions (grilling session, 2026-11-21):**

*What a recipe is*
- **Name** (required, unique per user ignoring capitals, like ingredients)
- **Ingredient lines** (at least 1): `{ ingredientId, amount, unit }`, in the order added (no reordering for now)
  - The same ingredient may appear twice (e.g. butter in the sauce and for the pan)
  - Unit is picked from a dropdown of **that ingredient's own units** only
  - Amount: a number above 0; "1,5" accepted; a clear message naming the line if it's not a number
- **Description**: one free-text box, like a blank notebook page (notes, steps, anything). Plain text, line breaks kept, max 5,000 characters, no formatting tools
- **Photo**: optional, one per recipe, can be replaced or removed (existing Cloudinary uploader)
- **Portions**: optional count (whole number, 2–50) + optional portion name (default "portion"), e.g. `6 × burrito`
- No tags or categories for now

*Building a recipe (form)*
- "Add ingredient" opens a **full-screen panel over the form** (same URL, so nothing typed is lost); ✕/Back closes it
- The panel lists all my ingredients with a **search box** on top; tap rows to select (✓), then **"Add 3 ingredients"**
- Ingredients already in the recipe show an "in recipe" tag but can still be picked
- A newly added line is pre-filled with the ingredient's **first unit and its amount** (Whey → `1 scoop`, Oats → `100 g`)
- Totals update live while editing
- Missing ingredient: for now, just a link to "New ingredient" (creating one inside the form is a future idea)

*Showing numbers*
- Calories as whole numbers (`412 kcal`), grams with 1 decimal (`31.5 g`); rounding is display-only, saved values stay exact
- My Recipes card: name, small photo if any, and totals (`kcal · protein`). If portions are set, show **per portion** instead (`412 kcal · 31 g protein per burrito`). To be reviewed once it's visible

*Recipe page (adjust for today)*
- Change any line's amount or unit, **and the portion count** ("made 5 instead of 6"), without saving; totals update instantly; **Reset** goes back to the saved recipe

*Deleted ingredients and deleting recipes*
- A "kept" (soft-deleted) ingredient shows greyed out as "(deleted ingredient)": its amount/unit can still be changed or the line removed, but it can't be opened and isn't in the picker
- Deleting a recipe: a simple "Delete Chili? This can't be undone." confirm

**Story 4.1:** As a user, I want to build a recipe from my saved ingredients and amounts, so I can see its total calories and protein.

Done when:
- [ ] I can create, edit and delete recipes as described above
- [ ] Recipe page and card show totals (calories, protein, carbs, fat), calculated from the ingredients
- [ ] A blank optional macro counts as 0 in totals

**Story 4.2:** As a user, I want to change amounts (and the portion count) on a recipe page and see new totals instantly, without editing the saved recipe.

**Story 4.3:** As a user, I want recipes for food and drinks alike, so a protein shake works the same way as a meal.

**Story 4.4:** As a meal prepper, I want to say a recipe makes several portions (e.g. 6 burritos), so I can see and log the macros for one portion.

Done when:
- [ ] By default a recipe shows totals for the whole thing
- [ ] With portions set, it also shows macros per portion (total ÷ 6)
- [ ] In the diary I can log portions (e.g. "2 burritos") (Feature 5)

---

## 5. Diary

The diary is a **blank page per day**, like a simple journal app. Nothing is forced; the user adds whatever building blocks they want.

**Story 5.1:** As a user, I want a Diary tab that lists dates, where clicking a date opens that day's page.

Done when:
- [ ] Diary tab shows dates (today at the top)
- [ ] Clicking a date opens that day; a new day starts empty
- [ ] The page has an "add" button with the block types below

**Story 5.2:** As a user, I want to add meals to a day, with the amounts I actually used, so a counter adds up my calories.

Done when:
- [ ] I can add a recipe (adjusting amounts or portions first) or a single ingredient (e.g. a banana)
- [ ] The day has a counter that always shows calories
- [ ] I can choose to also show protein, carbs and/or fat in the counter

**Story 5.3:** As a user, I want to write notes and record my body weight on a day.

Done when:
- [ ] I can add a text block with anything I want
- [ ] I can add my weight for the day (one per day)

**Story 5.4:** As a user, I want to add photos to a day (very optional, low priority maybe in the future), using the image uploader that already exists.

**Story 5.5:** As a user, I want my past days to stay correct even if I edit a recipe or ingredient later.

Done when:
- [ ] A meal entry saves a **copy** of the names, amounts and macros at the time it's logged

**Story 5.6:** As a user, I want to edit or delete any block on a day if I made a mistake.

---

## 6. Social (optional)

**Story:** As a user, I want to follow friends and see what they eat, just for fun, without it being required.

Done when:
- [ ] Recipes (and maybe diary days) can be private or public
- [ ] I can follow / unfollow a user
- [ ] A feed shows public recipes from people I follow
- [ ] The app works fully if I follow nobody

---

## Small fixes and cleanup

- [ ] Rename `Error` component imports to `ErrorMessage` in every file
- [ ] Remove unused imports (e.g. `bcrypt` in `editDrink.js`)
- [ ] Check that every `useEffect` lists what it uses
- [ ] Decide whether to keep blocking "tonic" in usernames

---

## Ideas (not planned yet)

- Create a new ingredient from inside the recipe form, without leaving it
- Reorder ingredient lines in a recipe (drag and drop)
- Formatting (bold, lists) in the recipe description
- Several photos per recipe
- Make Tonic installable on phones (PWA: home-screen icon, full screen)
- Real phone app with React Native, using the same server
- Daily goals (e.g. 180 g protein) with a progress bar
- Weight chart from the diary's daily weights
- Meal prep batches: weigh the whole cooked pot, then log just the portion you eat
- Copy yesterday's meals into today
- Charts of calories / protein over time
- Free food databases (USDA, Open Food Facts), barcode scanning
- Put the app online (deploy)
- Profile page
