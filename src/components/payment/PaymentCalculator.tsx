
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PaymentBreakdown {
  baseAmount: number;
  discountAmount: number;
  subtotal: number;
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
}

const PaymentCalculator = () => {
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [applyTax, setApplyTax] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [breakdown, setBreakdown] = useState<PaymentBreakdown | null>(null);
  const { toast } = useToast();

  const calculatePayment = async () => {
    if (baseAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('baseAmount', baseAmount.toString());
      if (discountCode) {
        params.append('discountCode', discountCode);
      }
      params.append('applyTax', applyTax.toString());

      // Make request to the Java backend
      const response = await fetch(`/api/payment/calculate?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to calculate payment');
      }

      const result = await response.json();
      setBreakdown(result);
      
      toast({
        title: "Calculation Complete",
        description: "Payment details have been calculated successfully",
      });
    } catch (error) {
      console.error("Payment calculation error:", error);
      toast({
        title: "Calculation Failed",
        description: "Could not calculate payment details. Please try again.",
        variant: "destructive",
      });
      
      // For demo purposes, set mock data if backend is not available
      setBreakdown({
        baseAmount: baseAmount,
        discountAmount: discountCode ? baseAmount * 0.1 : 0,
        subtotal: baseAmount - (discountCode ? baseAmount * 0.1 : 0),
        platformFee: (baseAmount - (discountCode ? baseAmount * 0.1 : 0)) * 0.05,
        taxAmount: applyTax ? (baseAmount - (discountCode ? baseAmount * 0.1 : 0)) * 0.08 : 0,
        totalAmount: 
          (baseAmount - (discountCode ? baseAmount * 0.1 : 0)) + 
          ((baseAmount - (discountCode ? baseAmount * 0.1 : 0)) * 0.05) + 
          (applyTax ? (baseAmount - (discountCode ? baseAmount * 0.1 : 0)) * 0.08 : 0)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-2xl text-primary font-bold">Payment Calculator</CardTitle>
        <CardDescription className="text-foreground/80 text-base">Calculate total payment with fees and taxes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground font-medium">Base Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={baseAmount || ''}
            onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
            className="col-span-3 border-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discountCode" className="text-foreground font-medium">Discount Code (Optional)</Label>
          <Input
            id="discountCode"
            placeholder="WEDDING10, WEDDING20, WELCOME"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="border-2"
          />
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="tax"
            checked={applyTax}
            onCheckedChange={setApplyTax}
          />
          <Label htmlFor="tax" className="text-foreground font-medium">Apply Tax (8%)</Label>
        </div>
        
        <Button 
          onClick={calculatePayment} 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 text-base"
          disabled={loading || baseAmount <= 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            'Calculate Total'
          )}
        </Button>
        
        {breakdown && (
          <div className="mt-4 space-y-2 border-t pt-4">
            <h3 className="font-medium text-lg text-primary">Payment Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-foreground font-medium">Base Amount:</span>
              <span className="text-right font-bold">${breakdown.baseAmount.toFixed(2)}</span>
              
              <span className="text-foreground font-medium">Discount:</span>
              <span className="text-right font-bold text-green-600">-${breakdown.discountAmount.toFixed(2)}</span>
              
              <span className="text-foreground font-medium">Subtotal:</span>
              <span className="text-right font-bold">${breakdown.subtotal.toFixed(2)}</span>
              
              <span className="text-foreground font-medium">Platform Fee (5%):</span>
              <span className="text-right font-bold">${breakdown.platformFee.toFixed(2)}</span>
              
              <span className="text-foreground font-medium">Tax:</span>
              <span className="text-right font-bold">${breakdown.taxAmount.toFixed(2)}</span>
              
              <span className="font-medium text-primary text-base">Total Amount:</span>
              <span className="text-right font-bold text-lg">${breakdown.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCalculator;
