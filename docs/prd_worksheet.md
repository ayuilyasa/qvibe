# Product Requirements Document (PRD): Worksheets

## 1. Overview
The "Worksheet" feature introduces a new section to the application designed to provide users with access to educational materials, specifically PDF worksheets hosted on Google Drive. 

## 2. Goals
- Provide a dedicated space for users to discover and download worksheets.
- Allow administrators to easily categorize and manage worksheet links.
- Streamline the addition of multiple worksheet links at once using a dynamic form.

## 3. User Stories
- **As a User**, I want to see a "Worksheet" card on the homepage so I can easily access the section.
- **As a User**, I want to browse worksheet categories (e.g., Mewarnai, Agama Islam, Matematika) to find specific types of content.
- **As a User**, I want to view an embedded Google Drive PDF along with its title, and have the option to download it.
- **As an Admin**, I want to add new worksheet categories and edit or delete existing ones.
- **As an Admin**, I want to upload new worksheets by providing a Title and pasting Google Drive PDF links, then assigning them to a category.
- **As an Admin**, I want to add multiple worksheets at once using a dynamic form to add more input fields, saving time.

## 4. Feature Scope & Requirements
### 4.1. Homepage Integration
- A new card titled "Worksheet" will be added to the front page alongside the existing categories.

### 4.2. Category Management (Admin)
- Admins can create new worksheet categories.
- Admins can edit the name and title of existing categories.
- Admins can delete categories.

### 4.3. Worksheet Management (Admin)
- Admins can add new worksheets. Each worksheet requires a **Title** and a **Google Drive PDF link**.
- Admins must assign a category to the uploaded worksheets.
- Bulk upload capability: The admin interface will feature a dynamic form allowing admins to add multiple (Title, URL) pairs before submitting.

### 4.4. User Flow
1. **Homepage:** User clicks the "Worksheet" card.
2. **Category Page:** User is presented with a list of available worksheet categories.
3. **Worksheet List Page:** Upon selecting a category, the user sees a list of available worksheets within that category, identified by their titles.
4. **Worksheet View Page:** Clicking a specific worksheet displays an embedded view of the Google Drive PDF along with a prominent download button.

## 5. Non-Goals / Out of Scope
- Handling Google Drive permission edge cases (e.g., automatically requesting access or verifying public visibility) is currently out of scope and deferred to future iterations.