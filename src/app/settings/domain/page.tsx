'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ConnectDomainPage() {
  const [domain, setDomain] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConnectDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    
    // Simulate domain connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus('success');
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">Connect Your Domain</h1>
          </div>
          <p className="text-gray-600">Connect your custom domain to access your ERP system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Domain Connection Form */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Configuration</CardTitle>
              <CardDescription>
                Enter your custom domain to connect it to your ERP system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConnectDomain} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    type="text"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Enter your domain without http:// or https://
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isConnecting || !domain}
                >
                  {isConnecting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting Domain...
                    </div>
                  ) : (
                    'Connect Domain'
                  )}
                </Button>

                {connectionStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-800 font-medium">Domain connected successfully!</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Your domain {domain} is now connected to your ERP system.
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to configure your domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Purchase a Domain</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Buy a domain from a registrar like GoDaddy, Namecheap, or Google Domains.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Configure DNS</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Point your domain's A record to our server IP address.
                    </p>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono">
                      A Record: @ → 192.168.1.100
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Connect Domain</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Enter your domain in the form and click "Connect Domain".
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">SSL Certificate</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We'll automatically generate an SSL certificate for your domain.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Benefits of Custom Domain</CardTitle>
            <CardDescription>
              Why you should connect your own domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Branding</h3>
                <p className="text-sm text-gray-600">
                  Use your own domain for a professional appearance
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enhanced Security</h3>
                <p className="text-sm text-gray-600">
                  SSL certificates and secure connections
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Better Performance</h3>
                <p className="text-sm text-gray-600">
                  Optimized routing and faster load times
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}