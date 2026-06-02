import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';
import DiffPage from './pages/DiffPage';
import AuthGuard from './components/AuthGuard';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <AuthGuard>
                <EditorPage />
              </AuthGuard>
            }
          />
          <Route
            path="/editor/:id/diff/:v1/:v2"
            element={
              <AuthGuard>
                <DiffPage />
              </AuthGuard>
            }
          />

          {/* Default redirect for root */}
          <Route path="/" element={<Navigate to="/blog" replace />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/blog" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
