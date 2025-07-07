import React from 'react';
import { CVData, PersonalInfo, EmploymentHistory, Education, Skill } from '../types/cv';
import { PersonalInfoEditor } from './PersonalInfoEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';

interface CVEditorProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({
  cvData,
  onDataChange,
}) => {
  const updatePersonalInfo = (personalInfo: PersonalInfo) => {
    onDataChange({ 
      ...cvData, 
      first_name: personalInfo.first_name || '',
      last_name: personalInfo.last_name || '',
      title: personalInfo.title || '',
      summary: personalInfo.summary || '',
      contact: personalInfo.contact || {
        location: '',
        phone: '',
        email: '',
        links: {},
      },
    });
  };

  const updateExperience = (experience: EmploymentHistory[]) => {
    onDataChange({ ...cvData, experience: experience || [] });
  };

  const updateEducation = (education: Education[]) => {
    onDataChange({ ...cvData, education: education || [] });
  };

  const updateSkills = (skills: Skill[]) => {
    onDataChange({ ...cvData, skills: skills });
  };

  // Create PersonalInfo object from CVData with safe defaults
  const personalInfo: PersonalInfo = {
    first_name: cvData.first_name || '',
    last_name: cvData.last_name || '',
    title: cvData.title || '',
    summary: cvData.summary || '',
    contact: cvData.contact || {
      location: '',
      phone: '',
      email: '',
      links: {},
    },
  };


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">CV Editor</h2>
          <p className="text-slate-600 mt-1">Customize your CV sections below</p>
        </div>

        <div className="p-6 space-y-8">
          <PersonalInfoEditor
            personalInfo={personalInfo}
            onChange={updatePersonalInfo}
          />

          <ExperienceEditor
            experience={cvData.experience || []}
            onChange={updateExperience}
          />

          <EducationEditor
            education={cvData.education || []}
            onChange={updateEducation}
          />

          <SkillsEditor
            skills={cvData.skills||[]}
            onChange={updateSkills}
          />
        </div>
      </div>
    </div>
  );
};