import React, { useState } from 'react';
import { Skill } from '../types/cv';
import { Award, Plus, Trash2 } from 'lucide-react';

interface SkillsEditorProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  onChange,
}) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  console.log(skills)
  // Add a new skill category
  const addCategory = () => {
    const newCategory: Skill = {
      category: '',
      skills: [''],
      level: 'Intermediate',
    };
    onChange([...(skills || []), newCategory]);
  };

  // Update a field in a skill category
  const updateCategory = (index: number, field: keyof Skill, value: string) => {
    const newSkills = [...(skills || [])];
    if (field === 'skills') return; // Prevent direct editing of skills array here
    newSkills[index] = { ...newSkills[index], [field]: value };
    onChange(newSkills);
  };

  // Remove a skill category
  const removeCategory = (index: number) => {
    onChange((skills || []).filter((_, i) => i !== index));
  };

  // Add a new skill string to a category
  const addSkillToCategory = (catIndex: number) => {
    const newSkills = [...(skills || [])];
    newSkills[catIndex] = {
      ...newSkills[catIndex],
      skills: [...(newSkills[catIndex].skills || []), ''],
    };
    onChange(newSkills);
  };

  // Update a skill string in a category
  const updateSkillInCategory = (catIndex: number, skillIndex: number, value: string) => {
    const newSkills = [...(skills || [])];
    const updatedSkillList = [...(newSkills[catIndex].skills || [])];
    updatedSkillList[skillIndex] = value;
    newSkills[catIndex] = {
      ...newSkills[catIndex],
      skills: updatedSkillList,
    };
    onChange(newSkills);
  };

  // Remove a skill string from a category
  const removeSkillFromCategory = (catIndex: number, skillIndex: number) => {
    const newSkills = [...(skills || [])];
    const updatedSkillList = (newSkills[catIndex].skills || []).filter((_, i) => i !== skillIndex);
    newSkills[catIndex] = {
      ...newSkills[catIndex],
      skills: updatedSkillList,
    };
    onChange(newSkills);
  };

  // Toggle expand/collapse for a category
  const toggleCategory = (index: number) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Skills
        </h3>
        <button
          onClick={addCategory}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-6">
        {(skills || []).map((skillObj, catIndex) => {
          const isExpanded = expanded.has(catIndex);
          return (
            <div
              key={catIndex}
              className="p-0 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden"
            >
              {/* Collapsed Header */}
              <div
                className={`flex justify-between items-center px-6 py-4 cursor-pointer select-none ${isExpanded ? 'bg-slate-100' : ''}`}
                onClick={() => toggleCategory(catIndex)}
              >
                <div className="font-medium text-slate-800">
                  {skillObj.category || 'Skill Category'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); removeCategory(catIndex); }}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Remove Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                </div>
              </div>

              {/* Expanded Form */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={skillObj.category || ''}
                      onChange={(e) => updateCategory(catIndex, 'category', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      placeholder="Category (e.g. Programming Languages)"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Skill Level
                    </label>
                    <select
                      value={skillObj.level || 'Intermediate'}
                      onChange={(e) => updateCategory(catIndex, 'level', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Skills in this Category
                    </label>
                    {(skillObj.skills || []).map((skill: string, skillIndex: number) => (
                      <div key={skillIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkillInCategory(catIndex, skillIndex, e.target.value)}
                          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          placeholder="Skill (e.g. JavaScript)"
                        />
                        <button
                          onClick={() => removeSkillFromCategory(catIndex, skillIndex)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addSkillToCategory(catIndex)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs mt-1"
                    >
                      <Plus className="w-3 h-3 inline-block mr-1" /> Add Skill
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(!skills || skills.length === 0) && (
        <div className="text-center py-8 text-slate-500">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No skill categories added yet. Click "Add Category" to get started.</p>
        </div>
      )}
    </div>
  );
};