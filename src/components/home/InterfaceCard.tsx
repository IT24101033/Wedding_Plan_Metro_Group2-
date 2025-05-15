
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface InterfaceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientClasses: string;
  loginPath: string;
  registerPath?: string;
  loginButtonText: string;
  registerButtonText?: string;
  loginButtonClass: string;
  registerButtonClass?: string;
  isActive: boolean;
  onClick: () => void;
}

const InterfaceCard: React.FC<InterfaceCardProps> = ({
  title,
  description,
  icon,
  gradientClasses,
  loginPath,
  registerPath,
  loginButtonText,
  registerButtonText,
  loginButtonClass,
  registerButtonClass,
  isActive,
  onClick,
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full ${
        isActive ? 'ring-2 ring-wedding-gold' : ''
      }`}
      onClick={onClick}
    >
      <div className={`h-48 ${gradientClasses} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="p-8">
        <h3 className="font-display text-2xl font-bold text-wedding-navy mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <div className="flex flex-col space-y-3 mt-auto">
          <Link to={loginPath} className="block">
            <button className={`w-full ${loginButtonClass} px-6 py-3 rounded-md transition-colors`}>
              {loginButtonText}
            </button>
          </Link>
          {registerPath && registerButtonText && registerButtonClass && (
            <Link to={registerPath} className="block">
              <button className={`w-full ${registerButtonClass} px-6 py-3 rounded-md transition-colors`}>
                {registerButtonText}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterfaceCard;
