import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const EnhancedHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interactive mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: e.clientX / window.innerWidth - 0.5, 
        y: e.clientY / window.innerHeight - 0.5 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-container min-h-screen flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
        }}
      />

      {/* Solar panel pattern overlay */}
      <div className="solar-pattern absolute inset-0 opacity-20" />

      {/* Hero content */}
      <div className="container mx-auto max-w-6xl z-10 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full solar-glow">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <span className="text-primary font-bold">BrightSol Advisor</span>
          </motion.div>

          <h1 className="heading-hero mb-6">
            Your Path to Sustainable Solar Energy
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Advanced solar solutions for a brighter, cleaner future. Calculate savings, 
            monitor performance, and optimize your energy consumption.
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button className="btn-modern solar-gradient-primary group">
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button variant="outline" className="btn-modern">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats cards with enhanced styling */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            transform: `translateY(${scrollY * -0.1}px)`
          }}
        >
          {[
            { title: "Energy Generated", value: "1.2M kWh", desc: "Total clean energy produced" },
            { title: "Cost Savings", value: "₹25M+", desc: "Money saved for our customers" },
            { title: "Carbon Reduced", value: "850+ tons", desc: "CO₂ emissions prevented" }
          ].map((stat, index) => (
            <Card key={index} className="stat-card card-highlight">
              <CardContent className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{stat.title}</h3>
                    <Sparkles className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.desc}</p>
                </motion.div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedHero;