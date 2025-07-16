import React from 'react';
import { Language } from '../types/cv';
import { Languages, Plus, Trash2 } from 'lucide-react';

interface LanguageEditorProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

const LANGUAGE_LEVELS = {
  'A1 (Basic)':'A1', 'A2 (Beginner)':'A2', 'B1 (Intermediate)':'B1', 'B2 (Upper Intermediate)':'B2', 'C1 (Advanced)':'C1', 'C2 (Native)':'C2',
};

export const LanguageEditor: React.FC<LanguageEditorProps> = ({ languages, onChange }) => {
  // Add a new language
  const addLanguage = () => {
    onChange([...(languages || []), { name: '', level: 'Intermediate' }]);
  };

  // Update a language field
  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const newLanguages = [...(languages || [])];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    onChange(newLanguages);
  };

  // Remove a language
  const removeLanguage = (index: number) => {
    onChange((languages || []).filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
          {/* You can use an icon here if desired */}
          <Languages className="w-5 h-5" />
          Languages
        </h3>
        <button
          onClick={addLanguage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>
      <div className="space-y-6">
        {(languages || []).map((lang, idx) => (
          <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={lang.name || lang.language || ''}
                onChange={e => updateLanguage(idx, 'name', e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                placeholder="Language (e.g. English)"
              />
              <button
                onClick={() => removeLanguage(idx)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Proficiency Level</label>
              <select
                value={lang.level || 'Intermediate'}
                onChange={e => updateLanguage(idx, 'level', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {Object.keys(LANGUAGE_LEVELS).map(level => (
                  <option key={level} value={LANGUAGE_LEVELS[level as keyof typeof LANGUAGE_LEVELS]}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      {(!languages || languages.length === 0) && (
        <div className="text-center py-8 text-slate-500">
          <p>No languages added yet. Click "Add Language" to get started.</p>
        </div>
      )}
    </div>
  );
}; 