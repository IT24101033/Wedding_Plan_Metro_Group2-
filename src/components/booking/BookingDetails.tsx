
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface BookingDetailsProps {
  booking: {
    id: string;
    userId?: string;
    userName?: string;
    vendorId?: string;
    vendorName?: string;
    serviceName: string;
    eventType?: string;
    serviceDate: string;
    amount: number;
    status: string;
    paymentStatus: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  isVendorView?: boolean;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({
  booking,
  showActions = false,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  isVendorView = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  const renderStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        variant = "default";
        break;
      case 'completed':
        variant = "secondary";
        break;
      case 'cancelled':
      case 'rejected':
        variant = "destructive";
        break;
      case 'pending':
      default:
        variant = "outline";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };
  
  const renderPaymentStatusBadge = (paymentStatus: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        variant = "default";
        break;
      case 'refunded':
        variant = "secondary";
        break;
      case 'failed':
        variant = "destructive";
        break;
      case 'pending':
      case 'unpaid':
      default:
        variant = "outline";
    }
    
    return <Badge variant={variant}>{paymentStatus}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <CardTitle>Booking #{booking.id}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {renderStatusBadge(booking.status)}
            {renderPaymentStatusBadge(booking.paymentStatus)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Service Details</h3>
            <p className="font-medium">{booking.serviceName}</p>
            {booking.eventType && <p className="text-sm">{booking.eventType} Event</p>}
            <p className="text-sm mt-2">Date: {formatDate(booking.serviceDate)}</p>
            <p className="text-sm font-bold mt-1">Amount: ${booking.amount.toFixed(2)}</p>
          </div>
          
          <div>
            {isVendorView && booking.userName && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
                <p className="font-medium">{booking.userName}</p>
              </>
            )}
            
            {!isVendorView && booking.vendorName && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Vendor</h3>
                <p className="font-medium">{booking.vendorName}</p>
              </>
            )}
            
            {booking.notes && (
              <div className="mt-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}
            
            {booking.createdAt && (
              <p className="text-xs text-muted-foreground mt-3">
                Created: {formatDate(booking.createdAt)}
              </p>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-wrap justify-end gap-2 mt-6">
            {booking.status === 'pending' && isVendorView && onAccept && onReject && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onReject(booking.id)}
                >
                  Reject
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onAccept(booking.id)}
                >
                  Accept
                </Button>
              </>
            )}
            
            {booking.status === 'confirmed' && onComplete && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onComplete(booking.id)}
              >
                Mark as Completed
              </Button>
            )}
            
            {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onCancel(booking.id)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
