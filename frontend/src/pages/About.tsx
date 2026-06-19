import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, Target, Users, Award, Lightbulb, Heart } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to revolutionize solar adoption',
      color: 'text-blue-500'
    },
    {
      icon: Heart,
      title: 'Sustainability',
      description: 'Committed to creating a cleaner, more sustainable future for all',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Accessibility',
      description: 'Making solar energy accessible and affordable for everyone',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Delivering superior service and reliable solar solutions',
      color: 'text-yellow-500'
    }
  ]

  const team = [
    {
      name: 'Aditya Singh',
      role: 'Team Member',
      description: ''
    },
    {
      name: 'Aditya Pol',
      role: 'Team Member',
      description: ''
    },
    {
      name: 'Adityaraj Singh',
      role: 'Team Member',
      description: ''
    }
  ]

  return (
    <div className="space-y-12 relative">
      {/* Semi-transparent background for readability */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-sm rounded-lg"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center">
          <Info className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Solbright
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're on a mission to make solar energy accessible, affordable, and intelligent for everyone.
          </p>
        </div>

      {/* Mission Statement */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Lightbulb className="h-12 w-12 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            At Solbright, we believe that the transition to solar energy should be simple, smart, and sustainable. 
            Our AI-powered platform eliminates the guesswork from solar adoption, providing personalized recommendations 
            that help homeowners and businesses make informed decisions about their energy future.
          </p>
        </div>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Our Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Icon className={`h-12 w-12 ${value.color}`} />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-gray-50 rounded-lg p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            What We Do
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Our advanced machine learning algorithms analyze thousands of data points including 
                weather patterns, energy usage, roof characteristics, and local regulations to 
                provide accurate solar estimates.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Personalized Recommendations
              </h3>
              <p className="text-gray-600 mb-4">
                Every home is unique, and so are our recommendations. We consider your specific 
                energy needs, budget, and goals to design the perfect solar solution for you.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real-Time Monitoring
              </h3>
              <p className="text-gray-600 mb-4">
                Track your solar system's performance with detailed analytics, get maintenance 
                alerts, and optimize your energy usage with intelligent insights.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Expert Support
              </h3>
              <p className="text-gray-600 mb-4">
                Our team of solar experts is always available to help you navigate your solar 
                journey, from initial consultation to post-installation support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium text-blue-600">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white rounded-lg p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Solar Installations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹50M+</div>
              <div className="text-blue-200">Customer Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">11M kg</div>
              <div className="text-blue-200">CO2 Reduction</div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}

export default About