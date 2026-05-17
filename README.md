# Sajith's Portfolio Website

A modern, GitHub-themed personal portfolio built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Admin Panel**: Login-protected dashboard to edit all content without code changes
- **Responsive Design**: Works seamlessly on all screen sizes
- **Smooth Animations**: Built with Framer Motion for delightful interactions
- **GitHub-Themed**: Custom design inspired by GitHub's dark mode
- **RESTful API**: Complete backend API for content management

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS + Custom CSS Variables
- Framer Motion (animations)
- Lucide React (icons)
- React Router v6
- Axios

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (password hashing)

## Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Git

### Installation

1. **Clone and navigate to the project**

   ```bash
   cd sajith-portfolio
   ```

2. **Setup Server**

   ```bash
   cd server
   npm install
   ```

   Update `.env` with your MongoDB URI and JWT secret

3. **Setup Client**

   ```bash
   cd ../client
   npm create vite@latest . -- --template react
   npm install
   npm install tailwindcss @tailwindcss/vite framer-motion axios lucide-react react-router-dom
   npx tailwindcss init
   ```

4. **Seed the database** (from server folder)

   ```bash
   npm run seed
   ```

5. **Run the project** (from root)
   ```bash
   npm install -D concurrently
   npm run dev
   ```

The app will be available at `http://localhost:5173` (frontend) and API at `http://localhost:5000`

## Project Structure

```
sajith-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API integration
│   │   ├── context/       # React context (Auth)
│   │   └── styles/        # Global styles
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── package.json
│
└── README.md
```

## Environment Variables

### Server (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Client (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render

See instructions.md for detailed deployment steps.

## License

MIT - Created by Mohamed Sajith Nuski
