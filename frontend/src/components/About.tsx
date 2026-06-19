import { Card, CardContent } from "@/components/ui/card";
import { Sun, Brain, TrendingUp, Shield, Zap, Globe, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const features = [
    {
      icon: Sun,
      title: "Solar Intelligence Hub",
      description: "Advanced satellite imagery analysis and rooftop assessment algorithms provide precise solar potential calculations for your specific location and conditions.",
      stats: "95% accuracy rate"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Proprietary machine learning models trained on millions of data points deliver personalized recommendations and optimal system configurations.",
      stats: "50+ AI algorithms"
    },
    {
      icon: TrendingUp,
      title: "Real-time Market Data",
      description: "Live integration with pricing APIs, government databases, and weather services ensures you always have the most current information for decisions.",
      stats: "Updated every 15 minutes"
    },
    {
      icon: Shield,
      title: "Trusted & Secure Platform",
      description: "Enterprise-grade security with verified data sources and proven algorithms ensure reliable, accurate solar assessments you can trust.",
      stats: "99.9% uptime guarantee"
    },
    {
      icon: Zap,
      title: "Instant Optimization",
      description: "Lightning-fast processing delivers comprehensive solar analysis and recommendations in under 30 seconds, not hours or days.",
      stats: "< 30 second analysis"
    },
    {
      icon: Globe,
      title: "Comprehensive Coverage",
      description: "Nationwide solar data integration covering all states, local utilities, and regional incentive programs for complete coverage.",
      stats: "All 50 states covered"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with local solar installers, verified contractors, and community solar programs through our trusted partner network.",
      stats: "500+ verified partners"
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Join thousands of satisfied customers who have successfully transitioned to solar with confidence using Solbright's platform.",
      stats: "10,000+ successful installations"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            About SolBright: Pioneering Solar Intelligence
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            SolBright revolutionizes solar energy adoption through cutting-edge artificial intelligence 
            and comprehensive data integration. Our platform seamlessly combines real-time solar panel 
            pricing, government subsidies, weather analytics, and AI-powered recommendations to transform 
            complex solar decisions into confident, informed choices.
          </motion.p>
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700 font-medium text-base">
              "Empowering every homeowner with the intelligence and confidence to make the smart switch to solar energy, 
              while maximizing savings and environmental impact through advanced AI technology."
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 group border-0 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;