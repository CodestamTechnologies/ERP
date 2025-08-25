import { useState, useEffect } from 'react';

export const useAIInsights = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedModel, setSelectedModel] = useState('advanced');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return {
    activeTab,
    setActiveTab,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedModel,
    setSelectedModel,
    isAnalyzing,
    isLoading,
    handleAnalyze
  };
};