# TaskHub Frontend

A modern, responsive task management dashboard built with React and Vite.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📁 Folder Structure

```
frontend/
├── public/             # Static assets (favicons, etc.)
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state (AuthContext, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page-level components (Dashboard, Login, etc.)
│   ├── routes/         # Routing configuration
│   ├── utils/          # Helper functions and API configurations
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env                # Environment variables (private)
└── vite.config.js      # Vite configuration
```

## 🛠️ Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

## 🏃 Running the Application

### Development Mode

Runs the app in development mode with Hot Module Replacement (HMR).

```bash
npm run dev
```

### Production Build

Builds the app for production to the `dist` folder.

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔗 API Integration

The frontend communicates with the backend via Axios. Configuration for the base URL can be found in `src/utils/`.

- **API Base URL**: Configured via the `VITE_BACKEND_URL` environment variable.

## ⚙️ Environment Variables

Create a `.env` file in the root of the `frontend/` directory based on `.env.example`.

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Base URL for the backend API |
| `VITE_APP_NAME` | Name of the application |
| `VITE_ENV` | Current environment (development/production) |

## 📦 Deployment Notes

- This project is optimized for deployment on platforms like **Vercel**, **Netlify**, or **Hostinger**.
- Ensure `VITE_BACKEND_URL` is set to your production API URL in your deployment platform's environment settings.
