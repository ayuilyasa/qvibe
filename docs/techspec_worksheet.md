# Technical Specification: Worksheets

## 1. Overview
This document outlines the technical implementation for the new "Worksheet" feature, involving database schema updates, new API endpoints/actions, and new frontend components. English terminology and routing will be used for all new elements.

## 2. Database Schema Changes (Drizzle ORM)
We will introduce two new tables in `src/db/schema.ts`:
- `worksheetCategories`
  - `id`: varchar (primary key)
  - `name`: varchar (e.g., 'Mewarnai', 'Agama Islam')
  - `createdAt`: timestamp
- `worksheets`
  - `id`: varchar (primary key)
  - `categoryId`: varchar (foreign key to `worksheetCategories.id`)
  - `title`: varchar (required title for the worksheet)
  - `driveUrl`: text (Google drive URL)
  - `createdAt`: timestamp

## 3. Server Actions (`src/app/actions/worksheet.ts`)
- **Category Actions:**
  - `createWorksheetCategory(name)`: Inserts into `worksheetCategories`.
  - `updateWorksheetCategory(id, newName)`: Updates the name/title.
  - `deleteWorksheetCategory(id)`: Deletes category.
- **Worksheet Actions:**
  - `createWorksheets(categoryId, worksheets: {title: string, driveUrl: string}[])`: Accepts an array of objects containing title and Google Drive URL and a category ID, inserting multiple records into `worksheets`.
  - `getWorksheetCategories()`: Fetches all categories.
  - `getWorksheetsByCategory(categoryId, searchQuery, page, limit)`: Fetches worksheets for a specific category ID with search and pagination (default 30 per page).
  - `getWorksheetsCountByCategory(categoryId, searchQuery)`: Returns the total count of worksheets for pagination.

## 4. Frontend Implementation
### 4.1. Homepage (`src/app/page.tsx`)
- Add a "Worksheet" card component next to existing category links.

### 4.2. Worksheet Category Listing (`src/app/worksheet/page.tsx`)
- Server component that fetches all `worksheetCategories`.
- Displays a grid/list of categories. Clicking one navigates to `/worksheet/[id]`.

### 4.3. Worksheet Listing (`src/app/worksheet/[id]/page.tsx`)
- Server component that fetches worksheets for the given category.
- Renders worksheets in a **2-column grid layout** (on desktop) to match the "materi" video listing style.
- **Search Bar:** Integrated at the top to filter worksheets by title using a `LIKE` query.
- **Pagination:** Bottom navigation for switching pages (30 items per page).
- Each card contains the `title`, a lazy-loaded iframe (loads on click), and a download button.
- **URL Transformation:** Transform standard Drive URLs (`https://drive.google.com/file/d/ID/view`) to embed URLs (`https://drive.google.com/file/d/ID/preview`) before passing to the `<iframe>`.

### 4.4. Admin Management UI (`src/app/add-worksheet/page.tsx` or similar admin route)
- **Category Management:** A UI to create, edit, and delete categories.
- **Worksheet Upload:** A form with a category dropdown. It will use client-side state to manage a dynamic list of inputs (e.g., a "Add another worksheet" button that appends a new set of `Title` and `Drive URL` input fields).

## 5. Security
- Admin routes and actions must be protected by the existing authentication middleware (`src/lib/auth-client.ts` / `src/lib/auth.ts`).