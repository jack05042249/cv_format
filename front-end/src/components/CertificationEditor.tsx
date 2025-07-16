import React, { useState } from 'react';
import { Certification } from '../types/cv';
import { LucideBookOpenText, Plus, Trash2, Calendar } from 'lucide-react';

interface CertificationEditorProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export const CertificationEditor: React.FC<CertificationEditorProps> = ({
  certifications,
  onChange,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const addCertification = () => {
    const newCertification: Certification = {
      name: '',
      issuer: '',
      date: '',
    };
    onChange([...(certifications || []), newCertification]);
    setOpenIndex(certifications.length); // Open the new entry
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    onChange(newCertifications);
  };

  const removeCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex && openIndex > index) setOpenIndex(openIndex - 1);
  };

  const Chevron = ({ open }: { open: boolean }) => (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
          <LucideBookOpenText className="w-5 h-5" />
          Certifications
        </h3>
        <button
          onClick={addCertification}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>
      <div className="space-y-6">
        {certifications.map((cert, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 rounded-lg bg-slate-50"
            >
              {/* Summary Row (always visible, clickable) */}
              <button
                type="button"
                className={`w-full flex items-center justify-between p-4 focus:outline-none ${isOpen ? 'bg-slate-100' : ''}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center gap-3 text-left">
                  <LucideBookOpenText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-800">
                      {cert.name || <span className="italic text-slate-400">Certification</span>}
                    </div>
                    <div className="text-slate-600 text-sm">
                      {cert.issuer || <span className="italic text-slate-400">Issuer</span>}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {cert.date ? cert.date : 'Date'}
                    </div>
                  </div>
                </div>
                <Chevron open={isOpen} />
              </button>
              {/* Editable Form (only if open) */}
              {isOpen && (
                <div className="p-6 pt-0">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-md font-medium text-slate-800">Certification Entry</h4>
                    <button
                      onClick={() => removeCertification(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={cert.name || ''}
                        onChange={e => updateCertification(index, 'name', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="e.g. AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer || ''}
                        onChange={e => updateCertification(index, 'issuer', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Date
                      </label>
                      <input
                        type="month"
                        value={cert.date || ''}
                        onChange={e => updateCertification(index, 'date', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {(!certifications || certifications.length === 0) && (
        <div className="text-center py-8 text-slate-500">
          <LucideBookOpenText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No certifications added yet. Click "Add Certification" to get started.</p>
        </div>
      )}
    </div>
  );
}; 