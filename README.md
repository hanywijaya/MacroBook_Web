# MacroBook 🍽️

A simple macro tracking web application for tracking daily calories and macronutrient intake. 
Can be accessed through [this link](https://macro-book-web-gamma.vercel.app).

MacroBook helps users keep track of what they eat, monitor their daily nutrition goals, and eventually understand their calorie deficit and progress over time.

> 🚧 Currently in development

---

## ✨ Features

### Currently Available

- 🔐 User authentication
  - Sign up
  - Log in
  - Log out
- 👤 User profile and nutrition goals
  - Name
  - Age
  - Gender
  - Height
  - Weight
  - Maintenance calories
  - Target carbohydrates
  - Target protein
  - Target fat
- 🍴 Meal tracking
  - Add meals
  - Record calories
  - Record carbohydrates
  - Record protein
  - Record fat
- 📊 Daily nutrition overview
  - Daily calorie intake
  - Daily carbohydrate intake
  - Daily protein intake
  - Daily fat intake
  - Progress toward daily goals

---

## 🚀 Planned Features

MacroBook is still being developed. Planned features include:

- 📜 Meal history
  - View previously logged meals
  - Browse meals by date
- 📈 Nutrition history
  - Track calorie intake over time
  - Track macros over time
  - Daily and weekly summaries
- 🔥 Calorie deficit tracking
  - Compare daily intake against maintenance calories
  - Track calorie deficit over time
  - Visualize progress through charts
- 📊 Progress dashboard
  - Weekly and monthly statistics
  - Macro trends
  - Calorie trends
- ✏️ Edit and delete meals
- 🔎 Search and filter meal history
- 📱 Responsive design improvements

---

## 🛠️ Tech Stack

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

## 🏗️ Architecture

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
