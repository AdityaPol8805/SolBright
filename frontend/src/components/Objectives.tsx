import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Lightbulb, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Leaf, 
  DollarSign, 
  Globe, 
  ArrowRight, 
  Zap, 
  Award, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

const Objectives = () => {
  const objectives = [
    {
      icon: Target,
      title: "Precision Solar Assessment",
      description: "Deliver pinpoint-accurate rooftop analysis using satellite imagery, AI algorithms, and real-time environmental data to calculate exact solar potential and optimal system sizing for maximum energy generation.",
      gradient: "from-green-500 to-emerald-600",
      impact: "95% accuracy guarantee",
      metric: "Precise to within 5% of actual output",
      iconBg: "bg-green-500",
      delay: 0.1
    },
    {
      icon: TrendingUp,
      title: "Intelligent Decision Engine",
      description: "Empower instant, data-driven solar decisions through live market intelligence, predictive analytics, and comprehensive performance forecasting that eliminates guesswork from solar adoption.",
      gradient: "from-blue-500 to-cyan-600",
      impact: "30-second analysis",
      metric: "Real-time data from 50+ sources",
      iconBg: "bg-blue-500",
      delay: 0.2
    },
    {
      icon: DollarSign,
      title: "Financial Optimization Hub",
      description: "Maximize solar savings by automatically identifying and applying for available subsidies, tax incentives, and financing options while providing transparent ROI calculations and payback periods.",
      gradient: "from-purple-500 to-violet-600",
      impact: "Maximum savings unlocked",
      metric: "Average 40% cost reduction achieved",
      iconBg: "bg-purple-500",
      delay: 0.3
    },
    {
      icon: Lightbulb,
      title: "Actionable Intelligence Platform",
      description: "Transform complex solar market data, technical specifications, and regulatory information into clear, personalized recommendations that enable confident, informed decision-making for every user.",
      gradient: "from-orange-500 to-red-600",
      impact: "Simplified complexity",
      metric: "Complex data made 90% more understandable",
      iconBg: "bg-orange-500",
      delay: 0.4
    },
    {
      icon: Users,
      title: "Community Empowerment Network",
      description: "Build connected solar communities through neighborhood optimization algorithms, bulk purchasing power, and peer-to-peer energy sharing that benefits entire communities, not just individual homes.",
      gradient: "from-teal-500 to-green-600",
      impact: "Collective solar power",
      metric: "Community savings up to 25%",
      iconBg: "bg-teal-500",
      delay: 0.5
    },
    {
      icon: Leaf,
      title: "Environmental Impact Accelerator",
      description: "Drive rapid clean energy adoption by making solar accessible, affordable, and attractive to mainstream consumers, directly contributing to carbon reduction and environmental sustainability goals.",
      gradient: "from-emerald-500 to-green-600",
      impact: "Carbon footprint reduction",
      metric: "Average 4 tons CO2 saved per household/year",
      iconBg: "bg-emerald-500",
      delay: 0.6
    },
    {
      icon: Globe,
      title: "Universal Solar Access",
      description: "Democratize solar energy by removing barriers of complexity, cost uncertainty, and information asymmetry, making clean energy accessible to households across all income levels and geographic regions.",
      gradient: "from-indigo-500 to-blue-600",
      impact: "Solar for everyone",
      metric: "Serving all 50 states and territories",
      iconBg: "bg-indigo-500",
      delay: 0.7
    },
    {
      icon: AlertCircle,
      title: "Risk Mitigation & Protection",
      description: "Protect solar investments through comprehensive risk assessment, quality verification systems, and ongoing performance monitoring that ensures long-term satisfaction and maximum returns.",
      gradient: "from-red-500 to-pink-600",
      impact: "Investment protection",
      metric: "99.2% customer satisfaction rate",
      iconBg: "bg-red-500",
      delay: 0.8
    }
  ];

  const achievements = [
    { icon: Award, number: "10,000+", label: "Solar Installations", color: "text-blue-600" },
    { icon: DollarSign, number: "$50M+", label: "Customer Savings", color: "text-green-600" },
    { icon: Leaf, number: "40K+", label: "Tons CO2 Prevented", color: "text-emerald-600" },
    { icon: Users, number: "95%", label: "Satisfaction Rate", color: "text-purple-600" }
  ];

  return (
    <section id="objectives" className="py-24 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header */}
        <div className="max-w-6xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold mb-8 shadow-2xl"
          >
            <Sparkles className="h-6 w-6 animate-pulse" />
            Our Mission & Vision
            <Sparkles className="h-6 w-6 animate-pulse" />
          </motion.div>

          <motion.h2 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-white">Accelerating </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Solar Adoption
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-300 font-normal">
              Worldwide
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            SolBright exists to eliminate every barrier between homeowners and clean, affordable solar energy. 
            Through advanced AI, comprehensive data integration, and user-centric design, we're transforming 
            how people discover, evaluate, and adopt solar technology across the globe.
          </motion.p>

          {/* Achievement Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                whileHover={{ y: -10, scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <achievement.icon className={`h-8 w-8 ${achievement.color} mb-3 mx-auto group-hover:scale-110 transition-transform`} />
                <div className="text-3xl font-bold text-white mb-1">{achievement.number}</div>
                <div className="text-sm text-gray-300 font-medium">{achievement.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-4">Our Core Mission</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              "To democratize solar energy adoption by providing intelligent, data-driven solutions that make 
              clean energy accessible, affordable, and attractive to every homeowner, regardless of their 
              technical expertise or geographic location."
            </p>
          </motion.div>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {objectives.map((objective, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: objective.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 overflow-hidden relative">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${objective.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Floating Decoration */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                <CardContent className="p-10 relative z-10">
                  <div className="flex items-start gap-8">
                    {/* Enhanced Icon */}
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${objective.gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                      <div className={`relative p-5 bg-gradient-to-br ${objective.gradient} rounded-2xl shadow-2xl`}>
                        <objective.icon className="h-10 w-10 text-white" />
                      </div>
                      {/* Sparkle effect */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                        {objective.title}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed mb-6 text-base">
                        {objective.description}
                      </p>
                      
                      {/* Impact Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                          <span className="text-green-400 font-semibold text-sm bg-green-400/20 px-3 py-1 rounded-full">
                            {objective.impact}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 font-medium pl-8">
                          {objective.metric}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <Target className="h-16 w-16 text-blue-400 mx-auto mb-6 animate-bounce" />
            <h3 className="text-4xl font-bold text-white mb-6">Ready to Transform Solar Energy?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join us in revolutionizing how the world adopts clean energy. Together, we can build a sustainable future powered by intelligent solar solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg rounded-xl shadow-2xl group font-bold">
                Start Your Solar Journey
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 px-10 py-6 text-lg rounded-xl backdrop-blur-sm">
                Learn More About Our Mission
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Objectives;