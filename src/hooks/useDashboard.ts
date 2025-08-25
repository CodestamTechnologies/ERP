import { useState, useEffect } from 'react';

export const useDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
    }, 2000);
  };

  return {
    selectedTimeRange,
    setSelectedTimeRange,
    isGeneratingReport,
    isLoading,
    handleGenerateReport
  };
};