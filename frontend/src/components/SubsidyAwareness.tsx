import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubsidyService, Subsidy } from '@/services/SubsidyService'
import { Lightbulb, ArrowRight, IndianRupee, Check } from 'lucide-react'

const SubsidyAwareness: React.FC = () => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('All States')

  useEffect(() => {
    const fetchSubsidies = async () => {
      setIsLoading(true)
      try {
        let data
        if (selectedState === 'All States') {
          data = await SubsidyService.getSubsidies()
        } else {
          data = await SubsidyService.getSubsidiesByState(selectedState)
        }
        setSubsidies(data)
      } catch (error) {
        console.error('Error fetching subsidies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubsidies()
  }, [selectedState])

  const stateOptions = [
    'All States',
    'Andhra Pradesh',
    'Gujarat',
    'Karnataka',
    'Maharashtra',
    'Tamil Nadu',
    'Telangana'
  ]

  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Solar Subsidy Awareness</h2>
            <p className="text-lg text-gray-600">
              Discover government subsidies and incentives to make your solar journey more affordable.
            </p>
          </motion.div>

          <div className="mb-8">
            <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by State
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full md:w-64 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stateOptions.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {subsidies.map((subsidy) => (
                <Card key={subsidy.id} className="overflow-hidden border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-green-700">{subsidy.name}</CardTitle>
                        <CardDescription className="text-gray-600">
                          Provided by: {subsidy.provider}
                        </CardDescription>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {subsidy.region}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-700">{subsidy.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-700">Eligibility</h4>
                          <p className="text-sm text-gray-600">{subsidy.eligibilityDescription}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <IndianRupee className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-700">Benefit Amount</h4>
                          <p className="text-sm text-gray-600">{subsidy.amountDescription}</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => window.open(subsidy.applicationUrl, '_blank')}
                    >
                      Learn More <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {subsidies.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No subsidies found for the selected state.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
              Calculate Your Solar Savings
            </Button>
            <p className="mt-4 text-sm text-gray-600">
              Subsidy information is subject to change. Always verify with the official sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SubsidyAwareness