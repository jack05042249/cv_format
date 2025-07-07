import React, { useState } from 'react';
import { PersonalInfo, Contact } from '../types/cv';
import { User, Mail, Phone, MapPin, Plus, Trash2 } from 'lucide-react';

interface PersonalInfoEditorProps {
  personalInfo: PersonalInfo;
  onChange: (personalInfo: PersonalInfo) => void;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  personalInfo,
  onChange,
}) => {
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...personalInfo, [field]: value });
  };

  const updateContactField = (field: keyof Contact, value: string) => {
    const currentContact = personalInfo.contact || {
      location: '',
      phone: '',
      email: '',
      links: {},
    };
    onChange({
      ...personalInfo,
      contact: { ...currentContact, [field]: value }
    });
  };

  const updateLinksField = (field: string, value: string) => {
    const currentContact = personalInfo.contact || {
      location: '',
      phone: '',
      email: '',
      links: {},
    };
    const currentLinks = currentContact.links || {};
    onChange({
      ...personalInfo,
      contact: { 
        ...currentContact, 
        links: { 
          ...currentLinks, 
          [field]: value 
        } 
      }
    });
  };

  const addNewLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      updateLinksField(newLinkName.trim(), newLinkUrl.trim());
      setNewLinkName('');
      setNewLinkUrl('');
    }
  };

  const removeLink = (linkName: string) => {
    const currentContact = personalInfo.contact || {
      location: '',
      phone: '',
      email: '',
      links: {},
    };
    const currentLinks = currentContact.links || {};
    const remainingLinks = { ...currentLinks };
    delete remainingLinks[linkName];
    
    onChange({
      ...personalInfo,
      contact: { 
        ...currentContact, 
        links: remainingLinks 
      }
    });
  };

  const getCurrentLinks = () => {
    return personalInfo.contact?.links || {};
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
        <User className="w-5 h-5" />
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={personalInfo.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={personalInfo.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Doe"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Software Engineer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Professional Summary
          </label>
          <textarea
            value={personalInfo.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Professional summary..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <input
            type="text"
            value={personalInfo.contact?.location || ''}
            onChange={(e) => updateContactField('location', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="New York, United States"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            type="email"
            value={personalInfo.contact?.email || ''}
            onChange={(e) => updateContactField('email', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Phone className="w-4 h-4" />
            Phone
          </label>
          <input
            type="tel"
            value={personalInfo.contact?.phone || ''}
            onChange={(e) => updateContactField('phone', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Dynamic Links Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Links & Social Media
          </label>
          
          {/* Existing Links */}
          {Object.entries(getCurrentLinks()).map(([linkName, linkUrl]) => (
            <div key={linkName} className="flex gap-2 mb-2">
              <div className="flex-1 flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={linkName}
                    disabled
                    className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={linkUrl || ''}
                    onChange={(e) => updateLinksField(linkName, e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <button
                onClick={() => removeLink(linkName)}
                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add New Link */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Link name (e.g., LinkedIn, Telegram)"
              />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <button
              onClick={addNewLink}
              disabled={!newLinkName.trim() || !newLinkUrl.trim()}
              className="p-3 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add new link"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};