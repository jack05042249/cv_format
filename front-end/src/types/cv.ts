export interface Contact {
  location?: string;
  phone?: string;
  email?: string;
  links?: {
    [key: string]: string | null | undefined;
  };
}

export interface PersonalInfo {
  first_name?: string;
  last_name?: string;
  title?: string;
  summary?: string;
  contact?: Contact;
}

export interface EmploymentHistory {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  summary?: string;
  description?: string[];
}

export interface Education {
  degree?: string;
  field?: string;
  institution?: string;
  start_date?: string;
  end_date?: string;
}

export interface Certification {
  name?: string;
  issuer?: string;
  date?: string;
}

export interface Skill {
  category: string;
  skills: string[];
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Course {
  title?: string;
  issuer?: string;
  date_awarded?: string;
}

export interface Language {
  language?: string;
  name?: string;
  level?: 'Basic' | 'Intermediate' | 'Advanced' | 'Native' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Upper Intermediate' | 'Elementary' | 'Beginner';
}

export interface Reference {
  name?: string;
  position?: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface Derived {
  years_of_experience?: number;
  approximate_age?: number;
}

export interface CVSection {
  id: string;
  title?: string;
  type?: 'personal' | 'experience' | 'education' | 'skills' | 'custom';
  enabled?: boolean;
  content?: Record<string, unknown>;
}

export interface InternshipOrVolunteering {
  involvement?: string;
  organization?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface Project {
  project_name?: string;
  organization?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface CVData {
  first_name?: string;
  last_name?: string;
  title?: string;
  contact?: Contact;
  summary?: string;
  education?: Education[];
  certifications?: Certification[];
  internship_volunteering?: InternshipOrVolunteering[];
  languages_spoken?: (string | Language)[];
  experience?: EmploymentHistory[];
  projects?: Project[];
  expertise?: Record<string, unknown>;
  skills?: Skill[];
}

// Type for nullable CV data (when API might return null)
export type NullableCVData = CVData | null;

export interface GenerationOptions {
  includePersonalInfo: boolean;
  includePrivateInfo: boolean;
  downloadOption?: DownloadOption;
}

export type DownloadOption = 'full' | 'name_only' | 'name_initial';