import React from 'react'
import { motion } from 'framer-motion'

interface PageTitleProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  className?: string
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  subtitle,
  icon,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon && (
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PageTitle
