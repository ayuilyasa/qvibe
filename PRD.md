# Product Requirements Document (PRD) - Q-Vibe (Quranic-Video, Interaktif, Belajar, Efektif)

## 1. Project Overview
Q-Vibe is a video-sharing platform focused on Islamic educational content for elementary students. It allows teachers (admins) to share and curate YouTube videos while students can discover them in a safe environment.

## 2. Target Audience
- **Students (Kids):** Primary users who discover and watch curated educational content.
- **Teachers/Admins:** Responsible for curating content and managing student accounts.

## 3. Features
### 3.1 User Authentication & Management
- **Admin Managed Registration:** Students do not register themselves. Only an Admin can access the **Daftar Siswa** (Register) page to create student accounts.
- **Login:** Users authenticate (Label: **Masuk**) using a **username** and **password**. No email is required from the user's perspective.
- **Admin Role:** Special role with the ability to register new users and curate all content.

### 3.2 Content Discovery (Home Page)
- Display a grid or list of the following categories (strictly in Bahasa Indonesia):
    - **Materi Alquran dan Ilmu tajwid**
    - **Surat Pendek**
    - **Doa-doa harian**
    - **Surat Pilihan**
    - **Hadis harian**
    - **Materi fiqih**
    - **Aqidah akhlak**
    - **Materi tarikh**
- Clicking a category navigates the user to a filtered view of posts.

### 3.3 Post Management
- **Create Post:** Only **Admins (Teachers)** can submit a YouTube link (Button Label: **Unggah Video** or **Tambah Postingan**). This button is hidden for Students and Guests.
- **Delete Post:** Only **Admins (Teachers)** can delete posts (Button Label: **Hapus Postingan** icon). This button is hidden for Students and Guests.
- **Category Selection:** Admins select from the Indonesian categories listed above during posting.
- **Embedded Playback:** YouTube videos are embedded directly on the site for Students to watch.

## 4. User Flow
1. **Unauthenticated User:**
   - Lands on Home Page -> Sees Categories.
   - Clicks Category -> Sees list of embedded YouTube videos.
   - Cannot post, delete, or access registration.
2. **Student User:**
   - Same as above, but with their name displayed in the navigation.
   - Cannot post or delete.
3. **Admin User (Teacher):**
   - Same as Student, plus:
   - Access to "**Daftar Siswa**" to create new student accounts.
   - Access to "**Tambah Postingan**" on category pages.
   - Access to the **Delete** icon on all posts to manage content.

## 5. Roadmap
- **Phase 1:** Frontend Development with dummy data. - **COMPLETE**
- **Phase 2:** Backend integration, Authentication, and Database. - **COMPLETE**
- **Phase 3:** Admin-only Registration for Student Management. - **COMPLETE**
