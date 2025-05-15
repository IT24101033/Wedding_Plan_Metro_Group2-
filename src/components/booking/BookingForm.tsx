import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookings } from '@/contexts/BookingContext';
import JavaBackendService from '@/services/JavaBackendService';

interface BookingFormProps {
  vendorId: string;
  vendorName: string;
  availableServices: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
  userId?: string;
  userName?: string;
}

const formSchema = z.object({
  serviceName: z.string({
    required_error: "Please select a service",
  }),
  serviceDate: z.date({
    required_error: "Please select a date",
  }),
  eventType: z.string({
    required_error: "Please specify the event type",
  }),
  notes: z.string().optional(),
  contactPhone: z.string().min(10, {
    message: "Phone number must be at least 10 digits",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email",
  }),
});

export const BookingForm: React.FC<BookingFormProps> = ({
  vendorId,
  vendorName,
  availableServices,
  userId = 'user1',
  userName = 'Demo Client',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addBooking, useJavaBackend } = useBookings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Find selected service
    const selectedService = availableServices.find(s => s.id === values.serviceName);
    
    if (!selectedService) {
      toast({
        title: "Error",
        description: "Selected service not found.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Create booking object with proper types
    const booking = {
      id: `booking${Date.now()}`,
      userId,
      userName,
      vendorId,
      vendorName,
      serviceName: selectedService.name,
      eventType: values.eventType,
      serviceDate: format(values.serviceDate, 'yyyy-MM-dd'),
      amount: selectedService.price,
      status: "pending" as "pending" | "confirmed" | "completed" | "cancelled",
      paymentStatus: "unpaid" as "pending" | "paid" | "refunded",
      notes: values.notes,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      if (useJavaBackend) {
        console.log("Using Java backend for booking creation");
        await JavaBackendService.createBooking({
          ...booking,
          amount: selectedService.price
        });
        toast({
          title: "Booking Created via Java Backend",
          description: "Your booking request has been submitted through our Java system. Proceeding to payment.",
        });
      } else {
        console.log("Using local storage for booking creation");
        // Use the BookingContext to add the booking
        addBooking(booking);
        toast({
          title: "Booking Created",
          description: "Your booking request has been submitted. Proceeding to payment.",
        });
      }
      
      // Navigate to payment page with booking data
      navigate(`/user/payment/${booking.id}`, { state: { booking } });
    } catch (error) {
      console.error("Booking creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getServicePrice = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    return service ? `$${service.price.toFixed(2)}` : '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-bold mb-2">Booking for {vendorName}</h2>
        <p className="text-muted-foreground">
          Please fill out the form below to request a booking.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="serviceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {getServicePrice(service.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="serviceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests/Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any special requests or notes here" 
                    className="resize-none" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
