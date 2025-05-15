
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-wedding-navy text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0 max-w-sm">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-wedding-gold mr-2" />
              <span className="text-2xl font-display font-bold">Wedding Vendor Liaison</span>
            </div>
            <p className="text-gray-300 mb-4">
              Making wedding planning easier by connecting couples with the perfect vendors for their special day.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-lg font-medium mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/user" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/user/vendors" className="text-gray-300 hover:text-white transition-colors">Find Vendors</Link></li>
                <li><Link to="/user/bookings" className="text-gray-300 hover:text-white transition-colors">My Bookings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display text-lg font-medium mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/user/help-center" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/user/contact-us" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/user/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wedding Vendor Liaison. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
