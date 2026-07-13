import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import LogExperience from './pages/LogExperience';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/AdminPanel';
import Landing from './pages/Landing';
import { TransitionProvider, TransitionSync } from './components/transition/TransitionProvider';
import CustomCursor from './components/cursor/CustomCursor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <TransitionProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/log-experience" element={<LogExperience />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gradient-hero flex items-center justify-center text-center">
                  <div>
                    <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
                    <p className="text-surface-400 mb-6">Page not found</p>
                    <a href="/dashboard" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                      ← Back to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
          <CustomCursor />
          <TransitionSync />
        </TransitionProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
