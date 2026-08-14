# MacroBook Web

A simple macro tracking web application for tracking daily calories and macronutrient intake. 

MacroBook helps users keep track of what they eat, monitor their daily nutrition goals, and eventually understand their calorie deficit and progress over time.

> 🚧 Currently in development

---

## Features

### Currently Available

- **User authentication**
  - Sign up
  - Log in
  - Log out
    
- **User profile and nutrition goals**
  - Name
  - Age
  - Gender
  - Height
  - Weight
  - Maintenance calories
  - Target carbohydrates
  - Target protein
  - Target fat
    
- **Meal tracking**
  - Add meals
  - Record calories
  - Record carbohydrates
  - Record protein
  - Record fat
    
- **Daily nutrition overview**
  - Daily calorie intake
  - Daily carbohydrate intake
  - Daily protein intake
  - Daily fat intake
  - Progress toward daily goals

---

## Planned Features

MacroBook is still being developed. Planned features include:

- **Meal history**
  - View previously logged meals
  - Browse meals by date
- **Nutrition history**
  - Track calorie intake over time
  - Track macros over time
  - Daily and weekly summaries
- **Calorie deficit tracking**
  - Compare daily intake against maintenance calories
  - Track calorie deficit over time
  - Visualize progress through charts
- **Progress dashboard**
  - Weekly and monthly statistics
  - Macro trends
  - Calorie trends
- **Edit and delete meals**
- **Search and filter meal history**
- **Responsive design improvements**

---

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

### Authentication & Database

- Supabase Authentication
- Supabase PostgreSQL

---

## Architecture

MacroBook uses a separate frontend and backend architecture.

```text
┌─────────────────────┐
│      React App      │
│      Frontend       │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│       FastAPI       │
│       Backend       │
└──────────┬──────────┘
           │
           │ SQLAlchemy
           ▼
┌─────────────────────┐
│   Supabase /         │
│   PostgreSQL         │
└─────────────────────┘

```



## Running Locally

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- Python 3.10+
- Git
- A Supabase project

### 1. Clone the Repository

```bash
git clone https://github.com/hanywijaya/MacroBook_Web.git
cd MacroBook_Web
```

### 2. Set Up the Backend

Open a terminal in the project root and run:

```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
```

Open `backend/.env` and fill in the required environment variables using your own Supabase credentials.

Then start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Set Up the Frontend

Open a **new terminal** in the project root:

```bash
cd frontend

npm install

cp .env.example .env
```

Open `frontend/.env` and configure the required environment variables.

Then start the React development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

### 4. Run the Application

You should have **two terminals** running:

**Terminal 1 — Backend**

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Open the frontend URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Environment Variables

Both the frontend and backend provide an `.env.example` file containing the required environment variables.

Copy each `.env.example` file to `.env` and fill in your own credentials:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

> **Note:** Do not commit `.env` files or expose your Supabase credentials. The `.env` files are intended for local development only.
