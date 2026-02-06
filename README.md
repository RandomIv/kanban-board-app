# 📋 Kanban Board App

![CI/CD Status](https://github.com/RandomIv/kanban-board-app/actions/workflows/main.yml/badge.svg)

A full-stack application for managing tasks with a Trello-like interface. The project features a microservices-ready architecture, drag-and-drop physics, containerization, and a fully automated CI/CD deployment pipeline.

🔗 **Live Demo:** [Open App (Vercel)](https://kanban-board-app-tau.vercel.app)

## 🛠 Tech Stack

**Backend:**
- **NestJS** (Modular Architecture)
- **Prisma ORM** (PostgreSQL interaction)
- **Jest** (Unit Testing)
- **SuperTest** (E2E API Testing)

**Frontend:**
- **Next.js 14** (App Router)
- **React Query** (Server state management)
- **Tailwind CSS** (Styling)
- **@dnd-kit** (Drag & Drop core)
- **Jest** (Unit/Component Testing)
- **Playwright** (End-to-End Testing)

**DevOps & Deployment:**
- **Docker & Docker Compose** (Containerization)
- **GitHub Actions** (CI/CD Pipeline)
- **Render** (Backend & Database Hosting)
- **Vercel** (Frontend Hosting)

---

## 🚀 Getting Started

You can run the project in two ways: using **Docker** (recommended) or **Manually**.

### 🐳 Option 1: Docker (Recommended)
*Fastest way to see the app in action. No Node.js or Postgres required locally.*

1. **Clone the repository:**
```bash
git clone https://github.com/RandomIv/kanban-board-app.git
cd kanban-board-app

```

2. **Setup Environment:**
Create `.env` files from examples with one command:

```bash
cp .env.example .env && cp api/.env.example api/.env && cp web/.env.example web/.env

```

3. **Run the application:**

```bash
docker compose up --build

```

4. **Access the App:**

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **API:** [http://localhost:5000](http://localhost:5000)

*Note: Database migrations are applied automatically on container startup.*

---

### 🛠️ Option 2: Manual Setup (Local Development)

Use this if you want to run the app locally but don't want to install PostgreSQL system-wide.

#### 1. Clone & Database

**Clone the repository:**

```bash
git clone https://github.com/RandomIv/kanban-board-app.git
cd kanban-board-app

```

**Setup Environment:**

```bash
cp .env.example .env

```

**Start Database:**
You don't need to install PostgreSQL manually. Just spin up the database container:

```bash
# Starts only the database in the background
docker compose up -d db

```

*The database is now running on `localhost:5432`.*

#### 2. Backend (API)

Navigate to the `api` folder:

```bash
cd api
npm install

```

Setup environment:

```bash
cp .env.example .env
# Ensure DATABASE_URL points to localhost:5432

```

Generate Prisma Client & Run Migrations:

```bash
npx prisma generate
npx prisma migrate dev

```

Start server:

```bash
npm run start:dev

```

#### 3. Frontend (Web)

Open a new terminal and navigate to the `web` folder:

```bash
cd web
npm install

```

Setup environment:

```bash
cp .env.example .env

```

Start the frontend:

```bash
npm run dev

```

---

## ☁️ Deployment & CI/CD

The project is configured for continuous deployment. Every push to the `main` branch triggers the GitHub Actions pipeline.

### Pipeline Steps:

1. **Linting & Testing:** Code quality checks, **Jest** unit tests, and **Playwright** E2E tests run automatically.
2. **Backend Deploy:** Docker container is built and deployed to **Render**.
3. **Frontend Deploy:** Next.js app is deployed to **Vercel**.

### Hosting Architecture:

* **Database:** PostgreSQL Hosted on Render.
* **Backend:** Dockerized NestJS Service (Render).
* **Frontend:** Vercel Edge Network.

---

## 🧪 Running Tests

### Option 1: Inside Docker (Unit Tests)

You can run Unit and Integration tests directly inside the containers.
*(Note: For E2E Frontend tests with Playwright, please use the Local Environment option below due to browser dependencies, but its still works with ci pipeline)*.

```bash
# Backend: Unit Tests
docker exec -it kanban_api npm test

# Backend: E2E Tests
docker exec -it kanban_api npm run test:e2e

# Frontend: Unit Tests
docker exec -it kanban_web npm test

```

### Option 2: Local Environment (Full Suite)

If you are running Playwright for the first time, install the required browsers:

```bash
cd web
npx playwright install --with-deps

```

Then run the tests:

```bash
# Backend
cd api
npm test          # Unit Tests
npm run test:e2e  # E2E Tests (SuperTest)

# Frontend
cd web
npm test          # Unit Tests (Jest)
npx playwright test # E2E Tests

```

---

## 📂 Project Highlights

### ✅ Architecture & Quality

* **Monorepo:** Clean separation of `api` and `web` concerns.
* **Automated QA:** **SuperTest** checks API endpoints, **Playwright** verifies user flows.
* **Type Safety:** End-to-end type safety from Database (Prisma) to Frontend.

### 🖼 Features

* **Kanban Logic:** Create columns, add tasks, move them around.
* **Optimistic UI:** Instant feedback when dragging cards, powered by React Query.


