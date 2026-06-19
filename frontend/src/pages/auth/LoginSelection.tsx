import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Shield, Store, Sun } from 'lucide-react'

const LoginSelection = () => {
  const loginTypes = [
    {
      type: 'user',
      title: 'Customer Login',
      description: 'Access your solar dashboard and track your energy savings',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      path: '/login/user'
    },
    {
      type: 'admin',
      title: 'Maintenance Login',
      description: 'Manage the platform, users, and system analytics',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      path: '/login/admin'
    },
    {
      type: 'retailer',
      title: 'Retailer Login',
      description: 'Manage your solar products and customer relationships',
      icon: Store,
      color: 'from-green-500 to-green-600',
      path: '/login/retailer'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Sun className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Solbright</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose your role to access your personalized solar management dashboard
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {loginTypes.map((loginType) => {
            const Icon = loginType.icon
            return (
              <Card key={loginType.type} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${loginType.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    {loginType.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {loginType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={loginType.path}>
                    <Button className={`w-full bg-gradient-to-r ${loginType.color} hover:opacity-90 text-white border-0`}>
                      Login as {loginType.type.charAt(0).toUpperCase() + loginType.type.slice(1)}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Demo Credentials */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-center">Demo Credentials</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Use these credentials to test the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <h4 className="font-semibold text-blue-400 mb-2">Customer</h4>
                <p className="text-gray-300">Email: user@solbright.com</p>
                <p className="text-gray-300">Password: user123</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-purple-400 mb-2">Maintenance</h4>
                <p className="text-gray-300">Email: admin@solbright.com</p>
                <p className="text-gray-300">Password: admin123</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-green-400 mb-2">Retailer</h4>
                <p className="text-gray-300">Email: retailer@solbright.com</p>
                <p className="text-gray-300">Password: retailer123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginSelection