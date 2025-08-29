import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star } from 'lucide-react';

interface PricingCardProps {
  plan: { name: string; price: number; features: string[]; popular?: boolean; };
  index: number; onSelect: () => void; isProcessing: boolean;
}

export const PricingCard = ({ plan, index, onSelect, isProcessing }: PricingCardProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className={`relative h-full ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border shadow-lg'}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
              <Star size={12} className="mr-1" />Most Popular
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
          <div className="text-3xl font-bold text-blue-600">₹{plan.price}</div>
          <div className="text-sm text-gray-500">per month</div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={onSelect} 
            disabled={isProcessing}
            className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : ''}`}
          >
            {plan.popular ? <Crown size={16} className="mr-2" /> : <Zap size={16} className="mr-2" />}
            Choose Plan
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};