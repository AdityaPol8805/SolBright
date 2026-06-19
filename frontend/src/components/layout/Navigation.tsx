import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sun, Calculator, BarChart3, Info, Mail, Menu, X, LogIn, LogOut, User, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { navAnimation } from '@/hooks/useScrollAnimation'

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  const navItems = [
    { path: '/', label: 'Home', icon: Sun },
    { path: '/about', label: 'About', icon: Info },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/subsidy', label: 'Subsidy Info', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/contact', label: 'Contact', icon: Mail },
  ]

  const getDashboardPath = () => {
    if (!user) return '/dashboard'
    switch (user.role) {
      case 'admin': return '/admin/dashboard'
      case 'retailer': return '/retailer/dashboard'
      case 'user': return '/user/dashboard'
      default: return '/dashboard'
    }
  }

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20" 
          : "bg-transparent"
      } transition-all duration-300`}
      initial="hidden"
      animate="visible"
      variants={navAnimation}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                animate={{
                  rotate: scrolled ? [0, 360] : 0,
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <Sun className="h-8 w-8 text-yellow-500" />
              </motion.div>
              <motion.span 
                className={`text-xl font-bold ${scrolled ? "text-gray-900" : "text-white"}`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                Solbright
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              const itemPath = item.label === 'Dashboard' ? getDashboardPath() : item.path
              return (
                <Link key={item.path} to={itemPath}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                const itemPath = item.label === 'Dashboard' ? getDashboardPath() : item.path
                return (
                  <Link key={item.path} to={itemPath}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <User className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </div>
                      </div>
                    </div>
                    <Button onClick={logout} variant="outline" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navigation