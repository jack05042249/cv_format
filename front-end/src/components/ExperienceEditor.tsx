import React, { useState } from 'react';
import { EmploymentHistory } from '../types/cv';
import { Briefcase, Plus, Trash2, Calendar, MapPin } from 'lucide-react';

interface ExperienceEditorProps {
  experience: EmploymentHistory[];
  onChange: (experience: EmploymentHistory[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experience,
  onChange,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience: EmploymentHistory = {
      title: '',
      company: '',
      location: '',
      type: '',
      start_date: '',
      end_date: '',
      summary: '',
      description: [],
    };
    onChange([...(experience || []), newExperience]);
    setOpenIndex((experience?.length || 0)); // Open the new entry
  };

  const updateExperience = (index: number, field: keyof EmploymentHistory, value: string | string[]) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange(newExperience);
  };

  const updateDescription = (index: number, description: string[]) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], description };
    onChange(newExperience);
  };

  const removeExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex && openIndex > index) setOpenIndex(openIndex - 1);
  };

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Work Experience
        </h3>
        <button
          onClick={addExperience}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="p-0 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden"
          >
            {/* Collapsed Header */}
            <div
              className={`flex justify-between items-center px-6 py-4 cursor-pointer select-none ${openIndex === index ? 'bg-slate-100' : ''}`}
              onClick={() => handleToggle(index)}
            >
              <div>
                <span className="font-medium text-slate-800">
                  {exp.company || 'Experience Entry'}
                </span>
                {exp.title && (
                  <span className="text-slate-500 ml-2">- {exp.title}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); removeExperience(index); }}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className={`transition-transform duration-200 ${openIndex === index ? 'rotate-90' : ''}`}>▶</span>
              </div>
            </div>

            {/* Expanded Form */}
            {openIndex === index && (
              <div className="px-6 pb-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Job Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Employment Type
                    </label>
                    <input
                      type="text"
                      value={exp.type || ''}
                      onChange={(e) => updateExperience(index, 'type', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Full-time, Part-time, Contract"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.start_date}
                      onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.end_date}
                      onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Leave empty for current position"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Summary (Optional)
                  </label>
                  <textarea
                    value={exp.summary || ''}
                    onChange={(e) => updateExperience(index, 'summary', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                    rows={2}
                    placeholder="Brief summary of the role..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Responsibilities (one per line)
                  </label>
                  <textarea
                    value={(exp.description || []).join('\n')}
                    onChange={(e) => updateDescription(index, e.target.value.split('\n').filter(resp => resp.trim()))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                    rows={4}
                    placeholder="Responsibility 1&#10;Responsibility 2&#10;Responsibility 3"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No work experience added yet. Click "Add Experience" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};