import { useState, useEffect } from 'react';

export const useCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedSegment,
    setSelectedSegment,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    isExporting,
    isLoading,
    handleExport
  };
};