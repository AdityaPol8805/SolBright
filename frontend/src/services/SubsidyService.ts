// Service for fetching and processing solar subsidy information

export interface Subsidy {
  id: string
  name: string
  provider: string
  description: string
  eligibilityDescription: string
  amountDescription: string
  applicationUrl: string
  region: string
  applicableStates: string[]
}

// Mock data for solar subsidies in India
const SUBSIDIES: Subsidy[] = [
  {
    id: 'pmsuryaghar',
    name: 'PM Surya Ghar Muft Bijli Yojana',
    provider: 'Ministry of New and Renewable Energy',
    description: 'Offers financial assistance for residential rooftop solar installations to promote clean energy adoption.',
    eligibilityDescription: 'Available for residential consumers with rooftop space.',
    amountDescription: 'Subsidy of ₹18,000 per kilowatt for systems up to 3 kW, and ₹9,000 per kilowatt for systems between 3-10 kW.',
    applicationUrl: 'https://pmsuryaghar.gov.in',
    region: 'National',
    applicableStates: ['All States']
  },
  {
    id: 'kusum',
    name: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM)',
    provider: 'Ministry of New and Renewable Energy',
    description: 'Promotes solar farming among agricultural communities with solar pump installations.',
    eligibilityDescription: 'For farmers with agricultural land.',
    amountDescription: 'Up to 30% capital subsidy for solar pump installation.',
    applicationUrl: 'https://mnre.gov.in/kusum-scheme',
    region: 'National',
    applicableStates: ['All States']
  },
  {
    id: 'solarpumpsmaharashtra',
    name: 'Maharashtra Solar Pump Scheme',
    provider: 'Maharashtra Energy Development Agency (MEDA)',
    description: 'Special subsidies for farmers in Maharashtra to install solar water pumps.',
    eligibilityDescription: 'Small and marginal farmers in Maharashtra with valid agricultural electricity connection.',
    amountDescription: 'Up to 80% subsidy on solar pump installation costs.',
    applicationUrl: 'https://meda.gov.in',
    region: 'State',
    applicableStates: ['Maharashtra']
  },
  {
    id: 'gujaratsolar',
    name: 'Gujarat Solar Rooftop Scheme',
    provider: 'Gujarat Energy Development Agency (GEDA)',
    description: 'Additional state incentives for residential and commercial solar installations.',
    eligibilityDescription: 'Residential and commercial buildings in Gujarat.',
    amountDescription: 'Additional 40% subsidy over central subsidies for residential installations.',
    applicationUrl: 'https://geda.gujarat.gov.in',
    region: 'State',
    applicableStates: ['Gujarat']
  },
  {
    id: 'karnatakasolargrid',
    name: 'Karnataka Grid Connected Solar Scheme',
    provider: 'Karnataka Renewable Energy Development Ltd (KREDL)',
    description: 'Promotes grid-connected solar systems with state incentives.',
    eligibilityDescription: 'All electricity consumers in Karnataka.',
    amountDescription: 'Additional 20% subsidy over central subsidies for systems up to 10 kW.',
    applicationUrl: 'https://kredl.karnataka.gov.in',
    region: 'State',
    applicableStates: ['Karnataka']
  }
]

export const SubsidyService = {
  getSubsidies: async (): Promise<Subsidy[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SUBSIDIES)
      }, 500)
    })
  },

  getSubsidyById: async (id: string): Promise<Subsidy | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SUBSIDIES.find(subsidy => subsidy.id === id))
      }, 300)
    })
  },

  getSubsidiesByState: async (state: string): Promise<Subsidy[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = SUBSIDIES.filter(subsidy => 
          subsidy.applicableStates.includes('All States') || 
          subsidy.applicableStates.includes(state)
        )
        resolve(results)
      }, 300)
    })
  }
}

export default SubsidyService