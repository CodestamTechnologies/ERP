'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Import service components
import GoogleWorkspaceService from '@/app/gmail/email-services/GoogleWorkspaceService';
import Microsoft365Service from '@/app/gmail/email-services/Microsoft365Service';
import ZohoMailService from '@/app/gmail/email-services/ZohoMailService';
import ProtonMailService from '@/app/gmail/email-services/ProtonMailService';

// Service configurations
const EMAIL_SERVICES = [
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Gmail, Calendar, Drive, Meet - Perfect for startups and SMEs',
    icon: '🔵',
    color: 'bg-blue-500',
    features: ['Gmail', 'Calendar', 'Drive', 'Meet', 'Docs', 'Sheets'],
    pricing: 'Starting at $6/user/month',
    popular: true,
    component: GoogleWorkspaceService
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Outlook, Exchange, Teams, OneDrive - Enterprise favorite',
    icon: '🟦',
    color: 'bg-blue-600',
    features: ['Outlook', 'Exchange', 'Teams', 'OneDrive', 'Word', 'Excel'],
    pricing: 'Starting at $5/user/month',
    popular: false,
    component: Microsoft365Service
  },
  {
    id: 'zoho-mail',
    name: 'Zoho Mail & Workplace',
    description: 'Cost-effective alternative for small and medium businesses',
    icon: '🟠',
    color: 'bg-orange-500',
    features: ['Zoho Mail', 'Calendar', 'Docs', 'Sheet', 'Show', 'Meeting'],
    pricing: 'Starting at $1/user/month',
    popular: false,
    component: ZohoMailService
  },
  {
    id: 'proton-mail',
    name: 'Proton Mail',
    description: 'Privacy-focused secure email with end-to-end encryption',
    icon: '🟣',
    color: 'bg-purple-500',
    features: ['Encrypted Email', 'Calendar', 'Drive', 'VPN', 'Pass'],
    pricing: 'Starting at $4/user/month',
    popular: false,
    component: ProtonMailService
  }
];

const EmailServices = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Get service from URL params or default to first service
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && EMAIL_SERVICES.find(s => s.id === serviceParam)) {
      setSelectedService(serviceParam);
    } else {
      setSelectedService(EMAIL_SERVICES[0].id);
    }
  }, [searchParams]);

  const handleServiceChange = (serviceId: string) => {
    setIsLoading(true);
    setSelectedService(serviceId);
    
    // Update URL without page reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('service', serviceId);
    window.history.pushState({}, '', newUrl.toString());
    
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  const currentService = EMAIL_SERVICES.find(service => service.id === selectedService);
  const CurrentServiceComponent = currentService?.component;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-2xl mr-3">📧</span>
            Email Services Integration
          </h1>
          <p className="text-gray-600 mt-1">
            Connect and manage your business email services from one dashboard
          </p>
        </div>
        
        {/* Service Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Select Service:
          </span>
          <Select value={selectedService} onValueChange={handleServiceChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Choose an email service" />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_SERVICES.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex items-center space-x-2">
                    <span>{service.icon}</span>
                    <span>{service.name}</span>
                    {service.popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Service Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {EMAIL_SERVICES.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`cursor-pointer transition-all duration-200 ${
              selectedService === service.id 
                ? 'ring-2 ring-blue-500 ring-offset-2' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleServiceChange(service.id)}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {service.icon}
                  </div>
                  {service.popular && (
                    <Badge variant="default" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {service.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {service.pricing}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current Service Details */}
      {currentService && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${currentService.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {currentService.icon}
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentService.name}
                    {currentService.popular && (
                      <Badge variant="default">Popular Choice</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{currentService.description}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentService.pricing}</p>
                <p className="text-xs text-gray-500">per user per month</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Service Component */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-64"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-gray-600">Loading {currentService.name}...</p>
                  </div>
                </motion.div>
              ) : CurrentServiceComponent ? (
                <motion.div
                  key={selectedService}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentServiceComponent />
                </motion.div>
              ) : (
                <motion.div
                  key="fallback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 text-center p-6"
                >
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <span className="text-2xl">{currentService.icon}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {currentService.name} Integration
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This service integration is currently being developed.
                  </p>
                  <Button variant="outline">
                    Request Integration
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Service Features Comparison</CardTitle>
          <CardDescription>
            Compare features across different email service providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Feature</th>
                  {EMAIL_SERVICES.map((service) => (
                    <th key={service.id} className="text-center p-3 font-medium">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg">{service.icon}</span>
                        <span className="text-xs">{service.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Email Storage', values: ['15GB-Unlimited', '50GB-Unlimited', '5GB-Unlimited', '500MB-500GB'] },
                  { feature: 'Calendar Integration', values: ['✅', '✅', '✅', '✅'] },
                  { feature: 'File Storage', values: ['15GB-Unlimited', '1TB-Unlimited', '5GB-Unlimited', '500MB-500GB'] },
                  { feature: 'Video Conferencing', values: ['Google Meet', 'Teams', 'Zoho Meeting', '❌'] },
                  { feature: 'Mobile Apps', values: ['✅', '✅', '✅', '✅'] },
                  { feature: 'End-to-End Encryption', values: ['❌', '❌', '❌', '✅'] },
                  { feature: 'Custom Domain', values: ['✅', '✅', '✅', '✅'] },
                  { feature: 'Admin Controls', values: ['Advanced', 'Enterprise', 'Basic', 'Basic'] },
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{row.feature}</td>
                    {row.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="p-3 text-center">
                        {value === '✅' ? (
                          <span className="text-green-600 text-lg">✅</span>
                        ) : value === '❌' ? (
                          <span className="text-red-600 text-lg">❌</span>
                        ) : (
                          <span className="text-gray-700">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailServices;