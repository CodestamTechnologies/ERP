import { useState } from 'react';

export const useCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [isExporting, setIsExporting] = useState(false);

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
    handleExport
  };
};