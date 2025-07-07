import React from 'react';
import { FileText, Plus } from 'lucide-react';

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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">CV Customizer</h1>
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