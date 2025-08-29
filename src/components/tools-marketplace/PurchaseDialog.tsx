import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Check, AlertTriangle, Crown, Zap } from 'lucide-react';

interface PurchaseDialogProps {
  isOpen: boolean; onClose: () => void; cartItems: any[]; totalPrice: number;
  onPurchase: (toolId: string) => Promise<void>; userCredits: number; isProcessing: boolean;
}

export const PurchaseDialog = ({
  isOpen, onClose, cartItems, totalPrice, onPurchase, userCredits, isProcessing
}: PurchaseDialogProps) => {
  const canAfford = userCredits >= totalPrice;
  const remainingCredits = userCredits - totalPrice;

  const handlePurchaseAll = async () => {
    try {
      for (const item of cartItems) {
        await onPurchase(item.id);
      }
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const getSuiteColor = (suite: string) => {
    switch (suite) {
      case 'HubTrack Pro': return 'from-blue-500 to-cyan-500';
      case 'GOKU': return 'from-orange-500 to-red-500';
      case 'GAMA': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart size={24} className="text-blue-600" />
            <span>Complete Your Purchase</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Items in Cart ({cartItems.length})</h3>
            {cartItems.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="border-0 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getSuiteColor(item.suite)} text-white`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.suite} • {item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{item.price || 0}</div>
                        <div className="flex space-x-1">
                          {item.isPremium && <Badge className="bg-yellow-500"><Crown size={10} /></Badge>}
                          {item.isNew && <Badge className="bg-green-500">New</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Payment Summary</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{totalPrice}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxes & Fees:</span>
                <span className="font-medium text-green-600">₹0 (Included)</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">₹{totalPrice}</span>
              </div>
            </div>

            {/* Credits Info */}
            <Card className={`border-2 ${canAfford ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Crown size={20} className="text-yellow-500" />
                    <span className="font-medium">Your Credits</span>
                  </div>
                  <span className="text-lg font-bold">₹{userCredits}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">After purchase:</span>
                    <span className={`font-medium ${remainingCredits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{remainingCredits}
                    </span>
                  </div>
                  
                  {!canAfford && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertTriangle size={16} />
                      <span>Insufficient credits. You need ₹{Math.abs(remainingCredits)} more.</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What you get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500" />
                <span>Instant activation</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500" />
                <span>Premium support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500" />
                <span>Regular updates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500" />
                <span>30-day money back</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <div className="flex space-x-3 w-full">
            <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
              Cancel
            </Button>
            
            {!canAfford ? (
              <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <CreditCard size={16} className="mr-2" />
                Add Credits
              </Button>
            ) : (
              <Button onClick={handlePurchaseAll} disabled={isProcessing || cartItems.length === 0} 
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Zap size={16} className="mr-2" />
                    Purchase Now (₹{totalPrice})
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};