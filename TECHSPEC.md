# Technical Specification - Q-Vibe

## 1. Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** 
  - SQLite (Local Development)
  - Turso (Production/Edge)
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth
- **Linting:** ESLint

## 2. Data Model (Drizzle Schema)

### Users Table
- `id`: text (Primary Key)
- `username`: text (Unique)
- `password_hash`: text
- `createdAt`: integer (Timestamp)

### Posts Table
- `id`: text (Primary Key)
- `userId`: text (Foreign Key -> Users.id)
- `youtubeUrl`: text
- `category`: text (Enum: Tajwid, Surat Pendek, Doa-doa harian, etc.)
- `createdAt`: integer (Timestamp)

## 3. Architecture
- **Server Components:** Used for data fetching and layout rendering.
- **Server Actions:** Used for handling form submissions (Auth, **Tambah Postingan**).
- **Context/State:** Standard React state for UI interactions; Better Auth for session management.

## 4. Implementation Plan

### Phase 1: Frontend (Dummy Data)
- Setup Next.js project with Tailwind and shadcn/ui.
- Implement Home Page with Category cards (Labels: **Tajwid**, **Surat Pendek**, etc.).
- Implement Category listing page with dummy embedded YouTube players.
- Implement Login (**Masuk**) and Register (**Daftar**) UI pages.
- Implement "**Tambah Postingan**" modal/page UI.

### Phase 2: Database & Auth Integration
- Configure Drizzle ORM with SQLite/Turso.
- Setup Better Auth for username/password strategy.
- Replace dummy data with real database queries using Drizzle.
- Implement Server Actions for creating posts and user registration.
- Deploy to Turso for production database.

## 5. Security & Standards
- Use `strict: true` in `tsconfig.json`.
- Environment variables for Turso credentials and Auth secrets.
- Input validation using Zod for all form submissions (Indonesian error messages).
