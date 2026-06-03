# DECISIONS.md

## 1. Which rich text editor did you choose and why?
I chose **Tiptap** (based on ProseMirror) as the rich text editor. It is headless, meaning I have full control over the UI while leveraging a robust editing engine. It handles JSON serialization natively, which is crucial for the versioning and diffing requirements. 

## 2. Why store editor output as JSON rather than HTML?
Editor output is stored as **Tiptap's JSON doc format** rather than HTML. JSON provides a structured, semantic representation of the content making it possible to compute meaningful diffs without parsing raw HTML strings, manipulate the document structure programmatically, and render content consistently across contexts. (Can display in better way)  
HTML conflates content and presentation, which makes it a poor format for anything beyond display.

## 3. How do you store versions — full snapshots or deltas — and what's the tradeoff?
Every save creates a **full snapshot** of the post's title, content, and metadata in the `post_versions` table.  
The tradeoff is higher storage usage compared to deltas, but for text documents this cost is negligible.  
The benefit is significant: retrieving any version is a simple O(1) query with no reconstruction logic, and restoring a version is just copying a row (really faster).

## 4. How do you diff the rich-text JSON, and where does that computation run?
The diff runs on the **backend**. Both version snapshots are fetched from the database, plain text is extracted by walking the Tiptap JSON node tree, and a word-level diff is computed using the `diff` package.  
The frontend receives a flat array of `{ type: 'insert' | 'delete' | 'equal', text: string }` segments and renders them as colored spans. This keeps the frontend stateless and the diff logic independently testable (really simple for frontend to render diff instead whole thing).

## 5. Where did you deploy, and what was the trickiest part of getting all three pieces live?
The database is on **Supabase** (managed PostgreSQL),  
the backend on **Railway** (Node.js), and  
the frontend on **Vercel** (Vite/React).  
The trickiest part was to connect supabase with render backend (backend was calling to direct IPv6 DB endpoint changed that to Supabase Transaction Pooler IPv4).

## 6. One thing you would do differently with more time.
1.Frontend can be made more better (UX and UI rendering)  
2.I would improve the diff engine to preserve rich-text structure and formatting changes directly from the editor JSON instead of comparing flattened text content.