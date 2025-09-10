'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Settings, 
  RefreshCw, 
  BarChart3, 
  Users, 
  Calendar, 
  FileText,
  Shield,
  Cloud,
  Building2,
  Zap,
  Activity,
  Clock,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Import service components
import GoogleWorkspaceService from '@/app/gmail/email-services/GoogleWorkspaceService';
import Microsoft365Service from '@/app/gmail/email-services/Microsoft365Service';
import ZohoMailService from '@/app/gmail/email-services/ZohoMailService';
import ProtonMailService from '@/app/gmail/email-services/ProtonMailService';

// Email service configurations for ERP
const EMAIL_SERVICES = [
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    icon: Cloud,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    status: 'connected',
    component: GoogleWorkspaceService
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    icon: Building2,
    iconColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    status: 'disconnected',
    component: Microsoft365Service
  },
  {
    id: 'zoho-mail',
    name: 'Zoho Mail',
    icon: Zap,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    status: 'connected',
    component: ZohoMailService
  },
  {
    id: 'proton-mail',
    name: 'Proton Mail',
    icon: Shield,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    status: 'disconnected',
    component: ProtonMailService
  }
];

const Gmail = () => {
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<string>('google-workspace');
  const [isLoading, setIsLoading] = useState(false);

  // Check for service parameter in URL and set the selected service
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && EMAIL_SERVICES.find(service => service.id === serviceParam)) {
      setSelectedService(serviceParam);
    }
  }, [searchParams]);

  const handleServiceChange = (serviceId: string) => {
    setIsLoading(true);
    setSelectedService(serviceId);
    
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  const currentService = EMAIL_SERVICES.find(service => service.id === selectedService);
  const CurrentServiceComponent = currentService?.component;

  // Get connection status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'syncing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'syncing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'disconnected': return XCircle;
      case 'syncing': return AlertCircle;
      default: return XCircle;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Service Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="w-7 h-7 mr-3 text-blue-600" />
            Email Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage business emails across different service providers
          </p>
        </div>
        
        {/* Service Selector Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Email Service:
          </span>
          <Select value={selectedService} onValueChange={handleServiceChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Choose email service" />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_SERVICES.map((service) => {
                const IconComponent = service.icon;
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`w-4 h-4 ${service.iconColor}`} />
                        <span>{service.name}</span>
                      </div>
                      <StatusIcon className={`w-3 h-3 ml-2 ${
                        service.status === 'connected' ? 'text-green-500' : 'text-red-500'
                      }`} />
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Service Management */}
      {currentService && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${currentService.bgColor} ${currentService.borderColor} border rounded-lg flex items-center justify-center`}>
                  <currentService.icon className={`w-6 h-6 ${currentService.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentService.name}
                    <Badge className={getStatusBadge(currentService.status)}>
                      {currentService.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Business email management and communication
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
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
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
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
                  <div className={`${currentService.bgColor} p-4 rounded-full mb-4`}>
                    <currentService.icon className={`w-8 h-8 ${currentService.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {currentService.name} Integration
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your {currentService.name} account to manage emails.
                  </p>
                  <Button>
                    Connect Account
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Email Analytics
            </CardTitle>
            <CardDescription>Track email performance and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emails Sent Today</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emails Received</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-semibold text-green-600">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common email management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Compose Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Email Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Contact Management
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              System Status
            </CardTitle>
            <CardDescription>Email service health and sync status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-sm font-medium">2 min ago</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service Status</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <div className="flex items-center space-x-1">
                  <Database className="w-3 h-3 text-gray-500" />
                  <span className="text-sm font-medium">2.4 GB / 15 GB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gmail;