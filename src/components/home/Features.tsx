
import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, ShoppingBag, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Heart className="h-10 w-10 text-wedding-gold" />,
      title: "Find Your Perfect Match",
      description: "Browse hundreds of wedding vendors filtered by your preferences and budget"
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-wedding-gold" />,
      title: "Book Services Online",
      description: "Schedule appointments, make reservations, and secure the best vendors in minutes"
    },
    {
      icon: <Users className="h-10 w-10 text-wedding-gold" />,
      title: "Vendor Collaboration",
      description: "Connect directly with your vendors through our messaging platform"
    },
    {
      icon: <Shield className="h-10 w-10 text-wedding-gold" />,
      title: "Secure Payments",
      description: "Make deposits and payments safely through our protected payment system"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-wedding-navy mb-4">
            Plan Your Special Day With Ease
          </h2>
          <p className="text-gray-600">
            Our comprehensive platform makes wedding planning simple, organized, and stress-free
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-wedding-blush bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-wedding-navy mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
