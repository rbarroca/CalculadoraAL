import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'AL Calculator',
      ...parameters
    });
  }
};

export const trackCalculation = (data: {
  location: string;
  pricePerNight: number;
  occupancyRate: number;
  monthlyProfit: number;
  alAdvantage: number;
}) => {
  trackEvent('calculate_al_profitability', {
    location: data.location,
    price_range: data.pricePerNight > 100 ? 'high' : data.pricePerNight > 60 ? 'medium' : 'low',
    occupancy_range: data.occupancyRate > 70 ? 'high' : data.occupancyRate > 50 ? 'medium' : 'low',
    profit_range: data.monthlyProfit > 1000 ? 'high' : data.monthlyProfit > 500 ? 'medium' : 'low',
    al_advantage: data.alAdvantage > 0 ? 'positive' : 'negative'
  });
};

export const trackLocationChange = (location: string) => {
  trackEvent('change_location', {
    location: location
  });
};

export const trackFAQOpen = (question: string) => {
  trackEvent('open_faq', {
    question: question.substring(0, 50) // First 50 chars for privacy
  });
};

export const trackCTAClick = (ctaType: string) => {
  trackEvent('cta_click', {
    cta_type: ctaType
  });
};

const Analytics = () => {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-KVZD0XY5X4', {
        page_title: 'Calculadora de Alojamento Local',
        page_location: window.location.href
      });
    }
  }, []);

  return null;
};

export default Analytics;