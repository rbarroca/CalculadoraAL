import React, { useState, useEffect } from 'react';
import Analytics, { trackCalculation, trackLocationChange, trackFAQOpen, trackCTAClick, trackEvent } from './components/Analytics';
import Header from './components/Header';
import Hero from './components/Hero';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import FeaturesSection from './components/FeaturesSection';
import BenefitsSection from './components/BenefitsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import LayoutSwitcher, { LayoutType } from './components/LayoutSwitcher';

interface CalculatorData {
  location: string;
  pricePerNight: number;
  occupancyRate: number;
  cleaningFee: number;
  maintenanceCosts: number;
  platformCommission: number;
  insurance: number;
  utilities: number;
  traditionalRent: number;
}

interface CalculationResult {
  grossMonthlyRevenue: number;
  grossAnnualRevenue: number;
  totalMonthlyCosts: number;
  totalAnnualCosts: number;
  netMonthlyProfit: number;
  netAnnualProfit: number;
  breakEvenDays: number;
  traditionalMonthlyIncome: number;
  traditionalAnnualIncome: number;
  alAdvantage: number;
}

const locations = [
  { value: 'lisboa', label: 'Lisboa', avgPrice: 85 },
  { value: 'porto', label: 'Porto', avgPrice: 65 },
  { value: 'algarve', label: 'Algarve', avgPrice: 95 },
  { value: 'cascais', label: 'Cascais', avgPrice: 120 },
  { value: 'sintra', label: 'Sintra', avgPrice: 75 },
  { value: 'obidos', label: 'Óbidos', avgPrice: 70 },
  { value: 'aveiro', label: 'Aveiro', avgPrice: 55 },
  { value: 'coimbra', label: 'Coimbra', avgPrice: 50 }
];

function App() {
  const [data, setData] = useState<CalculatorData>({
    location: 'lisboa',
    pricePerNight: 85,
    occupancyRate: 65,
    cleaningFee: 25,
    maintenanceCosts: 150,
    platformCommission: 15,
    insurance: 300,
    utilities: 80,
    traditionalRent: 800
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [layout, setLayout] = useState<LayoutType>(() => {
    const savedLayout = localStorage.getItem('calculator-layout');
    return (savedLayout as LayoutType) || 'side-by-side';
  });

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    localStorage.setItem('calculator-layout', newLayout);
    trackEvent('layout_change', {
      layout_type: newLayout
    });
  };

  useEffect(() => {
    const selectedLocation = locations.find(loc => loc.value === data.location);
    if (selectedLocation && data.pricePerNight === 0) {
      setData(prev => ({ ...prev, pricePerNight: selectedLocation.avgPrice }));
    }
  }, [data.location]);

  const calculateProfitability = (): CalculationResult => {
    const daysPerMonth = 30;
    const monthsPerYear = 12;
    const occupiedDaysPerMonth = (daysPerMonth * data.occupancyRate) / 100;

    const grossMonthlyRevenue = occupiedDaysPerMonth * data.pricePerNight;
    const grossAnnualRevenue = grossMonthlyRevenue * monthsPerYear;

    const monthlyCleaningCosts = occupiedDaysPerMonth * (data.cleaningFee * 0.7);
    const monthlyPlatformCommission = grossMonthlyRevenue * (data.platformCommission / 100);
    const monthlyInsurance = data.insurance / monthsPerYear;

    const totalMonthlyCosts = monthlyCleaningCosts + data.maintenanceCosts + monthlyPlatformCommission + monthlyInsurance + data.utilities;
    const totalAnnualCosts = totalMonthlyCosts * monthsPerYear;

    const netMonthlyProfit = grossMonthlyRevenue - totalMonthlyCosts;
    const netAnnualProfit = netMonthlyProfit * monthsPerYear;

    const dailyProfit = data.pricePerNight - (totalMonthlyCosts / occupiedDaysPerMonth);
    const breakEvenDays = Math.ceil(totalMonthlyCosts / dailyProfit);

    const traditionalMonthlyIncome = data.traditionalRent;
    const traditionalAnnualIncome = traditionalMonthlyIncome * monthsPerYear;
    const alAdvantage = ((netMonthlyProfit - traditionalMonthlyIncome) / traditionalMonthlyIncome) * 100;

    return {
      grossMonthlyRevenue,
      grossAnnualRevenue,
      totalMonthlyCosts,
      totalAnnualCosts,
      netMonthlyProfit,
      netAnnualProfit,
      breakEvenDays,
      traditionalMonthlyIncome,
      traditionalAnnualIncome,
      alAdvantage
    };
  };

  const handleCalculate = () => {
    const calculatedResult = calculateProfitability();
    setResult(calculatedResult);

    trackCalculation({
      location: data.location,
      pricePerNight: data.pricePerNight,
      occupancyRate: data.occupancyRate,
      monthlyProfit: calculatedResult.netMonthlyProfit,
      alAdvantage: calculatedResult.alAdvantage
    });
  };

  useEffect(() => {
    handleCalculate();
  }, [data]);

  const handleLocationChange = (location: string) => {
    const selectedLocation = locations.find(loc => loc.value === location);
    trackLocationChange(location);
    setData(prev => ({
      ...prev,
      location,
      pricePerNight: selectedLocation ? selectedLocation.avgPrice : prev.pricePerNight
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Analytics />
      <Header />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CalculatorForm
          data={data}
          setData={setData}
          result={result}
          locations={locations}
          onLocationChange={handleLocationChange}
          layout={layout}
          onLayoutChange={handleLayoutChange}
        />
        {result && <ResultsDisplay result={result} data={data} />}
        <FeaturesSection />
        <BenefitsSection />
        <FAQSection trackFAQOpen={trackFAQOpen} />
      </main>
      <Footer />
    </div>
  );
}

export default App;