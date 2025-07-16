import React from 'react';
import { Plus } from 'lucide-react';
import Logo from '../img/Logo.svg';

interface HeaderProps {
  showNewCVButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showNewCVButton = false }) => {
  const handleNewCV = () => {
    // Reset CV data or navigate to new CV creation
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto lg:px-1 lg:py-1 px-2 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex">
            <img src={Logo} alt="Logo" className="lg:h-12 h-10 object-contain" />
          </div>
          
          
          {/* New CV Button - only show when in CV generation mode */}
          {showNewCVButton && (
            <button
              onClick={handleNewCV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              New CV for generation
            </button>
          )}
        </div>
      </div>
    </header>
  );
};