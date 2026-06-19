import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, BarChart3, Settings, Sun, X, ChevronUp } from 'lucide-react';

const FloatingActionPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setActiveTab(null);
    }
  };

  const showTab = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main floating button */}
      <motion.button
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
          isExpanded ? 'bg-gray-700' : 'solar-gradient-primary'
        }`}
        onClick={togglePanel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? <X className="text-white" /> : <Sun className="text-white" />}
        </motion.div>
      </motion.button>

      {/* Expandable panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 glass rounded-xl w-[280px] overflow-hidden shadow-xl border border-white/20"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium">Solar Tools</h3>
                <button 
                  className="p-1 hover:bg-gray-100/10 rounded-full"
                  onClick={togglePanel}
                >
                  <ChevronUp size={16} />
                </button>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 'calculator', label: 'Solar Calculator', icon: Calculator },
                  { id: 'performance', label: 'Performance', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => showTab(item.id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-md transition-all ${
                          isActive ? 'bg-primary text-white' : 'hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-secondary'}`} />
                        <span>{item.label}</span>
                      </button>
                      
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/5 rounded-md overflow-hidden"
                          >
                            <div className="p-3 text-sm">
                              {item.id === 'calculator' && (
                                <div className="space-y-2">
                                  <p>Quick estimate for your home:</p>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="text" 
                                      placeholder="Monthly bill (₹)" 
                                      className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary" 
                                    />
                                  </div>
                                  <button className="w-full bg-secondary/80 hover:bg-secondary text-white py-1 rounded text-xs">
                                    Calculate Savings
                                  </button>
                                </div>
                              )}
                              {item.id === 'performance' && (
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>Today's production</span>
                                    <span className="font-medium">12.4 kWh</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                  </div>
                                </div>
                              )}
                              {item.id === 'settings' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span>Dark Mode</span>
                                    <div className="w-10 h-5 bg-gray-700 rounded-full relative">
                                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Notifications</span>
                                    <div className="w-10 h-5 bg-primary rounded-full relative">
                                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionPanel;