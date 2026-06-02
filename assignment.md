CMS Take-Home Test
Full Stack · 2 Days · 5–6 hrs/day · Node/Express, PostgreSQL, Sequelize, React + TypeScript
This is a deliberately small build. We care about depth, not breadth — three features done well beats ten done thinly. Submit a GitHub repo with /backend and /frontend, a working README, a seed script, and a DECISIONS.md.
Foundation
•	Authors can register and log in. Authenticated requests carry a JWT.
•	Posts have a title, slug, rich-text content (stored as JSON), excerpt, status (draft / published), and belong to an author.
•	Unauthenticated callers can only read published posts. Authors can read and edit their own drafts.
•	All models are defined with Sequelize and the schema is managed through migrations.
1 · Versioning
•	Every time a post is saved, an immutable version is recorded — a full snapshot of the title and content at that moment, with the author and timestamp.
•	Editing a post never overwrites history. The current state of a post is simply its latest version.
•	The API can list all versions of a post and return any single version in full.
2 · Diff
•	An author can pick any two versions of a post and see a rendered visual diff of the rich-text content — clearly showing inserted, removed, and unchanged passages.
•	The diff operates on the editor's JSON, not on a naive string compare, so formatting-only changes and text changes are both handled sensibly.
•	Where you compute the diff (backend or frontend) is your call — justify it in DECISIONS.md.
3 · Search
•	A public search endpoint performs full-text search over the title and plain text of published posts, ranked by relevance (PostgreSQL full-text search is encouraged).
•	Results include enough information to highlight the matched terms in the UI.
•	A public /blog page exposes a search bar that queries this endpoint and renders ranked, highlighted results. Clicking a result opens /blog/:slug.
Frontend
•	An author logs in and lands on a dashboard listing their posts, where they can create, edit, publish, and unpublish them.
•	The post editor uses a rich text editor of your choice. Content is saved as JSON and correctly restored when reopening a post.
•	A version history panel lists every version of a post; opening one shows it read-only, and selecting two of them drives the diff view above.
Seed Data
•	The database is seeded with two authors and five posts — a mix of drafts and published — so the access rules are exercised. At least one published post must have three or more versions so the history and diff views have something real to show.
Deployment
•	The full stack — frontend, backend API, and PostgreSQL database — is deployed to a publicly reachable URL. The host and platform are your choice.
•	The seed runs against the deployed database so the live site is populated and the author credentials in the README actually work.
•	The README documents the live URL, the seeded login credentials, and how to run the whole stack locally.
DECISIONS.md
•	Which rich text editor did you choose and why?
•	Why store editor output as JSON rather than HTML?
•	How do you store versions — full snapshots or deltas — and what's the tradeoff?
•	How do you diff the rich-text JSON, and where does that computation run?
•	Where did you deploy, and what was the trickiest part of getting all three pieces live?
•	One thing you would do differently with more time.
Bonus
•	Restore: an author can roll a post back to an earlier version. Restoring creates a new version rather than erasing the ones in between.
