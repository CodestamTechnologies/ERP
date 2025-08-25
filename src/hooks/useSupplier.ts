import { useState, useEffect } from 'react';

export const useSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

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
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    isExporting,
    isLoading,
    handleExport
  };
};