import React, { useState } from 'react';
import { CVData, PersonalInfo, EmploymentHistory, Education, Skill, Language, Project, Certification } from '../types/cv';
import { PersonalInfoEditor } from './PersonalInfoEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { LanguageEditor } from './LanguageEditor';
import { ProjectEditor } from './ProjectEditor';
import { CertificationEditor } from './CertificationEditor';

interface CVEditorProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({
  cvData,
  onDataChange,
}) => {
  // Collapsible state for each section
  const [openSections, setOpenSections] = useState({
    personal: false,
    experience: false,
    education: false,
    skills: false,
    languages: false,
    projects: false,
    certifications: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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

  const updateLanguages = (languages: Language[]) => {
    onDataChange({ ...cvData, languages_spoken: languages });
  };

  const updateProjects = (projects: Project[]) => {
    onDataChange({ ...cvData, projects });
  };

  const updateCertifications = (certifications: Certification[]) => {
    onDataChange({ ...cvData, certifications });
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

  // Prepare languages array from cvData.languages_spoken (filter out strings)
  const languages: Language[] = (cvData.languages_spoken || []).filter(l => typeof l === 'object') as Language[];


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">CV Editor</h2>
          <p className="text-slate-600 mt-1">Customize your CV sections below</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Info Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('personal')}
            >
              <span className="font-semibold text-slate-700">Personal Information</span>
              <span className="text-lg">{openSections.personal ? '▲' : '▼'}</span>
            </button>
            {openSections.personal && (
              <div className="pt-2">
                <PersonalInfoEditor
                  personalInfo={personalInfo}
                  onChange={updatePersonalInfo}
                />
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('experience')}
            >
              <span className="font-semibold text-slate-700">Work Experience</span>
              <span className="text-lg">{openSections.experience ? '▲' : '▼'}</span>
            </button>
            {openSections.experience && (
              <div className="pt-2">
                <ExperienceEditor
                  experience={cvData.experience || []}
                  onChange={updateExperience}
                />
              </div>
            )}
          </div>

          {/* Education Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('education')}
            >
              <span className="font-semibold text-slate-700">Education</span>
              <span className="text-lg">{openSections.education ? '▲' : '▼'}</span>
            </button>
            {openSections.education && (
              <div className="pt-2">
                <EducationEditor
                  education={cvData.education || []}
                  onChange={updateEducation}
                />
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('skills')}
            >
              <span className="font-semibold text-slate-700">Skills</span>
              <span className="text-lg">{openSections.skills ? '▲' : '▼'}</span>
            </button>
            {openSections.skills && (
              <div className="pt-2">
                <SkillsEditor
                  skills={cvData.skills||[]}
                  onChange={updateSkills}
                />
              </div>
            )}
          </div>

          {/* Languages Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('languages')}
            >
              <span className="font-semibold text-slate-700">Languages</span>
              <span className="text-lg">{openSections.languages ? '▲' : '▼'}</span>
            </button>
            {openSections.languages && (
              <div className="pt-2">
                <LanguageEditor
                  languages={languages}
                  onChange={updateLanguages}
                />
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('projects')}
            >
              <span className="font-semibold text-slate-700">Projects</span>
              <span className="text-lg">{openSections.projects ? '▲' : '▼'}</span>
            </button>
            {openSections.projects && (
              <div className="pt-2">
                <ProjectEditor
                  projects={cvData.projects || []}
                  onChange={updateProjects}
                />
              </div>
            )}
          </div>

          {/* Certifications Section */}
          <div>
            <button
              type="button"
              className="flex items-center w-full justify-between px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 transition mb-2"
              onClick={() => toggleSection('certifications')}
            >
              <span className="font-semibold text-slate-700">Certifications</span>
              <span className="text-lg">{openSections.certifications ? '▲' : '▼'}</span>
            </button>
            {openSections.certifications && (
              <div className="pt-2">
                <CertificationEditor
                  certifications={cvData.certifications || []}
                  onChange={updateCertifications}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};