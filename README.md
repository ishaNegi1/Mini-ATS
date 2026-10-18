# Mini ATS - Applicant Tracking System

A modern, full-stack Mini Applicant Tracking System built with Next.js, MongoDB, and Tailwind CSS. Track candidates through your hiring pipeline with an intuitive dashboard and powerful search/filter capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Features

- **📊 Dashboard** - Real-time metrics with total, active, hired, and rejected candidate counts. Interactive hiring-stage chart and top positions breakdown.
- **👥 Candidate Management** - Full CRUD operations: add, view, edit, and delete candidates.
- **🔄 Hiring Pipeline** - Track candidates through 6 stages: Applied → Screening → Interview → Offer → Hired / Rejected.
- **🔍 Search & Filter** - Search by name/email. Filter by hiring stage and job position.
- **📱 Responsive Design** - Polished UI that works beautifully on desktop, tablet, and mobile.
- **⚡ Loading States** - Skeleton loaders, empty states, success toasts, and error handling throughout.
- **🔒 Validation** - Server-side validation, duplicate email prevention, and comprehensive error handling.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | React framework with server-side rendering |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database |
| [Mongoose 9](https://mongoosejs.com/) | MongoDB ODM |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Recharts](https://recharts.org/) | Charting library |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ishaNegi1/Mini-ATS.git
   cd Mini-ATS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mini-ats?retryWrites=true&w=majority
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 📡 API Endpoints

### Candidates

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/candidates` | List candidates (with search, filter, pagination) |
| `POST` | `/api/candidates` | Create a new candidate |
| `GET` | `/api/candidates/[id]` | Get a single candidate |
| `PUT` | `/api/candidates/[id]` | Update a candidate |
| `DELETE` | `/api/candidates/[id]` | Delete a candidate |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Get dashboard statistics and metrics |

### Query Parameters (GET /api/candidates)

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search by name or email |
| `stage` | string | Filter by hiring stage |
| `position` | string | Filter by job position |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

## 📁 Project Structure

```
mini-ats/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── candidates/
│   │   │   │   ├── route.js          # GET (list) & POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.js      # GET, PUT, DELETE (single)
│   │   │   └── dashboard/
│   │   │       └── route.js          # GET dashboard stats
│   │   ├── candidates/
│   │   │   ├── page.js               # Candidates list page
│   │   │   ├── new/
│   │   │   │   └── page.js           # Add candidate page
│   │   │   └── [id]/
│   │   │       ├── page.js           # View candidate page
│   │   │       └── edit/
│   │   │           └── page.js       # Edit candidate page
│   │   ├── layout.js                 # Root layout with sidebar
│   │   ├── page.js                   # Dashboard page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── Sidebar.js                # Navigation sidebar
│   │   ├── StatCard.js               # Dashboard stat card
│   │   ├── StageBadge.js             # Hiring stage badge
│   │   ├── CandidateForm.js          # Add/Edit candidate form
│   │   ├── CandidateTable.js         # Candidate list table
│   │   ├── SearchFilter.js           # Search & filter bar
│   │   ├── DeleteModal.js            # Delete confirmation modal
│   │   ├── Toast.js                  # Toast notifications
│   │   ├── LoadingSkeleton.js        # Loading skeleton components
│   │   └── EmptyState.js             # Empty state component
│   └── lib/
│       ├── mongodb.js                # MongoDB connection
│       ├── models/
│       │   └── Candidate.js          # Mongoose Candidate model
│       └── constants.js              # Stages, colors, positions
├── .env.local                        # Environment variables
├── .gitignore
├── package.json
├── next.config.mjs
└── README.md
```

## 🚢 Deployment (Vercel)

1. Push code to GitHub.
2. Import the repository on [Vercel](https://vercel.com).
3. Add the `MONGODB_URI` environment variable in Vercel project settings.
4. Deploy!

### Environment Variables for Vercel

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |

