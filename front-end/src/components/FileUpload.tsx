import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
  uploadError?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, uploadError }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors duration-200 bg-white"
        onDrop={isLoading ? undefined : handleDrop}
        onDragOver={isLoading ? undefined : (e) => e.preventDefault()}
        style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Upload Your CV
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your CV file here, or click to browse
            </p>
          </div>

          <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {isLoading ? 'Processing...' : 'Choose File'}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              disabled={isLoading}
            />
          </label>

          {uploadError && (
            <div className="text-red-600 text-sm mt-2">{uploadError}</div>
          )}

          <p className="text-sm text-slate-500">
            Support for PDF, DOC, and DOCX files
          </p>
        </div>
      </div>
    </div>
  );
};