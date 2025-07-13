import React, { useState } from 'react';
import { Education } from '../types/cv';
import { GraduationCap, Plus, Trash2, Calendar } from 'lucide-react';

interface EducationEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({
  education,
  onChange,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const addEducation = () => {
    const newEducation: Education = {
      degree: '',
      field: '',
      institution: '',
      start_date: '',
      end_date: '',
    };
    onChange([...(education || []), newEducation]);
    setOpenIndex(education.length); // Open the new entry
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange(newEducation);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
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
          <GraduationCap className="w-5 h-5" />
          Education
        </h3>
        <button
          onClick={addEducation}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => {
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
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-800">
                      {edu.institution || <span className="italic text-slate-400">Institution</span>}
                    </div>
                    <div className="text-slate-600 text-sm">
                      {edu.degree || <span className="italic text-slate-400">Degree</span>}
                      {edu.field ? `, ${edu.field}` : ''}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {edu.start_date ? edu.start_date : 'Start'}
                      {edu.end_date ? ` - ${edu.end_date}` : ' - End'}
                    </div>
                  </div>
                </div>
                <Chevron open={isOpen} />
              </button>

              {/* Editable Form (only if open) */}
              {isOpen && (
                <div className="p-6 pt-0">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-md font-medium text-slate-800">Education Entry</h4>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="University Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Field of Study (Optional)
                      </label>
                      <input
                        type="text"
                        value={edu.field || ''}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Computer Science, Business, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={edu.start_date}
                        onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={edu.end_date}
                        onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Leave empty if currently studying"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {education.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No education entries added yet. Click "Add Education" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};