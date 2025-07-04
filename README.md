# 📝 Simply Task

**Simply Task** is a minimal and powerful task management app built using **Next.js**, **ShadCN**, **Tailwind CSS**, and **Appwrite**. It allows users to organize their day with sticky notes and to-dos, while also collaborating with teams in real-time.

---

## 🚀 Features

- 📌 **Sticky Notes**: Create and manage sticky notes with ease.
- ✅ **To-dos**: Add, update, and check off daily tasks.
- 👥 **Team Collaboration**:
  - Create teams
  - Add members
  - Assign to-dos to any team member
- 🎨 Clean and responsive UI using **ShadCN** and **Tailwind CSS**
- 🔐 Secure authentication & backend powered by **Appwrite**

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com), [ShadCN UI](https://ui.shadcn.com)
- **Backend & Auth**: [Appwrite](https://appwrite.io)
- **Icons**: [Lucide Icons](https://lucide.dev)

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/simply-task.git
cd simply-task
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your Appwrite credentials:
```
NEXT_APPWRITE_KEY=""
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```
The app will be running at <a href="http://localhost:3000">http://localhost:3000</a>

---

## 🧱 Folder Structure
```graphql
src/
├── app/                # App Router pages and layouts
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/
│   ├── actions/        # Server actions
│   └── server/         # Appwrite SDK and database config
├── types/              # TypeScript types and interfaces
```
---

## 🤝 Contributing
Contributions are welcome! If you find bugs or have feature suggestions, feel free to open an issue or submit a pull request.