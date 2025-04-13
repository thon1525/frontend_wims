import PagesTitle from "../components/PagesTitle";
import PricingCard from "../components/PricingCard";

const pricingData = [
  {
    top: {
      package: 'basic',
      charge: 'monthly',
      price: 14.99,
    },
    center: {
      freeSetup: true,
      bandwidth: 10,
      connection: 20,
      analytics: false,
      publicApi: false,
      plugins: false, 
      customContent: false,
    },
    bottom: {
      button: 'get started',
      trialDays: 30
    }
  },
  {
    top: {
      package: 'standard',
      charge: 'monthly',
      price: 49.99,
    },
    center: {
      freeSetup: true,
      bandwidth: 10,
      connection: 20,
      analytics: true,
      publicApi: true,
      plugins: false, 
      customContent: false,
    },
    bottom: {
      button: 'get started',
      trialDays: 30
    }
  },
  {
    top: {
      package: 'premium',
      charge: 'monthly',
      price: 89.99,
    },
    center: {
      freeSetup: true,
      bandwidth: 10,
      connection: 20,
      analytics: true,
      publicApi: true,
      plugins: true, 
      customContent: true,
    },
    bottom: {
      button: 'get started',
      trialDays: 30
    }
  },
]

const Pricing = () => {
  return (
    <>
      <PagesTitle />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        {pricingData.map((pricing, index) => (
          <PricingCard key={index}  pricing={pricing}/>
        ))}
      </div>
    </>
  )
}

export default Pricing