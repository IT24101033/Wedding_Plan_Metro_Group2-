
import React from "react";
import { Link } from "react-router-dom";
import { useBookings } from "@/contexts/BookingContext";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const JavaBanner = () => {
  const { useJavaBackend, toggleBackend } = useBookings();
  const { toast } = useToast();

  const handleToggleBackend = () => {
    toggleBackend();
    toast({
      title: `Backend Changed`,
      description: `Now using ${!useJavaBackend ? 'Java backend' : 'local storage'} for bookings`,
    });
  };

  return (
    <div className="bg-wedding-navy text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wedding-gold">
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-white">Our wedding services are now fully powered by a Java backend!</p>
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2">Enable Java Backend:</span>
                <Switch
                  checked={useJavaBackend}
                  onCheckedChange={handleToggleBackend}
                  className="data-[state=checked]:bg-wedding-gold"
                />
                <span className="text-sm ml-2">{useJavaBackend ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link to="/user/vendors">
              <button className="bg-wedding-gold hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium text-sm transition-all">
                Browse Vendors
              </button>
            </Link>
            <Link to="/user/payment/booking1">
              <button className="bg-white hover:bg-opacity-90 text-wedding-navy px-4 py-2 rounded-md font-medium text-sm transition-all">
                Test Payment
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JavaBanner;
