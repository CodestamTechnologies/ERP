import { useState, useEffect } from 'react';

interface WebsiteTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

export const useWebsite = () => {
  const [domainUrl, setDomainUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [addedWebsite, setAddedWebsite] = useState<string | null>(null);
  const [websiteTabs, setWebsiteTabs] = useState<WebsiteTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [recentDomains, setRecentDomains] = useState<string[]>([]);

  // Load recent domains from localStorage on component mount
  useEffect(() => {
    const savedRecentDomains = localStorage.getItem('recentDomains');
    if (savedRecentDomains) {
      setRecentDomains(JSON.parse(savedRecentDomains));
    }
  }, []);

  // Save recent domains to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentDomains', JSON.stringify(recentDomains));
  }, [recentDomains]);

  const addToRecentDomains = (domain: string) => {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    setRecentDomains(prev => {
      const filtered = prev.filter(d => d !== cleanDomain);
      const updated = [cleanDomain, ...filtered].slice(0, 5); // Keep only 5 recent domains
      return updated;
    });
  };

  const validateUrl = (url: string) => {
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setDomainUrl(value);
    setIsValidUrl(validateUrl(value));
  };

  const handleAddDomain = () => {
    if (isValidUrl) {
      setIsLoading(true);
      // Add to recent domains when analyzing
      addToRecentDomains(domainUrl);
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        setShowPreview(true);
      }, 1500);
    }
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleCreateWebsite = () => {
    window.open('https://store.codestam.com/', '_blank');
  };

  const handleAddWebsite = () => {
    if (isValidUrl && domainUrl) {
      const formattedUrl = formatUrl(domainUrl);
      const newTab: WebsiteTab = {
        id: Date.now().toString(),
        url: formattedUrl,
        title: new URL(formattedUrl).hostname,
        favicon: `${new URL(formattedUrl).origin}/favicon.ico`
      };
      
      setWebsiteTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setAddedWebsite(formattedUrl);
      setShowFullScreen(true);
      
      // Reset form
      setDomainUrl('');
      setIsValidUrl(false);
      setShowPreview(false);
    }
  };

  const handleCloseFullScreen = () => {
    setShowFullScreen(false);
    setActiveTabId(null);
    setAddedWebsite(null);
  };

  const handleSwitchTab = (tabId: string) => {
    const tab = websiteTabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      setAddedWebsite(tab.url);
      setShowFullScreen(true);
    }
  };

  const handleCloseTab = (tabId: string) => {
    setWebsiteTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = websiteTabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        const nextTab = remainingTabs[remainingTabs.length - 1];
        setActiveTabId(nextTab.id);
        setAddedWebsite(nextTab.url);
      } else {
        handleCloseFullScreen();
      }
    }
  };

  const getActiveTab = () => {
    return websiteTabs.find(tab => tab.id === activeTabId);
  };

  return {
    domainUrl,
    isValidUrl,
    showPreview,
    isLoading,
    showFullScreen,
    addedWebsite,
    websiteTabs,
    activeTabId,
    recentDomains,
    handleUrlChange,
    handleAddDomain,
    formatUrl,
    handleCreateWebsite,
    handleAddWebsite,
    handleCloseFullScreen,
    handleSwitchTab,
    handleCloseTab,
    getActiveTab,
    addToRecentDomains,
  };
};