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
import TelegramIcon from '../img/telegram.png'

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

  const optimizeTwoColumnWidths = (
    contact_info: { contact: string; image: string; width: number }[]
  ): [{ contact: string; image: string; width: number }[], { contact: string; image: string; width: number }[], number, number, number] => {
    // Step 1: Sort items descending by width
    const sorted = [...contact_info].sort((a, b) => a.width - b.width);

    let solo: typeof contact_info[0] | null = null;
    if (sorted.length % 2 === 1) {
      solo = sorted.pop()!; // Remove the longest (last after sort ascending)
    }
    const result: typeof contact_info = [];
    const leftresult :typeof contact_info = [];
    const rightresult :typeof contact_info = [];
    let left = 0;
    let right = sorted.length - 1;
    let maxwidthleft = 0
    let maxwidthright = 0
    let space = 5
    while (left <= right) {
      if (left === right) {
        // Odd number, push the last single item
        result.push(sorted[left]);
        break;
      }
      // Pair the widest with narrowest to balance row width
      leftresult.push(sorted[left]);
      rightresult.push(sorted[right]);
      if (maxwidthleft < sorted[left].width){
        maxwidthleft = sorted[left].width
      }
      if (maxwidthright < sorted[right].width){
        maxwidthright = sorted[right].width
      }
      left++;
      right--;
    }
    if(solo){
      leftresult.push(solo)
      if (solo.width > maxwidthleft + maxwidthright + 10) {
        space = solo.width - (maxwidthleft + maxwidthright)
      }
    }
    return [leftresult, rightresult, maxwidthleft, maxwidthright, space];
  }
  let telegramUrl = ""
  let contact_info: { contact: string; image: string; width: number }[] = [];
  if(cvData.contact){
    if(cvData.contact.links){
      telegramUrl = Object.entries(cvData.contact.links).find(
        ([key]) => key.toLowerCase() === "telegram"
      )?.[1] || "";
    }
    
    if (cvData.contact.location) {
      const safe = cvData.contact.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      contact_info = [
        ...contact_info,
        {
          contact: safe,
          image : AddressIcon,
          width :cvData.contact.location.length
        }
      ]
    }
    if (cvData.contact.email) {
      const safe = cvData.contact.email.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      contact_info = [
        ...contact_info,
        {
          contact: safe,
          image : EmailIcon,
          width : cvData.contact.email.length
        }
      ]
    }
    if (cvData.contact.phone) {
      const safe = cvData.contact.phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      contact_info = [
        ...contact_info,
        {
          contact: safe,
          image : PhoneIcon,
          width : cvData.contact.phone.length
        }
      ]
    }
    if (telegramUrl) {
      contact_info = [
        ...contact_info,
        {
          contact: telegramUrl,
          image : TelegramIcon,
          width : telegramUrl.length
        }
      ]
    }
  }
  const [contact_info_left, contact_info_right]: [{ contact: string; image: string; width: number }[], { contact: string; image: string; width: number }[], number, number, number] = optimizeTwoColumnWidths(contact_info);
  
  const getLanguageLevel = (level?: string) => {
    if (level === 'C2' || level === 'Native') return 100;
    else if (level === 'C1' || level === 'Advanced') return 100;
    else if (level === 'B2' || level === 'Upper Intermediate') return 75;
    else if (level === 'B1' || level === 'Intermediate') return 60;
    else if (level === 'A2' || level === 'Elementary') return 45;
    else if (level === 'A1' || level === 'Beginner') return 25;
    else return 70;
  };

  const getSkillLevel = (level?: string) => {
    if (level === 'Expert') return 100;
    else if (level === 'Advanced') return 75;
    else if (level === 'Intermediate') return 50;
    else if (level === 'Beginner') return 25;
    else return 50
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
      <div className={`flex items-center gap-2 mb-2 ${isLeftColumn ? 'justify-start' : 'justify-start'}`}>
        <div className="text-red-600">{icon}</div>
        <h3 className="font-bold text-red-600" style={{fontSize:'15px'}}>{title}</h3>
      </div>
      <div className="flex items-center ml-6">
        <div className={`h-0.5 bg-red-600 ${isLeftColumn ? 'w-12' : 'w-14'}`}></div>
        <div className={`h-0.5 bg-gray-300 flex-1 ${isLeftColumn ? 'ml-0' : 'ml-0'}`}></div>
      </div>
    </div>
  );

  const HeaderSection = () => (
    <>
      {/* Header Section */}
      <div className="p-6 pb-3">
        <div className="flex justify-between items-start h-full">
          <div className="pl-8" style={{width:'55%'}}>
            {options.includePersonalInfo ? (
              <>
                {options.downloadOption === 'name_initial' ? (
                  <>
                    <h1 className="text-3xl font-bold text-red-600 leading-tight mb-1">
                      {(cvData.first_name || '').toUpperCase()} {(cvData.last_name || '').charAt(0).toUpperCase()}
                    </h1>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-red-600 leading-tight mb-1">
                      {(cvData.first_name || '').toUpperCase()} {(cvData.last_name || '').toUpperCase()}
                    </h1>
                  </>
                )}
                <p className="text-base text-black">
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
          <div className="flex flex-col items-end mr-5" >
            {/* Company Logo */}
            <img src={Logo} alt="Company Logo" className="w-24 object-contain mb-3 bg-white rounded" />          
            {cvData.contact && (
              <div className="text-black text-right flex" style={{fontSize:'12px'}}>
                <div>
                  { contact_info_left.map((item, subIndex) =>
                    item.contact ? (
                      <div key={subIndex} className="flex items-center gap-2 pl-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-4 h-4 text-red-600 flex-shrink-0"
                        />
                        <span className="break-all">{item.contact}</span>
                      </div>
                    ) : null
                  )}
                </div>
                <div>
                  { contact_info_right.map((item, subIndex) =>
                    item.contact ? (
                      <div key={subIndex} className="flex items-center gap-2 pl-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-4 h-4 text-red-600 flex-shrink-0"
                        />
                        <span className="break-all">{item.contact}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

       <div className='bg-red-600 p-0 m-0' style={{
        height: '6px',
        width: '35%',
        clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0% 100%)'
      }} />
      <div className="h-1 bg-red-600 mb-6"></div>
    </>
  );

  const LeftColumnContent = () => (
    <div className="pl-7 p-4 space-y-4 text-sm bg-white" style={{width:'35%'}}>
      {/* Professional Summary */}
      {cvData.summary && (
        <div>
          <SectionHeader icon={<img src={UserIcon} alt="User" className="w-4 h-4" />} title="PROFESSIONAL SUMMARY" isLeftColumn />
          <p className="text-black leading-relaxed text-sm ml-6">{cvData.summary}</p>
        </div>
      )}

      {/* Skills (moved from left column) */}
      {cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0 && (
        <div>
          <SectionHeader icon={<img src={AwardIcon} alt="Award" className="w-4 h-4" />} title="SKILLS" />
          <div className="space-y-2 ml-6">
            {cvData.skills.map((skill, index) => {
              const level = skill.level || 'Intermediate';
              return (
              <div key={index}>
                <div className="text-sm text-black mb-1">
                  <b>{skill.category}: </b> {skill.skills.join(', ')}
                </div>
                <ProgressBar percentage={getSkillLevel(level)} />
              </div>
            )}
            )}
          </div>
        </div>
      )}
      {/* Education */}
      {cvData.education && cvData.education.length > 0 && (
        <div>
          <SectionHeader icon={<img src={GraduationCapIcon} alt="Graduation Cap" className="w-4 h-4" />} title="EDUCATION" isLeftColumn />
          <div className="space-y-3">
            {cvData.education.map((edu, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-red-600 font-bold mr-3 ml-2">•</span>
                  <div className="flex-1 pr-3">
                    <h4 className="text-black text-sm mb-1">{(edu.institution || '').toUpperCase()}</h4>
                    {edu.field && <p className="text-sm text-black">{edu.field}</p>}
                  </div>
                </div>
                <div className="text-sm text-black flex-shrink-0 ml-6">
                    {`${processDateRange(edu.start_date, edu.end_date)}`}
                  </div>
                <p className="font-bold text-red-600 text-sm ml-6">{edu.degree || ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links - only show for 'full' option */}
      {cvData.contact?.links && Object.keys(cvData.contact.links).length > 0 && (
        <div>
          <SectionHeader icon={<img src={LinkedinIcon} alt="Linkedin" className="w-4 h-4" />} title="LINKS" isLeftColumn />
          <div className="space-y-2 ml-6">
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
          <div className="space-y-2 ml-6">
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
              <div>
                <div key={index} className="flex text-sm text-black items-start">
                  <span className="text-red-600 font-bold mr-3 ml-2">•</span>
                  <div>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-sm text-gray-600">{cert.date}</p>
                  </div>
                </div>              
                <p className="flex-1 ml-5 text-sm text-red-600 font-medium">
                  {(cert.name || '').toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      
    </div>
  );

  const RightColumnContent = () => (
    <div className="p-4 pr-10 space-y-4 text-sm bg-white" style={{width:'65%'}}>
      {/* Work Experience */}
      {cvData.experience && cvData.experience.length > 0 && (
        <div>
          <SectionHeader icon={<img src={BriefcaseIcon} alt="Briefcase" className="w-4 h-4" />} title="WORK EXPERIENCE" />
          <div className="space-y-3">
            {cvData.experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start">
                  <span className="text-red-600 font-bold ml-2 mr-2">•</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-black text-sm mb-1">{(exp.company || '').toUpperCase()}</h4>
                        <p className="text-sm text-black">{exp.location || ''}</p>
                      </div>
                      <div className="text-sm text-black text-right flex-shrink-0">
                        {`${processDateRange(exp.start_date, exp.end_date)}`}
                      </div>
                    </div>
                    <p className="text-red-600 font-medium text-sm">{exp.title || ''}</p>
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
                </div>
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
                  <span className="text-red-600 font-bold ml-2 mr-2">•</span>
                  <div className="flex-1 pr-3">
                    <h4 className="font-medium text-black text-sm mb-1">{(project.project_name || '').toUpperCase()}</h4>
                    <p className="text-sm text-black">{project.organization || ''}</p>
                  </div>
                  <div className="text-sm text-black text-right flex-shrink-0">
                    {`${processDateRange(project.start_date, project.end_date)}`}
                  </div>
                </div>
                <p className="text-sm text-black leading-relaxed ml-3">
                  {project.description || ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CVPage = ({ content, isFirstPage }: { content: PageContent, isFirstPage: boolean }) => (
    <div 
      className="bg-white mx-auto w-full max-w-[900px] my-12 mb-8" 
      style={{ 
        maxWidth: '900px',
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
        <div className="w-0.5 bg-red-600 mt-4"></div>
        
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