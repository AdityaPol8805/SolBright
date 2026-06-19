import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Zap, 
  Battery, 
  Calculator, 
  Award,
  CheckCircle 
} from "lucide-react";

const Outcomes = () => {
  const outcomes = [
    {
      icon: Home,
      title: "Rooftop Area Calculation",
      description: "Precise measurement of available rooftop space using satellite imagery and AI analysis",
      value: "±2% accuracy",
      color: "bg-green-500"
    },
    {
      icon: Zap,
      title: "Wattage Needs Estimation",
      description: "Calculate optimal solar system capacity based on energy consumption patterns",
      value: "Personalized sizing",
      color: "bg-blue-500"
    },
    {
      icon: Battery,
      title: "Energy Generation Predictions",
      description: "Daily, monthly, and yearly energy output forecasts using weather data",
      value: "kWh/day estimates",
      color: "bg-purple-500"
    },
    {
      icon: Calculator,
      title: "Cost Estimates",
      description: "Comprehensive pricing with and without government subsidies and incentives",
      value: "Real-time pricing",
      color: "bg-orange-500"
    },
    {
      icon: Award,
      title: "Best Panel Recommendations",
      description: "AI-powered suggestions for optimal solar panel and system configurations",
      value: "Customized solutions",
      color: "bg-teal-500"
    }
  ];

  return (
    <section id="outcomes" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Expected Outcomes
          </h2>
          <p className="text-lg text-black-600 leading-relaxed">
            Get comprehensive insights and precise calculations to make informed 
            solar investment decisions with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {outcomes.map((outcome, index) => (
            <Card 
              key={index} 
              className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${outcome.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <outcome.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {outcome.title}
                      </h3>
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {outcome.value}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Benefits Summary */}
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-blue-200 border-2">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Complete Solar Solution Analysis
              </h3>
              <p className="text-gray-600">
                Everything you need to make an informed solar investment decision
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Instant Analysis</div>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">AI-Powered Accuracy</div>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Real-time Updates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Outcomes;