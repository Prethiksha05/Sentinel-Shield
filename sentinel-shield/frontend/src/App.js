import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Context
import { AuthProvider, useAuth } from './auth/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MediaAnalysis from './pages/MediaAnalysis';
import Incidents from './pages/Incidents';
import AdminPanel from './pages/AdminPanel';
import Results from './pages/Results';

// Components
import Sidebar from './components/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="login-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // If no user AND no token, redirect to login
    if (!user && !token) {
        return <Navigate to="/login" replace />;
    }

    // If we have a token but no user yet, show loading (user is being fetched)
    if (token && !user) {
        return (
            <div className="login-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Layout with Sidebar
const AppLayout = ({ children }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/analysis" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <MediaAnalysis />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/results" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Results />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/incidents" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Incidents />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AppLayout>
                                    <AdminPanel />
                                </AppLayout>
                            </AdminRoute>
                        </ProtectedRoute>
                    } />

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>

            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </AuthProvider>
    );
}

export default App;
