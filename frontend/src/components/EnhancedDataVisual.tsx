import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced data visualization component
const EnhancedDataVisual = () => {
  const [activeTab, setActiveTab] = useState('daily');
  
  // Sample data for charts
  const energyData = {
    daily: [
      { hour: '6 AM', generation: 0.5, consumption: 1.2 },
      { hour: '8 AM', generation: 2.3, consumption: 1.8 },
      { hour: '10 AM', generation: 4.2, consumption: 2.4 },
      { hour: '12 PM', generation: 5.7, consumption: 3.1 },
      { hour: '2 PM', generation: 5.9, consumption: 2.8 },
      { hour: '4 PM', generation: 4.1, consumption: 2.9 },
      { hour: '6 PM', generation: 2.0, consumption: 3.5 },
      { hour: '8 PM', generation: 0.2, consumption: 4.2 }
    ],
    monthly: [
      { month: 'Jan', generation: 320, consumption: 380, savings: 1200 },
      { month: 'Feb', generation: 350, consumption: 360, savings: 1450 },
      { month: 'Mar', generation: 480, consumption: 420, savings: 1800 },
      { month: 'Apr', generation: 520, consumption: 450, savings: 2100 },
      { month: 'May', generation: 580, consumption: 470, savings: 2400 },
      { month: 'Jun', generation: 620, consumption: 490, savings: 2600 }
    ]
  };

  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const barVariants = {
    hidden: { scaleY: 0, originY: 1 },
    visible: { 
      scaleY: 1, 
      transition: { duration: 0.5 }
    }
  };

  const calculateMaxValue = (data, keys) => {
    return Math.max(...data.flatMap(item => keys.map(key => item[key]))) * 1.2;
  };

  const maxDailyValue = calculateMaxValue(energyData.daily, ['generation', 'consumption']);
  const maxMonthlyValue = calculateMaxValue(energyData.monthly, ['generation', 'consumption']);

  return (
    <Card className="chart-container relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
          <span className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-secondary"></span>
          Energy Production & Consumption
        </CardTitle>
        <Tabs defaultValue="daily" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] relative">
          {/* Daily View */}
          {activeTab === 'daily' && (
            <motion.div 
              className="h-full"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex h-full">
                {/* Y-axis */}
                <div className="flex flex-col justify-between pr-3 py-2 text-sm text-muted-foreground">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{((maxDailyValue / 4) * (4 - i)).toFixed(1)} kWh</span>
                  ))}
                </div>
                
                {/* Chart Area */}
                <div className="flex-1 relative flex items-end justify-around h-[280px]">
                  {/* Horizontal grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute border-t border-dashed border-gray-200 dark:border-gray-700 w-full" 
                      style={{ bottom: `${(i / 4) * 100}%` }}
                    ></div>
                  ))}
                  
                  {/* Bars */}
                  <div className="w-full flex justify-around">
                    {energyData.daily.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-16 flex justify-center gap-1.5">
                          <motion.div
                            variants={barVariants}
                            className="w-5 bg-gradient-to-t from-primary to-primary/80 rounded-t-md"
                            style={{ 
                              height: `${(item.generation / maxDailyValue) * 100}%`,
                              maxHeight: '280px'
                            }}
                          />
                          <motion.div
                            variants={barVariants}
                            className="w-5 bg-gradient-to-t from-secondary to-secondary/80 rounded-t-md"
                            style={{ 
                              height: `${(item.consumption / maxDailyValue) * 100}%`,
                              maxHeight: '280px'
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">{item.hour}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center mt-4 gap-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-primary mr-2"></div>
                  <span className="text-sm">Generation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-secondary mr-2"></div>
                  <span className="text-sm">Consumption</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Monthly View */}
          {activeTab === 'monthly' && (
            <motion.div 
              className="h-full"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex h-full">
                {/* Y-axis */}
                <div className="flex flex-col justify-between pr-3 py-2 text-sm text-muted-foreground">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{((maxMonthlyValue / 4) * (4 - i)).toFixed(0)} kWh</span>
                  ))}
                </div>
                
                {/* Chart Area */}
                <div className="flex-1 relative flex items-end justify-around h-[280px]">
                  {/* Horizontal grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute border-t border-dashed border-gray-200 dark:border-gray-700 w-full" 
                      style={{ bottom: `${(i / 4) * 100}%` }}
                    ></div>
                  ))}
                  
                  {/* Bars */}
                  <div className="w-full flex justify-around">
                    {energyData.monthly.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-16 flex justify-center gap-1.5">
                          <motion.div
                            variants={barVariants}
                            className="w-5 bg-gradient-to-t from-primary to-primary/80 rounded-t-md"
                            style={{ 
                              height: `${(item.generation / maxMonthlyValue) * 100}%`,
                              maxHeight: '280px'
                            }}
                          />
                          <motion.div
                            variants={barVariants}
                            className="w-5 bg-gradient-to-t from-secondary to-secondary/80 rounded-t-md"
                            style={{ 
                              height: `${(item.consumption / maxMonthlyValue) * 100}%`,
                              maxHeight: '280px'
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">{item.month}</span>
                        <span className="text-xs font-medium text-accent mt-1">₹{item.savings}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center mt-4 gap-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-primary mr-2"></div>
                  <span className="text-sm">Generation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-secondary mr-2"></div>
                  <span className="text-sm">Consumption</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDataVisual;