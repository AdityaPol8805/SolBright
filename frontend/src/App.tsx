import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'
import { CalculatorProvider } from './contexts/CalculatorContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import EnhancedSolarCalculator from './components/EnhancedSolarCalculator'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import SubsidyInformation from './pages/SubsidyInformation'
import LoginSelection from './pages/auth/LoginSelection'
import Login from './pages/auth/Login'
import Unauthorized from './pages/auth/Unauthorized'
import UserDashboard from './pages/dashboards/UserDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import RetailerDashboard from './pages/dashboards/RetailerDashboard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <CalculatorProvider>
            <Router>
            <Routes>
              {/* Public routes with layout */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              <Route path="/calculator" element={
                <Layout>
                  <EnhancedSolarCalculator />
                </Layout>
              } />
              <Route path="/dashboard" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              <Route path="/about" element={
                <Layout>
                  <About />
                </Layout>
              } />
              <Route path="/contact" element={
                <Layout>
                  <Contact />
                </Layout>
              } />
              <Route path="/subsidy" element={
                <Layout>
                  <SubsidyInformation />
                </Layout>
              } />

              {/* Authentication routes without layout */}
              <Route path="/login" element={<LoginSelection />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected dashboard routes without layout */}
              <Route path="/user/dashboard" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/retailer/dashboard" element={
                <ProtectedRoute allowedRoles={['retailer']}>
                  <RetailerDashboard />
                </ProtectedRoute>
              } />

              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </Router>
          </CalculatorProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
export default App