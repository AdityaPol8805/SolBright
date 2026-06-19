import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  DollarSign, 
  Bot, 
  BarChart3, 
  Activity, 
  Users,
  RefreshCw,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeInUp, staggerContainer } from "@/hooks/useScrollAnimation";

const Features = () => {
  const { controls, ref, inView } = useScrollAnimation();
  const features = [
    {
      icon: RefreshCw,
      title: "Live Market Intelligence",
      description: "Real-time solar panel pricing, government subsidy updates, and local policy changes with instant notifications",
      color: "text-green-500",
      benefits: "Save up to 30% with live pricing alerts"
    },
    {
      icon: Bot,
      title: "Advanced AI Analytics",
      description: "Cutting-edge machine learning for energy predictions, cost optimization, and personalized ROI calculations",
      color: "text-blue-500",
      benefits: "99.2% prediction accuracy rate"
    },
    {
      icon: Settings,
      title: "Smart System Design",
      description: "AI-powered recommendations for optimal panel types, inverters, and system configurations based on your specific needs",
      color: "text-purple-500",
      benefits: "Maximize efficiency by 25%"
    },
    {
      icon: Activity,
      title: "Prophet Forecasting",
      description: "Advanced time-series analysis using Facebook's Prophet algorithm for precise 20-year energy generation forecasts",
      color: "text-orange-500",
      benefits: "Long-term planning confidence"
    },
    {
      icon: Zap,
      title: "Intelligent Solar Assistant",
      description: "Multi-agent AI chatbot with reinforcement learning and genetic optimization for instant expert guidance",
      color: "text-yellow-500",
      benefits: "24/7 personalized support"
    },
    {
      icon: Users,
      title: "Community Solar Network",
      description: "Advanced clustering algorithms enable neighborhood solar sharing and bulk purchasing opportunities",
      color: "text-teal-500",
      benefits: "Reduce costs through community power"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics Suite",
      description: "Comprehensive dashboards with predictive maintenance alerts and energy optimization recommendations",
      color: "text-indigo-500",
      benefits: "Increase system lifespan by 15%"
    },
    {
      icon: DollarSign,
      title: "Financial Optimization Engine",
      description: "Smart financial planning with automated subsidy applications and dynamic ROI calculations",
      color: "text-emerald-500",
      benefits: "Maximize savings and incentives"
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
      >
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          variants={fadeInUp}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Revolutionary Solar Intelligence
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience the future of solar energy with our cutting-edge AI platform. 
            From intelligent market analysis to personalized system design, discover 
            how Solbright transforms complex solar decisions into confident choices.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              custom={index}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {feature.description}
                      </p>
                      <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                        {feature.benefits}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Features;