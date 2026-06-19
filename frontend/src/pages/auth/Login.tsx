import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth, UserRole } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Shield, Store, Sun, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const Login = () => {
  const { role } = useParams<{ role: UserRole }>()
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const roleConfig = {
    user: {
      title: 'Customer Login',
      subtitle: 'Access your solar dashboard and energy insights',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      redirectPath: '/user/dashboard'
    },
    admin: {
      title: 'Maintenance Login',
      subtitle: 'Manage platform operations and analytics',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      redirectPath: '/admin/dashboard'
    },
    retailer: {
      title: 'Retailer Login',
      subtitle: 'Manage products and customer relationships',
      icon: Store,
      color: 'from-green-500 to-green-600',
      redirectPath: '/retailer/dashboard'
    }
  }

  const currentRole = role as UserRole
  const config = roleConfig[currentRole]
  const Icon = config?.icon || User

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors as user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setErrors({})
    
    try {
      const success = await login(formData.email, formData.password, currentRole)
      
      if (success) {
        toast.success(`Welcome back! Logged in as ${currentRole}`)
        navigate(config.redirectPath)
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' })
        toast.error('Login failed. Please check your credentials.')
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
      toast.error('An unexpected error occurred')
    }
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Invalid Role</CardTitle>
            <CardDescription className="text-gray-300">
              The specified role is not valid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full">Back to Login Selection</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Sun className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Solbright</h1>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center pb-4">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">
              {config.title}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {config.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">{errors.general}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white border-0 h-11`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                ← Back to role selection
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-4 bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-medium text-gray-300 mb-2">Demo Credentials</h4>
              <div className="text-sm text-gray-400">
                <p>Email: {currentRole}@solbright.com</p>
                <p>Password: {currentRole}123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login