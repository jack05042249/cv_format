import React, { useEffect, useState } from 'react';
import { CVData, GenerationOptions } from '../types/cv';
import { processDateRange } from '../utils/dateProcessor';
import Logo from '../img/Logo.png';
import UserIcon from '../img/user.png';
import BriefcaseIcon from '../img/briefcase.png';
import GraduationCapIcon from '../img/GraduationCap.png';
import AwardIcon from '../img/award.png';
import LanguageIcon from '../img/Language.png';
import BookOpenIcon from '../img/bookopen.png';
import PhoneIcon from '../img/phone.png';
import EmailIcon from '../img/email.png';
import AddressIcon from '../img/address.png';
import LinkedinIcon from '../img/linkedin.png';

interface CVPreviewProps {
  cvData: CVData;
  options: GenerationOptions;
}

interface PageContent {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  isFirstPage: boolean;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData, options }) => {
  const [pages, setPages] = useState<PageContent[]>([]);

  const getSkillLevel = () => 100;

  const getLanguageLevel = (level?: string) => {
    if (level === 'C2' || level === 'Native') return 100;
    else if (level === 'C1' || level === 'Advanced') return 90;
    else if (level === 'B2' || level === 'Upper Intermediate') return 80;
    else if (level === 'B1' || level === 'Intermediate') return 70;
    else if (level === 'A2' || level === 'Elementary') return 60;
    else if (level === 'A1' || level === 'Beginner') return 50;
    else return 70;
  };

  const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div 
        className="bg-red-600 h-1.5 rounded-full" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  const SectionHeader = ({ icon, title, isLeftColumn = false }: { icon: React.ReactNode, title: string, isLeftColumn?: boolean }) => (
    <div className="mb-2">
      <div className={`flex items-center gap-2 mb-3 ${isLeftColumn ? 'justify-start' : 'justify-start'}`}>
        <div className="text-red-600">{icon}</div>
        <h3 className="font-bold text-black text-sm">{title}</h3>
      </div>
      <div className="flex items-center">
        <div className={`h-0.5 bg-red-600 ${isLeftColumn ? 'w-8' : 'w-10'}`}></div>
        <div className={`h-0.5 bg-gray-300 flex-1 ${isLeftColumn ? 'ml-0' : 'ml-0'}`}></div>
      </div>
    </div>
  );

