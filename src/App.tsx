import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import HomePage from './HomePage';
import ServicesPage from './ServicesPage';
import CoursesPage from './CoursesPage';
import ToolsPage from './ToolsPage';
import SupportPage from './SupportPage';
import JobsPage from './JobsPage';
import ReviewsPage from './ReviewsPage';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './pages/ProfilePage';
import QueriesPage from './pages/QueriesPage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import AdminJobsPage from './pages/admin/JobsPage';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Layout component
const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected Routes */}
              <Route
                path="/my-queries"
                element={
                  <ProtectedRoute>
                    <QueriesPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route element={
                <ProtectedRoute requiredRole="admin" redirectTo="/login" />
              }>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<DashboardPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/jobs" element={<AdminJobsPage />} />
                </Route>
              </Route>
              
              {/* Add more protected routes here */}
            </Routes>
          </main>
          <Footer />
          <ChatAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;