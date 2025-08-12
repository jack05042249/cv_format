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

  const reorderByStartDate = () => {
    setCVData(prevData => {
      const newData = { ...prevData };
      
      // Helper function to parse date strings
      const parseDate = (dateStr?: string): Date => {
        if (!dateStr) return new Date(0); // Default to epoch for missing dates
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date(0) : date;
      };

      // Sort experiences by start_date (latest first)
      if (newData.experience) {
        newData.experience = [...newData.experience].sort((a, b) => {
          const dateA = parseDate(a.start_date);
          const dateB = parseDate(b.start_date);
          return dateB.getTime() - dateA.getTime();
        });
      }

      // Sort projects by start_date (latest first)
      if (newData.projects) {
        newData.projects = [...newData.projects].sort((a, b) => {
          const dateA = parseDate(a.start_date);
          const dateB = parseDate(b.start_date);
          return dateB.getTime() - dateA.getTime();
        });
      }

      // Sort education by start_date (latest first)
      if (newData.education) {
        newData.education = [...newData.education].sort((a, b) => {
          const dateA = parseDate(a.start_date);
          const dateB = parseDate(b.start_date);
          return dateB.getTime() - dateA.getTime();
        });
      }

      return newData;
    });
  };

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

      // // Validate that we have at least some basic data
      // if (!response.first_name && !response.last_name && !response.title) {
      //   setUploadError('The uploaded file does not contain valid CV data. Please check the file format.');
      //   setIsLoaded(false);
      //   return;
      // }

      // Merge with initial data to ensure all required fields exist
      // Helper function to parse date strings
      const parseDate = (dateStr?: string): Date => {
        if (!dateStr) return new Date(0); // Default to epoch for missing dates
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date(0) : date;
      };

      // Sort experiences by start_date (latest first)
      const order_experience = response.experience ? [...response.experience].sort((a, b) => {
        const dateA = parseDate(a.start_date);
        const dateB = parseDate(b.start_date);
        return dateB.getTime() - dateA.getTime();
      }) : [];

      // Sort projects by start_date (latest first)
      const order_projects = response.projects ? [...response.projects].sort((a, b) => {
        const dateA = parseDate(a.start_date);
        const dateB = parseDate(b.start_date);
        return dateB.getTime() - dateA.getTime();
      }) : [];

      // Sort education by start_date (latest first)
      const order_education = response.education ? [...response.education].sort((a, b) => {
        const dateA = parseDate(a.start_date);
        const dateB = parseDate(b.start_date);
        return dateB.getTime() - dateA.getTime();
      }) : [];
      const mergedData: CVData = {
        ...initialCVData,
        ...response,
        contact: {
          ...initialCVData.contact,
          ...response.contact,
        },
        education: order_education,
        experience: order_experience,
        certifications: response.certifications || [],
        internship_volunteering: response.internship_volunteering || [],
        languages_spoken: response.languages_spoken || [],
        projects: order_projects,
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
    reorderByStartDate,
  };
};