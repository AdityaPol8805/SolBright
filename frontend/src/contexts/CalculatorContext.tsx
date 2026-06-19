import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CalculationResult {
  systemSize: number
  estimatedCost: number
  annualSavings: number
  paybackPeriod: number
  co2Reduction: number
  calculatedAt?: Date
}

interface CalculatorContextType {
  calculatorResult: CalculationResult | null
  saveCalculatorResult: (result: CalculationResult) => void
  clearCalculatorResult: () => void
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined)

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculatorResult, setCalculatorResult] = useState<CalculationResult | null>(null)

  useEffect(() => {
    // Load saved calculator result from localStorage on component mount
    const savedResult = localStorage.getItem('solbright_calculator_result')
    if (savedResult) {
      try {
        setCalculatorResult(JSON.parse(savedResult))
      } catch (error) {
        localStorage.removeItem('solbright_calculator_result')
      }
    }
  }, [])

  const saveCalculatorResult = (result: CalculationResult) => {
    // Add timestamp to result
    const resultWithTimestamp = {
      ...result,
      calculatedAt: new Date()
    }
    
    // Save to state and localStorage
    setCalculatorResult(resultWithTimestamp)
    localStorage.setItem('solbright_calculator_result', JSON.stringify(resultWithTimestamp))
  }

  const clearCalculatorResult = () => {
    setCalculatorResult(null)
    localStorage.removeItem('solbright_calculator_result')
  }

  return (
    <CalculatorContext.Provider 
      value={{ 
        calculatorResult, 
        saveCalculatorResult,
        clearCalculatorResult
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext)
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}