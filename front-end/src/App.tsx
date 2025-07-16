import React from 'react';
import { FileUpload } from './components/FileUpload';
import { CVEditor } from './components/CVEditor';
import { CVPreview } from './components/CVPreview';
import { DownloadPanel } from './components/DownloadPanel';
import { Header } from './components/Header';
import { useCVData } from './hooks/useCVData';
import { FileText, Settings } from 'lucide-react';

function App() {
  const {
    cvData,
    setCVData,
    generationOptions,
    isLoaded,
    loadCVFromFile,
    uploadLoading,
    uploadError,
  } = useCVData();

  // Show file upload screen if no CV is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header showNewCVButton={false} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800">Welcome to CV Customizer!</h1>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Upload, customize, and generate professional CVs with company branding. 
              Create multiple versions with different privacy settings.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FileUpload onFileUpload={loadCVFromFile} isLoading={uploadLoading} uploadError={uploadError} />
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Professional Templates</h3>
                  <p className="text-sm text-slate-600">
                    Generate PDFs with company branding and professional formatting
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Privacy Controls</h3>
                  <p className="text-sm text-slate-600">
                    Choose what personal information to include in your CV
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Multiple Formats</h3>
                  <p className="text-sm text-slate-600">
                    Download with full names or abbreviated versions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main CV editor interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header showNewCVButton={true} />
      
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">CV Customizer</h1>
          </div>
          <p className="text-slate-600">
            Customize your CV and generate professional PDFs with company branding
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          
          <div className="space-y-6">

            <DownloadPanel
              cvData={cvData}
              options={generationOptions}
            />

            <CVEditor
              cvData={cvData}
              onDataChange={setCVData}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Live Preview</h2>
                <p className="text-slate-600">
                  This is how your CV will appear in the generated PDF (A4 format)
                </p>
              </div>
              
              {/* Full width preview without padding */}
              <div className="w-full overflow-auto bg-gray-100">
                <CVPreview cvData={cvData} options={generationOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;