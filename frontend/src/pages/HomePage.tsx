import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Sparkles, Sun } from 'lucide-react'
import Features from '@/components/Features'
import About from '@/components/About'
import Hero from '@/components/Hero'
import Objectives from '@/components/Objectives'
import Outcomes from '@/components/Outcomes'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* About Section */}
      <About />
      
      {/* Objectives Section */}
      <Objectives />
      
      {/* Outcomes Section */}
      <Outcomes />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Sun className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Switch to Smarter Solar?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of satisfied customers who have made the switch to clean, 
              affordable solar energy with Solbright's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-gray-100 group">
                Try Solbright Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage