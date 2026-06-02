# Architectural Decisions

## 1. Rich Text Editor: Tiptap
I chose **Tiptap** (based on ProseMirror) as the rich text editor.
- **Why?** It is headless, meaning I have full control over the UI while leveraging a robust editing engine. It handles JSON serialization natively, which is crucial for our versioning and diffing requirements.

## 2. Content Storage: JSON vs HTML
Editor output is stored as **JSON (Tiptap's Doc format)** rather than HTML.
- **Why?** JSON provides a structured, semantic representation of the content. This makes it easier to:
  - Compute meaningful diffs without parsing raw HTML strings.
  - Render the same content across different platforms (web, mobile, etc.) if needed.
  - Sanitize and manipulate the document structure programmatically.

## 3. Versioning Strategy: Full Snapshots
Every save creates a **full snapshot** of the post's title, content, and metadata in the `post_versions` table.
- **Why?** 
  - **Simplicity**: No complex logic is needed to reconstruct a version from deltas.
  - **Performance**: Retrieving any version is a simple O(1) database query.
  - **Tradeoff**: It uses more storage space than deltas, but given the relatively small size of text documents, the simplicity and speed outweigh the storage costs.

## 4. Diffing Logic: Backend Computation
The diffing logic runs on the **Backend**.
- **Why?** 
  - **Centralized Logic**: The backend can handle the extraction of plain text from JSON and the diffing algorithm in a consistent way.
  - **Payload Efficiency**: The frontend only receives the computed diff segments rather than two full document snapshots.
  - **Complexity**: It keeps the frontend lightweight and focused on rendering.

## 5. Search: PostgreSQL Full-Text Search
I used PostgreSQL's native **Full-Text Search (FTS)** capabilities.
- **Why?** 
  - **Native & Scalable**: No need for external services like Elasticsearch for a project of this scale.
  - **Features**: It supports ranking (`ts_rank`), highlighting (`ts_headline`), and efficient indexing (`GIN` indexes on `tsvector`).
  - **Consistency**: Keeping search within the primary database ensures data consistency and simplifies the stack.

## 6. Deployment: Supabase (PostgreSQL) + Vercel/Render
- **Database**: Supabase was chosen for its managed PostgreSQL with built-in FTS support.
- **Backend**: Deployed to Render/Railway (standard Node.js environments).
- **Frontend**: Deployed to Vercel (optimized for Vite/React apps).
- **Trickiest Part**: Coordinating the database migrations and environment variables across three different platforms to ensure the JWT authentication and search worked seamlessly in production.

## 7. Future Improvements
If I had more time, I would:
- Implement **Deltas (OT/CRDT)** for more efficient storage and real-time collaboration.
- Add **image upload** support with a dedicated storage provider (like AWS S3 or Supabase Storage).
- Improve the **diff visualization** to handle structural changes (like table edits) more elegantly.

## 8. Slug Generation and Uniqueness
The current slug generation ensures uniqueness by relying on the `UNIQUE` constraint in the database. In cases where the same title might exist, a simple helper function would be implemented to append a numerical suffix (e.g., `my-post`, `my-post-2`, `my-post-3`) to ensure uniqueness. This approach is robust and user-friendly.
