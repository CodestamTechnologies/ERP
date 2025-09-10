import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star, Download, Eye, ShoppingCart, Check, X, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { ReactNode } from 'react';

// Define Tool interface for type safety
interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: ReactNode;
  features: string[];
  rating: number;
  downloads: number;
  size: string;
  version: string;
  developer: string;
  screenshots: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  suite?: string;
}

interface ToolCardProps {
  tool: Tool;
  isInstalled: boolean;
  isInCart: boolean;
  price: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onViewDetails: () => void;
  onInstall: () => void;
  onUninstall: () => void;
  index: number;
  isProcessing: boolean;
}

export const ToolCard = ({
  tool, isInstalled, isInCart, price, onAddToCart, onRemoveFromCart,
  onViewDetails, onInstall, onUninstall, index, isProcessing
}: ToolCardProps) => {
  const getSuiteColor = () => {
    switch (tool.suite) {
      case 'HubTrack Pro': return 'from-blue-500 to-cyan-500';
      case 'GOKU': return 'from-orange-500 to-red-500';
      case 'GAMA': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${getSuiteColor()} text-white`}>
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{tool.name}</h3>
                <p className="text-xs text-gray-500">{tool.developer}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {tool.isPremium && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white"><Crown size={12} className="mr-1" />Premium</Badge>}
              {tool.isNew && <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white"><Sparkles size={12} className="mr-1" />New</Badge>}
              {tool.isPopular && <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white"><TrendingUp size={12} className="mr-1" />Popular</Badge>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Star size={12} className="text-yellow-500 fill-current" />
              <span>{tool.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download size={12} />
              <span>{tool.downloads.toLocaleString()}</span>
            </div>
            <span>{tool.size}</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-500">Key Features:</div>
            <div className="flex flex-wrap gap-1">
              {tool.features.slice(0, 3).map((feature: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-lg font-bold text-gray-900">
              {price > 0 ? `₹${price}` : 'Free'}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <Eye size={14} />
              </Button>
              
              {isInstalled ? (
                <Button variant="outline" size="sm" onClick={onUninstall} disabled={isProcessing} className="text-red-600 hover:text-red-700">
                  <X size={14} className="mr-1" />Uninstall
                </Button>
              ) : price === 0 ? (
                <Button size="sm" onClick={onInstall} disabled={isProcessing} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Check size={14} className="mr-1" />Install
                </Button>
              ) : isInCart ? (
                <Button variant="outline" size="sm" onClick={onRemoveFromCart} className="text-orange-600 hover:text-orange-700">
                  <X size={14} className="mr-1" />Remove
                </Button>
              ) : (
                <Button size="sm" onClick={onAddToCart} className={`bg-gradient-to-r ${getSuiteColor()} hover:opacity-90`}>
                  <ShoppingCart size={14} className="mr-1" />Add to Cart
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};