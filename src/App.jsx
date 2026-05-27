import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Wait, let's make sure it imports the correct path. Path is context/AuthContext.
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchListings from './pages/SearchListings';
import ProfileDetails from './pages/ProfileDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Protected Route for authenticated users
function ProtectedRoute({ children }) {
  const { currentUserRole } = useAuth();
  if (!currentUserRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Protected Route for photographers
function PhotographerRoute({ children }) {
  const { currentUserRole } = useAuth();
  if (!currentUserRole) {
    return <Navigate to="/login" replace />;
  }
  if (currentUserRole !== 'photographer') {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Layout wrapper for pages displaying Navbar and Footer
function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Customer/Photographer Routes inside MainLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <MainLayout>
                <SearchListings />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileDetails />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Protected Photographer Dashboard */}
          <Route path="/dashboard" element={
            <PhotographerRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PhotographerRoute>
          } />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
