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

## 2. Ingredients

**Story 2.1:** As a user, I want to create my own ingredients with their macros, using whatever amount is on the label, so I never have to look them up again.

Done when:
- [ ] I can create an ingredient: name, serving, calories, protein, carbs, fat
- [ ] The serving has at least one `{ amount, unit }`, e.g. `1 scoop`
- [ ] I can add more units for the same serving ("+ add unit"), e.g. `1 scoop` = `30 g` = `2 tbsp`
- [ ] Units are typed by me (scoop, g, ml, cup, slice...) and can't repeat within one ingredient
- [ ] Only calories are required; protein, carbs and fat are optional (so beginners can start with just calories)
- [ ] A blank optional macro counts as 0 in totals
- [ ] Amounts must be more than 0; macros can't be negative

**Story 2.2:** As a user, I want to add an extra unit to an ingredient later (e.g. I bought a scale and now know a scoop is 30 g), so I'm not stuck with the first unit I picked.

Done when:
- [ ] Editing an ingredient lets me add or remove units
- [ ] I can't remove a unit that a recipe still uses (or I get a clear warning)

**Story 2.3:** As a user, I want to choose what happens to my recipes when I delete an ingredient they use.

Done when:
- [ ] If no recipe uses it: a simple "Delete Whey?" confirm
- [ ] If recipes use it, I'm asked: "Whey is used in 2 recipes (Shake, Pancakes)." **[Delete from recipes too] [Keep it in recipes] [Cancel]**
- [ ] "Delete from recipes too" removes it everywhere (those recipes' totals change)
- [ ] "Keep it in recipes" hides it from my ingredient list, but recipes still show it and count its macros; it just can't be opened or edited
- [ ] "Keep" is done with a **soft delete** (`deleted: true`), not a real delete
- [ ] I can see a list of my ingredients
- [ ] I can edit and delete my ingredients

Tasks:
- [ ] Server: `ingredients` collection (replaces the old cocktail ingredients collection)
- [ ] Server: create / list / edit / delete routes, with validation
- [ ] Client: "My ingredients" page
- [ ] Client: create / edit ingredient form
- [ ] Remove the old ingredient routes and `batchimport.js`

---

## 3. Recipes built from ingredients

**Story 3.1:** As a user, I want to build a recipe from my saved ingredients and amounts, so I can see its total calories and protein.

Done when:
- [ ] A recipe has: name, optional description, optional image, list of `{ ingredient, amount, unit }`, optional steps
- [ ] When adding an ingredient, I pick from that ingredient's units (e.g. scoops **or** grams)
- [ ] Recipe page shows totals (calories, protein, carbs, fat)
- [ ] Totals are calculated from the ingredients, not saved by hand

**Story 3.2:** As a user, I want to change amounts on a recipe page ("150 g potatoes today instead of 85 g") and see the new totals instantly, without editing the saved recipe.

Done when:
- [ ] Each ingredient amount (and unit) on the recipe page can be changed
- [ ] Totals update as I type
- [ ] A "reset" button goes back to the saved amounts

**Story 3.3:** As a user, I want recipes for food and drinks alike, so a protein shake works the same way as a meal.

**Story 3.4:** As a meal prepper, I want to say a recipe makes several portions (e.g. 6 burritos), so I can see and log the macros for one portion.

Done when:
- [ ] By default a recipe shows totals for the whole thing
- [ ] Optionally I can set a portion count and a portion name (e.g. `6` × `burrito`)
- [ ] Then the recipe page also shows macros per portion (total ÷ 6)
- [ ] In the diary I can log portions (e.g. "2 burritos")

Tasks:
- [ ] Remove the official badge (`isOfficial`, `OfficialBadge.js`)
- [ ] Replace the drink shape with the recipe shape (server)
- [ ] Rename drinks → recipes on the server (collection, routes, handler files)
- [ ] Rename drinks → recipes on the client (pages, components, text, URLs)
- [ ] Recipe form: pick ingredients from my list + enter amounts
- [ ] A shared function that calculates macros (used by recipes and the diary)
- [ ] Decide what happens to a recipe when one of its ingredients is deleted
- [ ] Remove likes for now (`likedDrinks`, like/unlike routes, Liked page); social comes back in Feature 6

---

## 4. Real login (security)

Needed before the diary, because a diary is private.

**Story:** As a user, I want only me to be able to see my diary and change my ingredients and recipes.

Done when:
- [ ] The server no longer trusts a user ID sent by the browser
- [ ] Creating, editing and deleting require a valid login
- [ ] Trying to change someone else's things is refused

Tasks:
- [ ] Give the user a login token (JWT) on login and signup
- [ ] Send the token with requests that need a login
- [ ] Server middleware that checks the token and finds the user
- [ ] Use the token's user instead of `authorId` from the request body
- [ ] Handle expired tokens (log the user out with a message)

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
- [ ] Declare `cleanEmail` with `const` in `logIn.js`
- [ ] Check that every `useEffect` lists what it uses
- [ ] Decide whether to keep blocking "tonic" in usernames

---

## Ideas (not planned yet)

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
