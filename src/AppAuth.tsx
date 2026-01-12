import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SimpleDashboard } from './components/SimpleDashboard';
import { useSession } from './hooks/useSession';
import Auth from './pages/Auth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route 
              path="/auth" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <SimpleDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <SimpleDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;