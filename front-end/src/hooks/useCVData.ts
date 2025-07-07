import { useState } from 'react';
import { CVData, GenerationOptions, NullableCVData } from '../types/cv';
import { uploadFile } from '../utils/api';

const initialCVData: CVData = {
  first_name: '',
  last_name: '',
  title: '',
  contact: {
    location: '',
    phone: '',
    email: '',
    links: {},
  },
  summary: '',
  education: [],
  certifications: [],
  internship_volunteering: [],
  languages_spoken: [],
  experience: [],
  projects: [],
  expertise: {},
  skills: [
    {
      category: 'Languages',
      skills: [
        'JavaScript',
        'ES6',
        'Typescript',
        'Java SE',
        'SQL',
      ],
      level: 'Expert',
    },
    {
      category: 'Styling Technologies',
      skills: [
        'HTML',
        'CSS',
        'LESS',
        'SCSS',
        'Stylus',
        'BEM',
      ],
      level: 'Advanced',
    },
  ],
};

const initialOptions: GenerationOptions = {
  includePersonalInfo: true,
  includePrivateInfo: false,
};

export const useCVData = () => {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(initialOptions);
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadCVFromFile = async (file: File) => {
    setUploadLoading(true);
    setUploadError(null);
    try {
      const response: NullableCVData = await uploadFile(file);
      
      // Handle null or undefined response
      if (response === null || response === undefined) {
        setUploadError('No CV data was extracted from the file. Please try a different file.');
        setIsLoaded(false);
        return;
      }

      // Validate that we have at least some basic data
      if (!response.first_name && !response.last_name && !response.title) {
        setUploadError('The uploaded file does not contain valid CV data. Please check the file format.');
        setIsLoaded(false);
        return;
      }

      // Merge with initial data to ensure all required fields exist
      const mergedData: CVData = {
        ...initialCVData,
        ...response,
        contact: {
          ...initialCVData.contact,
          ...response.contact,
        },
        education: response.education || [],
        experience: response.experience || [],
        certifications: response.certifications || [],
        internship_volunteering: response.internship_volunteering || [],
        languages_spoken: response.languages_spoken || [],
        projects: response.projects || [],
        skills: response.skills || [],
        expertise: response.expertise || {},
      };

      setCVData(mergedData);
      setIsLoaded(true);
    } catch (err: unknown) {
      let message = 'Failed to upload file.';
      if (err instanceof Error) {
        message = err.message;
      }
      setUploadError(message);
      setIsLoaded(false);
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    cvData,
    setCVData,
    generationOptions,
    setGenerationOptions,
    isLoaded,
    loadCVFromFile,
    uploadLoading,
    uploadError,
  };
};