  const HeaderSection = () => (
    <>
      {/* Header Section */}
      <div className="p-4 pb-3">
        <div className="flex justify-between items-start h-full">
          <div className="w-3/4 pl-6">
            {options.includePersonalInfo ? (
              <>
                {options.downloadOption === 'name_initial' ? (
                  <>
                    <h1 className="text-3xl font-bold text-red-600 leading-tight mb-1">
                      {(cvData.first_name || '').toUpperCase()}
                    </h1>
                    <h1 className="text-3xl font-bold text-red-600 leading-tight mb-2">
                      {(cvData.last_name || '').charAt(0).toUpperCase()}
                    </h1>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-red-600 leading-tight mb-1">
                      {(cvData.first_name || '').toUpperCase()}
                    </h1>
                    <h1 className="text-3xl font-bold text-red-600 leading-tight mb-2">
                      {(cvData.last_name || '').toUpperCase()}
                    </h1>
                  </>
                )}
                <p className="text-base font-bold text-black">
                  {(() => {
                    const safeTitle_mini = (cvData.title || '').replace(/●/g, '|');
                    const safetitle = safeTitle_mini.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return safetitle;
                  })()}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-red-600 leading-tight mb-2">
                  PROFESSIONAL CV
                </h1>
                <p className="text-base font-bold text-black">
                  {(() => {
                    const safeTitle_mini = (cvData.title || '').replace(/●/g, '|');
                    const safetitle = safeTitle_mini.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return safetitle;
                  })()}
                </p>
              </>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            {/* Company Logo */}
            <img src={Logo} alt="Company Logo" className="w-24 object-contain mb-3 bg-white rounded" />
            
            {cvData.contact && (
              <div className="text-sm text-black space-y-1 text-right">
                {cvData.contact.location && (
                  <div className="flex items-center justify-start gap-2">
                    <img src={AddressIcon} alt="Address" className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="break-all">{cvData.contact.location}</span>
                  </div>
                )}
                {cvData.contact.phone && (
                  <div className="flex items-center justify-start gap-2">
                    <img src={PhoneIcon} alt="Phone" className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="break-all">{cvData.contact.phone}</span>
                  </div>
                )}
                {cvData.contact.email && (
                  <div className="flex items-center justify-start gap-2">
                    <img src={EmailIcon} alt="Email" className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="break-all">{cvData.contact.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Red separator line */}
      <div className="h-1 bg-red-600"></div>
    </>
  );

  const LeftColumnContent = () => (
    <div className="w-2/5 p-4 space-y-4 text-sm bg-white">
      {/* Professional Summary */}
      {cvData.summary && (
        <div>
          <SectionHeader icon={<img src={UserIcon} alt="User" className="w-4 h-4" />} title="PROFESSIONAL SUMMARY" isLeftColumn />
          <p className="text-black leading-relaxed text-sm">{cvData.summary}</p>
        </div>
      )}

      {/* Skills */}
      {cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0 && (
        <div>
          <SectionHeader icon={<img src={AwardIcon} alt="Award" className="w-4 h-4" />} title="SKILLS" isLeftColumn />
          <div className="space-y-2">
            {cvData.skills.map((skill, index) => (
              <div key={index}>
                <div className="text-sm font-medium text-black mb-1">
                  {skill.skills.join(', ')}
                </div>
                <ProgressBar percentage={getSkillLevel()} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links - only show for 'full' option */}
      {cvData.contact?.links && Object.keys(cvData.contact.links).length > 0 && (
        <div>
          <SectionHeader icon={<img src={LinkedinIcon} alt="Linkedin" className="w-4 h-4" />} title="LINKS" isLeftColumn />
          <div className="space-y-2">
            {Object.entries(cvData.contact.links).map(([linkType, linkUrl], index) => (
              <div key={index}>
                <p className="text-sm font-bold text-black mb-1">{linkType.toUpperCase()}:</p>
                <p className="text-sm text-black break-all leading-relaxed">
                  <a href={linkUrl as string} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {linkUrl as string}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages_spoken && cvData.languages_spoken.length > 0 && (
        <div>
          <SectionHeader icon={<img src={LanguageIcon} alt="Language" className="w-4 h-4" />} title="LANGUAGES" isLeftColumn />
          <div className="space-y-2">
            {cvData.languages_spoken.map((language, index) => {
              const lang = typeof language === 'string' ? language : language.language || language.name || '';
              const level = typeof language === 'string' ? 'Intermediate' : language.level || 'Intermediate';
              return (
                <div key={index}>
                  <div className="text-sm font-medium text-black mb-1">{lang.toUpperCase()}</div>
                  <ProgressBar percentage={getLanguageLevel(level)} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cvData.certifications && cvData.certifications.length > 0 && (
        <div>
          <SectionHeader icon={<img src={BookOpenIcon} alt="Book Open" className="w-4 h-4" />} title="CERTIFICATIONS" isLeftColumn />
          <div className="space-y-2">
            {cvData.certifications.map((cert, index) => (
              <div key={index} className="text-sm text-black">
                <p className="font-bold leading-relaxed mb-1">{(cert.name || '').toUpperCase()}</p>
                {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const RightColumnContent = () => (
    <div className="w-3/5 p-4 space-y-4 text-sm bg-white">
      {/* Work Experience */}
      {cvData.experience && cvData.experience.length > 0 && (
        <div>
          <SectionHeader icon={<img src={BriefcaseIcon} alt="Briefcase" className="w-4 h-4" />} title="WORK EXPERIENCE" />
          <div className="space-y-3">
            {cvData.experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h4 className="font-bold text-black text-sm mb-1">{(exp.company || '').toUpperCase()}</h4>
                    <p className="text-sm text-black">{exp.location || ''}</p>
                  </div>
                  <div className="text-sm font-bold text-black text-right flex-shrink-0">
                    {`${processDateRange(exp.start_date, exp.end_date)}`}
                  </div>
                </div>
                <p className="font-bold text-red-600 text-sm">{exp.title || ''}</p>
                {exp.summary && (
                  <p className="text-sm text-black mb-2">{exp.summary}</p>
                )}
                {exp.description && exp.description.length > 0 && (
                  <div className="text-sm text-black leading-relaxed">
                    {exp.description.map((desc, descIndex) => (
                      <p key={descIndex} className="mb-1">• {desc.trim()}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education && cvData.education.length > 0 && (
        <div>
          <SectionHeader icon={<img src={GraduationCapIcon} alt="Graduation Cap" className="w-4 h-4" />} title="EDUCATION" />
          <div className="space-y-3">
            {cvData.education.map((edu, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h4 className="font-bold text-black text-sm mb-1">{(edu.institution || '').toUpperCase()}</h4>
                    {edu.field && <p className="text-sm text-black">{edu.field}</p>}
                  </div>
                  <div className="text-sm font-bold text-black text-right flex-shrink-0">
                    {`${processDateRange(edu.start_date, edu.end_date)}`}
                  </div>
                </div>
                <p className="font-bold text-red-600 text-sm">{edu.degree || ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.projects && cvData.projects.length > 0 && (
        <div>
          <SectionHeader icon={<img src={BriefcaseIcon} alt="Briefcase" className="w-4 h-4" />} title="PROJECTS" />
          <div className="space-y-3">
            {cvData.projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h4 className="font-bold text-black text-sm mb-1">{(project.project_name || '').toUpperCase()}</h4>
                    <p className="text-sm text-black">{project.organization || ''}</p>
                  </div>
                  <div className="text-sm font-bold text-black text-right flex-shrink-0">
                    {`${processDateRange(project.start_date, project.end_date)}`}
                  </div>
                </div>
                <p className="text-sm text-black leading-relaxed">{project.description || ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CVPage = ({ content, isFirstPage }: { content: PageContent, isFirstPage: boolean }) => (
    <div 
      className="bg-white mx-auto w-full max-w-full mb-4" 
      style={{ 
        maxWidth: '100%',
        width: '100%',
        minHeight: '297mm',
        pageBreakAfter: 'always'
      }}
    >
      {isFirstPage && <HeaderSection />}
      
      {/* Two-column layout - 4:6 ratio (40% left, 60% right) */}
      <div className="flex min-h-full">
        {content.leftColumn}
        
        {/* Vertical separator */}
        <div className="w-0.5 bg-red-600"></div>
        
        {content.rightColumn}
      </div>
    </div>
  );

  // Generate pages based on content
  useEffect(() => {
    const generatePages = () => {
      const newPages: PageContent[] = [];
      
      // First page with header
      newPages.push({
        leftColumn: <LeftColumnContent />,
        rightColumn: <RightColumnContent />,
        isFirstPage: true
      });

      // For now, we'll create a simple multi-page system
      // In a real implementation, you'd measure content height and split accordingly
      setPages(newPages);
    };

    generatePages();
  }, [cvData, options]);

  return (
    <div className="space-y-4 bg-white">
      {pages.map((page, index) => (
        <CVPage key={index} content={page} isFirstPage={page.isFirstPage} />
      ))}
    </div>
  );
};