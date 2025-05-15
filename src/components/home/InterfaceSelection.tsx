
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, ShoppingBag, Shield } from "lucide-react";
import InterfaceCard from "./InterfaceCard";

const InterfaceSelection = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const interfaceCards = [
    {
      id: 'user',
      title: 'For Couples',
      description: 'Find and book the perfect vendors for your special day. Browse services, read reviews, and manage your wedding planning in one place.',
      icon: <Users className="h-20 w-20 text-wedding-navy opacity-30" />,
      gradientClasses: 'bg-gradient-to-r from-wedding-blush to-white',
      loginPath: '/user/login',
      registerPath: '/user/register',
      loginButtonText: 'Login as Couple',
      registerButtonText: 'Register as Couple',
      loginButtonClass: 'bg-wedding-navy hover:bg-opacity-90 text-white',
      registerButtonClass: 'border border-wedding-navy text-wedding-navy hover:bg-wedding-navy/10'
    },
    {
      id: 'vendor',
      title: 'For Vendors',
      description: 'Showcase your services to engaged couples. Manage your business profile, service offerings, and bookings efficiently.',
      icon: <ShoppingBag className="h-20 w-20 text-wedding-gold opacity-30" />,
      gradientClasses: 'bg-gradient-to-r from-wedding-gold/20 to-white',
      loginPath: '/vendor/login',
      registerPath: '/vendor/register',
      loginButtonText: 'Login as Vendor',
      registerButtonText: 'Register as Vendor',
      loginButtonClass: 'bg-wedding-gold hover:bg-opacity-90 text-white',
      registerButtonClass: 'border border-wedding-gold text-wedding-gold hover:bg-wedding-gold/10'
    },
    {
      id: 'admin',
      title: 'For Administrators',
      description: 'Manage the entire platform. Approve vendors, oversee bookings, and ensure smooth operations of the wedding planning system.',
      icon: <Shield className="h-20 w-20 text-wedding-navy opacity-30" />,
      gradientClasses: 'bg-gradient-to-r from-wedding-navy/10 to-white',
      loginPath: '/admin/login',
      loginButtonText: 'Admin Access',
      loginButtonClass: 'bg-wedding-navy hover:bg-opacity-90 text-white'
    }
  ];

  return (
    <motion.section 
      className="py-20 bg-wedding-light"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-wedding-navy mb-4">
            Choose Your Journey
          </h2>
          <p className="text-gray-600">
            Whether you're planning your wedding, offering vendor services, or managing the platform,
            we have the perfect interface for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {interfaceCards.map((card) => (
            <motion.div 
              key={card.id}
              className="relative"
              variants={itemVariants}
            >
              <InterfaceCard
                title={card.title}
                description={card.description}
                icon={card.icon}
                gradientClasses={card.gradientClasses}
                loginPath={card.loginPath}
                registerPath={card.registerPath}
                loginButtonText={card.loginButtonText}
                registerButtonText={card.registerButtonText}
                loginButtonClass={card.loginButtonClass}
                registerButtonClass={card.registerButtonClass}
                isActive={activeCard === card.id}
                onClick={() => setActiveCard(card.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default InterfaceSelection;
