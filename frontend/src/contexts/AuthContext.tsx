import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'user' | 'admin' | 'retailer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers = {
  user: [
    { id: '1', email: 'user@solbright.com', password: 'user123', name: 'John Doe', role: 'user' as UserRole },
    { id: '2', email: 'customer@example.com', password: 'customer123', name: 'Jane Smith', role: 'user' as UserRole }
  ],
  admin: [
    { id: '3', email: 'admin@solbright.com', password: 'admin123', name: 'Admin User', role: 'admin' as UserRole },
    { id: '4', email: 'super@solbright.com', password: 'super123', name: 'Super Admin', role: 'admin' as UserRole }
  ],
  retailer: [
    { id: '5', email: 'retailer@solbright.com', password: 'retailer123', name: 'Solar Retailer', role: 'retailer' as UserRole },
    { id: '6', email: 'partner@example.com', password: 'partner123', name: 'Partner Store', role: 'retailer' as UserRole }
  ]
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('solbright_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('solbright_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      const roleUsers = mockUsers[role]
      const foundUser = roleUsers.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role
        }
        
        setUser(userSession)
        localStorage.setItem('solbright_user', JSON.stringify(userSession))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('solbright_user')
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
