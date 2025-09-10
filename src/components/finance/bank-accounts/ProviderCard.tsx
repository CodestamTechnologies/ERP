'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BankIntegrationProvider } from '@/types/bankAccount';
import { getRegionFlag } from '@/lib/utils/bankAccountUtils';
import { 
  Building,
  LinkIcon,
  ExternalLink
} from 'lucide-react';

interface ProviderCardProps {
  provider: BankIntegrationProvider;
  onConnect: (provider: BankIntegrationProvider) => void;
}

export const ProviderCard = ({ provider, onConnect }: ProviderCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building size={24} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{provider.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className={
                  provider.cost === 'free' ? 'text-green-600 bg-green-50 border-green-200' :
                  provider.cost === 'paid' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                  'text-purple-600 bg-purple-50 border-purple-200'
                }>
                  {provider.cost}
                </Badge>
                <Badge variant="outline" className={
                  provider.setupComplexity === 'easy' ? 'text-green-600 bg-green-50 border-green-200' :
                  provider.setupComplexity === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                  'text-red-600 bg-red-50 border-red-200'
                }>
                  {provider.setupComplexity}
                </Badge>
              </div>
            </div>
          </div>
          {provider.isActive && (
            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
              Active
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">SUPPORTED COUNTRIES</p>
            <div className="flex flex-wrap gap-1">
              {provider.supportedCountries.slice(0, 5).map(country => (
                <span key={country} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {getRegionFlag(country)} {country}
                </span>
              ))}
              {provider.supportedCountries.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{provider.supportedCountries.length - 5} more
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">FEATURES</p>
            <div className="flex flex-wrap gap-1">
              {provider.features.slice(0, 3).map(feature => (
                <span key={feature} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {provider.features.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{provider.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onConnect(provider)}
          >
            <LinkIcon size={14} className="mr-2" />
            Connect
          </Button>
          {provider.documentation && (
            <Button size="sm" variant="outline">
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};