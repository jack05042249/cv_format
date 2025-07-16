import React from 'react';
import { CVData, GenerationOptions, DownloadOption } from '../types/cv';
import { Download, User, UserCheck, UserX } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

interface DownloadPanelProps {
  cvData: CVData;
  options: GenerationOptions;
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({ cvData, options }) => {
  const generateFilename = (downloadOption: DownloadOption) => {
    const firstName = cvData.first_name || '';
    const lastName = cvData.last_name || '';
    const position = cvData.title || '';
    
    if (!firstName || !lastName) {
      return `Professional_${position}_CV.pdf`;
    }

    switch (downloadOption) {
      case 'full':
        return `${firstName}_${lastName}_${position}_CV.pdf`;
      case 'name_only':
        return `${firstName}_${lastName}_${position}_CV.pdf`;
      case 'name_initial':
        return `${firstName}_${lastName.charAt(0)}_${position}_CV.pdf`;
      default:
        return 'CV.pdf';
    }
  };

  const handleDownload = async (downloadOption: DownloadOption) => {
    try {
      const filename = generateFilename(downloadOption);
      let includePersonalInfo = false
      let includePrivateInfo = false
      
      if (downloadOption == "full"){
        includePersonalInfo = true
        includePrivateInfo = true
      } else {
        if (downloadOption == 'name_only' || downloadOption == 'name_initial') {
          includePersonalInfo = true
        }
      }

      const downloadOptions = {
        ...options,
        includePersonalInfo,
        includePrivateInfo,
        downloadOption,
      };
      
      await generatePDF(cvData, downloadOptions, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast notification here
    }
  };

  // Check if we have valid CV data
  const hasValidData = cvData && (cvData.first_name || cvData.last_name || cvData.title);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Download Options
      </h3>

      {!hasValidData && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-sm text-yellow-800">
            Please ensure you have entered at least a name or title before downloading.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Option A: Full info (name, contact info) */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Full Information CV</span>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Download CV with complete personal and contact information
          </p>
          <button
            onClick={() => handleDownload('full')}
            disabled={!hasValidData}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Download Full CV
          </button>
        </div>

        {/* Option B: First name, Last name (no contact info) */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Name Only CV</span>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Download CV with first and last name, but no contact information
          </p>
          <button
            onClick={() => handleDownload('name_only')}
            disabled={!hasValidData}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Download Name Only CV
          </button>
        </div>

        {/* Option C: First Name, Last name first letter (no contact info) */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">Initial CV</span>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Download CV with first name and last name initial, no contact information
          </p>
          <button
            onClick={() => handleDownload('name_initial')}
            disabled={!hasValidData}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Download Initial CV
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-800">
          <strong>Filename formats:</strong><br />
          • Full: {generateFilename('full')}<br />
          • Name Only: {generateFilename('name_only')}<br />
          • Initial: {generateFilename('name_initial')}
        </p>
      </div>
    </div>
  );
};