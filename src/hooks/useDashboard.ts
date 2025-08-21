import { useState } from 'react';

export const useDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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
    handleGenerateReport
  };
};