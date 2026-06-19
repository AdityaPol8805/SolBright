import Navigation from './Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { pageTransition } from '@/hooks/useScrollAnimation'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  return (
    <div className="min-h-screen relative">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0">
        <motion.img
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
          alt="Solar panels in a beautiful mountain landscape"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/30 via-blue-900/40 to-black/50" 
          animate={{ 
            opacity: [0.6, 0.7, 0.6]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-16">
        <Navigation />
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname} 
            className="relative"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <motion.footer 
          className="bg-gray-900/90 backdrop-blur-sm text-white py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p>&copy; 2025 Solbright. All rights reserved.</p>
              <p className="text-gray-400 mt-2">
                AI-powered solar advisory platform for smarter energy decisions.
              </p>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default Layout