import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Package, TrendingUp, Users, ShoppingCart, DollarSign, Star, Eye } from 'lucide-react'

const RetailerDashboard = () => {
  const { user, logout } = useAuth()

  const businessStats = [
    {
      title: 'Monthly Sales',
      value: '₹24,580',
      change: '+18%',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Products Sold',
      value: '127',
      change: '+12%',
      icon: Package,
      color: 'text-blue-500'
    },
    {
      title: 'Customer Inquiries',
      value: '89',
      change: '+25%',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Average Rating',
      value: '4.8/5',
      change: '+0.2',
      icon: Star,
      color: 'text-yellow-500'
    }
  ]

  const topProducts = [
    { name: 'SolarMax 400W Panel', sales: 45, revenue: '₹13,500', rating: '4.9' },
    { name: 'PowerInverter Pro 5kW', sales: 32, revenue: '₹9,600', rating: '4.7' },
    { name: 'BatteryPack Lithium 100Ah', sales: 28, revenue: '₹8,400', rating: '4.8' },
    { name: 'SmartMonitor System', sales: 22, revenue: '₹4,400', rating: '4.6' }
  ]

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', product: 'SolarMax 400W Panel', amount: '₹300', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Sarah Johnson', product: 'PowerInverter Pro', amount: '₹450', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Wilson', product: 'BatteryPack Lithium', amount: '₹320', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Lisa Brown', product: 'SmartMonitor System', amount: '₹200', status: 'Pending' }
  ]

  const quickActions = [
    { title: 'Add New Product', description: 'List a new solar product', icon: Package },
    { title: 'View Orders', description: 'Manage customer orders', icon: ShoppingCart },
    { title: 'Customer Support', description: 'Handle customer inquiries', icon: Users },
    { title: 'Analytics Report', description: 'View detailed sales analytics', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Retailer Dashboard</h1>
                <p className="text-gray-600">Solar Business Management - {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {businessStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Selling Products
              </CardTitle>
              <CardDescription>
                Your best performing solar products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{product.sales} sold</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{product.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Latest customer orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{order.amount}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Performance
            </CardTitle>
            <CardDescription>
              Monthly sales trends for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: 'May', sales: 18500, growth: 8 },
                { month: 'Jun', sales: 22300, growth: 15 },
                { month: 'Jul', sales: 19800, growth: -5 },
                { month: 'Aug', sales: 26100, growth: 12 },
                { month: 'Sep', sales: 23750, growth: 8 },
                { month: 'Oct', sales: 24580, growth: 18 }
              ].map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{ width: `${(data.sales / 30000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-20 text-right">
                    ₹{data.sales.toLocaleString()}
                  </div>
                  <div className={`text-sm w-12 text-right ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.growth >= 0 ? '+' : ''}{data.growth}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Business Management</CardTitle>
            <CardDescription>
              Quick access to essential business functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex-col gap-2 p-4"
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-600">{action.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RetailerDashboard
