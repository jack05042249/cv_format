import React, { useState } from 'react';
import { Project } from '../types/cv';
import { Plus, Trash2, Briefcase } from 'lucide-react';

interface ProjectEditorProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projects,
  onChange,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // State to track expanded projects
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  // Add a new project
  const addProject = () => {
    const newProject: Project = {
      project_name: '',
      organization: '',
      start_date: '',
      end_date: '',
      description: '',
    };
    onChange([...(projects || []), newProject]);
    setExpandedIndexes([...(expandedIndexes || []), (projects?.length || 0)]); // Expand the new project
  };

  // Update a field in a project
  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...(projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange(newProjects);
  };

  // Remove a project
  const removeProject = (index: number) => {
    onChange((projects || []).filter((_, i) => i !== index));
    setExpandedIndexes((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex && openIndex > index) setOpenIndex(openIndex - 1);
  };

  // Toggle expand/collapse
  const toggleExpand = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    setExpandedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Projects
        </h3>
        <button
          onClick={addProject}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {(projects || []).map((project, index) => {
          const isExpanded = expandedIndexes.includes(index);
          return (
            <div
              key={index}
              className="p-0 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden"
            >
              {/* Collapsible Header */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">
                    {project.project_name?.trim() || 'Untitled Project'}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">
                    {project.organization?.trim() ? `@ ${project.organization}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(index);
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className={`transition-transform duration-200 ${openIndex === index ? 'rotate-90' : ''}`}>▶</span>
                </div>
              </div>
              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.project_name || ''}
                        onChange={(e) => updateProject(index, 'project_name', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Project Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={project.organization || ''}
                        onChange={(e) => updateProject(index, 'organization', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Organization (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={project.start_date || ''}
                        onChange={(e) => updateProject(index, 'start_date', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Start Date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={project.end_date || ''}
                        onChange={(e) => updateProject(index, 'end_date', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="End Date or leave blank for Present"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={project.description || ''}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Project Description"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(!projects || projects.length === 0) && (
        <div className="text-center py-8 text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      )}
    </div>
  );
}; 