import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  heroTextAnimation,
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn
} from "@/hooks/useScrollAnimation";

// Animated counter hook for statistics
const useCounter = (end: number, start = 0, duration = 2000) => {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, start, duration]);
  
  return count;
};

// Text animation that reveals one character at a time
const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={heroTextAnimation}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: index * 0.04 }
            }
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Animated stat counter component
const AnimatedStat = ({ value, label }: { value: string, label: string }) => {
  const isNumber = !isNaN(parseInt(value.replace(/[^\d]/g, "")));
  const numericValue = isNumber ? parseInt(value.replace(/[^\d]/g, "")) : 0;
  const suffix = isNumber ? value.replace(/[\d]/g, "") : value;
  const count = useCounter(numericValue);
  
  return (
    <motion.div 
      className="text-center"
      variants={fadeInUp}
    >
      <motion.div 
        className="text-3xl font-bold text-white mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isNumber ? count : ""}{suffix}
      </motion.div>
      <div className="text-white/80 text-sm">{label}</div>
    </motion.div>
  );
};

const Hero = () => {
  // Animation for the solar glow effect
  const [glowIntensity, setGlowIntensity] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((prev) => (prev === 1 ? 0 : 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* No need for background image here since it's now global */}
      
      {/* Solar glow animation */}
      <motion.div
        className="absolute top-20 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-40 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
            <span className="text-white text-sm font-medium">AI-Powered Solar Planning</span>
          </motion.div>

          {/* Headline with animated text reveal */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight font-serif"
            variants={fadeInUp}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <AnimatedText text="Solbright: A " />
            <motion.span 
              className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              <AnimatedText text="Bright Idea" />
            </motion.span>{" "}
            <AnimatedText text="for Solar Planning" />
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            AI-powered platform for smarter, affordable, and confident solar adoption.
            Make informed decisions with real-time insights and intelligent recommendations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 group transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Planning Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, staggerChildren: 0.2 }}
          >
            <AnimatedStat value="98%" label="Prediction Accuracy" />
            <AnimatedStat value="50K+" label="Rooftops Analyzed" />
            <AnimatedStat value="₹2M+" label="Savings Generated" />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-16 h-16 bg-white rounded-full blur-sm"></div>
      </motion.div>
      <motion.div 
        className="absolute bottom-20 right-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
      >
        <div className="w-12 h-12 bg-white rounded-full blur-sm"></div>
      </motion.div>
      
      {/* Additional decorative elements */}
      <motion.div
        className="absolute bottom-40 left-20 w-24 h-24 rounded-full border border-white/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </section>
  );
};

export default Hero;