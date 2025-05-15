
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface JavaPaymentConfirmationProps {
  success: boolean;
  bookingId?: string;
  amount?: number;
  vendorName?: string;
  serviceName?: string;
  message?: string;
}

const JavaPaymentConfirmation = ({
  success = true,
  bookingId = "booking1",
  amount = 0,
  vendorName = "Vendor",
  serviceName = "Service",
  message
}: JavaPaymentConfirmationProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {success ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
        </div>
        <CardTitle className="text-center text-2xl">
          {success ? "Payment Successful" : "Payment Failed"}
        </CardTitle>
        <CardDescription className="text-center">
          {message || (success 
            ? "Your payment has been processed successfully." 
            : "There was an issue processing your payment.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && bookingId && (
          <>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-medium">{bookingId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Vendor</span>
              <span className="font-medium">{vendorName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Service</span>
              <span className="font-medium">{serviceName}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-800 font-semibold">Amount Paid</span>
              <span className="text-xl font-bold">${amount.toFixed(2)}</span>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {success ? (
          <>
            <Link to="/user/bookings">
              <Button>View My Bookings</Button>
            </Link>
            <Link to="/user/vendors">
              <Button variant="outline">Browse More Vendors</Button>
            </Link>
          </>
        ) : (
          <>
            <Button variant="destructive" onClick={() => window.history.back()}>
              Try Again
            </Button>
            <Link to="/user/bookings">
              <Button variant="outline">My Bookings</Button>
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default JavaPaymentConfirmation;
