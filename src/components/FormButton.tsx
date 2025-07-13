import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import FormModal from './FormModal';

interface FormButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

const FormButton: React.FC<FormButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#194fe8] hover:bg-[#1640c7] text-white';
      case 'secondary':
        return 'bg-white text-[#194fe8] hover:bg-gray-50 border border-[#194fe8]';
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:border-[#194fe8] hover:text-[#194fe8] bg-transparent';
      default:
        return 'bg-[#194fe8] hover:bg-[#1640c7] text-white';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${className || getButtonStyles()}`}
      >
        {children}
      </button>
      
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sourceUrl={window.location.href}
      />
    </>
  );
};

export default FormButton;