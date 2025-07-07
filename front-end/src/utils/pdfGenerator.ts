import jsPDF from 'jspdf';
import { CVData, GenerationOptions, Skill } from '../types/cv';
import {processDateRange} from '../utils/dateProcessor'

//Icons
import Logo from '../img/Logo.png';
import User_Icon from '../img/user.png';
import Award_Icon from '../img/award.png';
import Briefcase_Icon from '../img/briefcase.png';
import GraduationCap_Icon from '../img/GraduationCap.png';
import BookOpen_Icon from '../img/bookopen.png';
import Language_Icon from '../img/Language.png';
import Linkedin_Icon from '../img/linkedin.png';
import Address_Icon from '../img/address.png'
import Email_Icon from '../img/email.png'
import Phone_Icon from '../img/phone.png'
import Telegram_Icon from '../img/telegram.png'

// console.log(typeof(User_Icon))
export const generatePDF = async (
  cvData: CVData,
  options: GenerationOptions,
  filename: string
) => {
  console.log(options)
  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;

  // Define colors
  const redColor = [185, 25, 47]; // #B9192F
  const grayColor = [188, 190, 192]; // #BCBEC0
  const blackColor = [0, 0, 0];

  // Layout variables for flexibility
  const margin = 8;
  const headermargin = 15;
  const headerSpacing = 7;
  const sectionSpacing = 10;
  const lineSpacing = 4;
  const smallLineSpacing = 2;
  const contactSpacing = 5;
  const leftColumnRatio = 0.4;
  const leftColumnWidth = (pageWidth - 2 * margin - 10) * leftColumnRatio;
  const rightColumnStart = margin + leftColumnWidth + 8; // 8mm gap
  const rightColumnWidth = pageWidth - rightColumnStart - margin;

  let pagenumber = 1
  let rightpagenumber = 1

  let yPos = headermargin; // Default value, will be updated if personal info is included

  // Header section
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  
  // Name and title (left side)
  const firstName = cvData.first_name || '';
  const lastName = cvData.last_name || '';
  
  if (options.includePersonalInfo) {
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    
    // Handle different name display options
    if (options.downloadOption === 'name_initial') {
      // Show first name and last name initial
      pdf.text(firstName.toUpperCase(), headermargin, yPos);
      yPos += headerSpacing;
      pdf.text(lastName.charAt(0).toUpperCase(), headermargin, yPos);
      yPos += headerSpacing;
    } else {
      // Show full name (both full and name_only options)
      pdf.text(firstName.toUpperCase(), headermargin, yPos);
      yPos += headerSpacing;
      pdf.text(lastName.toUpperCase(), headermargin, yPos);
      yPos += headerSpacing;
    }
  } else {
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.text('PROFESSIONAL CV', headermargin, yPos);
    yPos += headerSpacing + 2;
  }

  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  const titleText = (cvData.title || '');
  const maxTitleWidth = pageWidth * 0.5;
  const titleWidth = pdf.getTextWidth(titleText);
  const titlelines = Math.floor((titleWidth + maxTitleWidth - 1) / maxTitleWidth)
  const safeTitle_mini = titleText.replace(/●/g, '|')
  const safetitle = safeTitle_mini.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  pdf.text(safetitle, headermargin, yPos, { maxWidth: maxTitleWidth});
  yPos += titlelines * 4;
  
  pdf.addImage(Logo, 'PNG', pageWidth - 38, 8, 28, 0);
  // Contact info (right side) - only show for 'full' option
  if (options.includePersonalInfo && options.includePrivateInfo && options.downloadOption == 'full' && cvData.contact) {
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    let telegramUrl = ""
    if(cvData.contact.links){
      telegramUrl = Object.entries(cvData.contact.links).find(
        ([key]) => key.toLowerCase() === "telegram"
      )?.[1] || "";
    }
    let locationlength = 0
    let emaillength = 0
    let phone_length = 0
    let telegram_length = 0
    if (cvData.contact.location) {
      locationlength = cvData.contact.location.length
    }
    if (cvData.contact.email) {
      emaillength = cvData.contact.email.length
    }
    if (cvData.contact.phone) {
      phone_length = cvData.contact.phone.length
    }
    if (telegramUrl) {
      telegram_length = telegramUrl.length
    }
    const maxlength = Math.max(locationlength, emaillength, phone_length, telegram_length)
    let contactY = margin + 15;
    const contactX = pageWidth - margin - maxlength*1.6 - 10;
    
    if (cvData.contact.location) {
      contactY += contactSpacing;
      const safe = cvData.contact.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pdf.addImage(Address_Icon, 'PNG', contactX, contactY - 3, 3, 3);
      pdf.text(safe, contactX + 5, contactY);
    }
    if (cvData.contact.phone) {
      contactY += contactSpacing;
      const safe = cvData.contact.phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pdf.addImage(Phone_Icon, 'PNG', contactX, contactY - 3, 3, 3);
      pdf.text(safe, contactX + 5, contactY);
    }
    if (telegramUrl) {
      contactY += contactSpacing;
      pdf.addImage(Telegram_Icon, 'PNG', contactX, contactY - 3, 3, 3);
      pdf.text(telegramUrl, contactX + 5, contactY);
    }
    if (cvData.contact.email) {
      contactY += contactSpacing;
      pdf.addImage(Email_Icon, 'PNG', contactX, contactY - 3, 3, 3);
      pdf.text(cvData.contact.email, contactX + 5, contactY);
    }
    contactY += 3
    if (contactY > yPos){
      yPos = contactY
    }
  }
  // Red separator line
  pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
  pdf.setLineWidth(1);
  pdf.line(0, yPos, pageWidth, yPos);

  yPos += sectionSpacing;

  // Helper function for section headers
  const addSectionHeader = (title: string, x: number, y: number, icon:string, isLeftColumn = false) => {
    pdf.addImage(icon, 'PNG', x, y-4, 4, 4);
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, x+5, y);
    
    // Underline
    const headerWidth = isLeftColumn ? 15 : 20;
    const grayWidth = isLeftColumn ? leftColumnWidth - 15 : rightColumnWidth - 20;
    
    pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(x, y + 3, x + headerWidth, y + 3);
    
    pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
    pdf.line(x + headerWidth, y + 3, x + headerWidth + grayWidth, y + 3);
    
    return y + sectionSpacing / 2 + 3;
  };

  // LEFT COLUMN
  let leftY = yPos;
  let rightY = yPos; // <-- Start both columns just after the header

  // Draw vertical separator line on the first page
  pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(margin + leftColumnWidth + 5, yPos-sectionSpacing, margin + leftColumnWidth + 5, pageHeight - margin);

  // Helper function to check and add new page for left column
  const checkLeftPageOverflow = (nextBlockHeight: number) => {
    if (leftY + nextBlockHeight > pageHeight - margin) {
      pdf.addPage();
      pagenumber += 1
      leftY = 11;
      // Draw separator line on new page
      pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin + leftColumnWidth + 5, margin, margin + leftColumnWidth + 5, pageHeight - margin);
    }
  };

  // Professional Summary
  if (cvData.summary) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('PROFESSIONAL SUMMARY', margin, leftY, User_Icon, true);
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const summaryWidth = pdf.getTextWidth(cvData.summary);
    const summaryLines = Math.floor((summaryWidth + (leftColumnWidth - 5) - 1) / (leftColumnWidth - 5))
    checkLeftPageOverflow(summaryLines*lineSpacing);
    pdf.text(cvData.summary, margin, leftY, { maxWidth: leftColumnWidth});
    
    leftY += summaryLines* lineSpacing + sectionSpacing;
  }

  // Skills
  if (Array.isArray(cvData.skills) && cvData.skills.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('SKILLS', margin, leftY, Award_Icon, true);
    cvData.skills.forEach((skill: Skill) => {
      
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const skillTextLines = pdf.splitTextToSize(skill.skills.join(', '), leftColumnWidth - 5);
      
      checkLeftPageOverflow(lineSpacing * (skillTextLines.length + 1) + smallLineSpacing);
      pdf.text(skill.skills.join(', '), margin, leftY, { maxWidth: leftColumnWidth - 5 });
      // Skill level bar
      // const linesofskills = skillTextLines*9/1.618/(leftColumnWidth - 5)
      leftY += (skillTextLines.length - 1)*lineSpacing + smallLineSpacing*0.5
      const barWidth = leftColumnWidth - 5;
      // Set skillLevel to 1.0 (100%) for all skills
      const skillLevel = 1.0;
      pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.rect(margin, leftY + 1, barWidth, 1.5, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(margin, leftY + 1, barWidth * skillLevel, 1.5, 'F');
      leftY += lineSpacing + smallLineSpacing*2;
    });
    leftY += sectionSpacing / 2;
  }

  // Links - only show for 'full' option
  if (options.downloadOption === 'full' && cvData.contact?.links) {
    const filteredLinks = Object.fromEntries(
      Object.entries(cvData.contact.links).filter(
        ([key]) => key.toLowerCase() !== "telegram"
      )
    );

    if(cvData.contact && Object.keys(filteredLinks).length > 0){
      checkLeftPageOverflow(sectionSpacing);
      leftY = addSectionHeader('LINKS', margin, leftY, Linkedin_Icon, true);
    }
     
    // Iterate through all links dynamically
    Object.entries(filteredLinks).forEach(([linkType, linkUrl]) => {
      if (linkUrl) {
        checkLeftPageOverflow(lineSpacing);
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${linkType.toUpperCase()}:`, margin, leftY);
        leftY += lineSpacing + 1;
        pdf.setFont('helvetica', 'normal');
        const linkLines = pdf.splitTextToSize(linkUrl, leftColumnWidth - 5);
        checkLeftPageOverflow(linkLines.length * 2 + smallLineSpacing);
        pdf.text(linkUrl, margin, leftY , { maxWidth: leftColumnWidth - 5 });
        leftY += linkLines.length* lineSpacing + smallLineSpacing;
      }
    });
    
    leftY += lineSpacing + smallLineSpacing;
  }

  // Languages
  if (cvData.languages_spoken && cvData.languages_spoken.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('LANGUAGES', margin, leftY, Language_Icon, true);
    cvData.languages_spoken.forEach((language) => {
      const lang = typeof language === 'string' ? language : language.language || language.name || '';
      const level = typeof language === 'string' ? 'Intermediate' : language.level || 'Intermediate';
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      const langLines = pdf.splitTextToSize(lang.toUpperCase(), leftColumnWidth - 5);
      pdf.text(langLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      const barWidth = leftColumnWidth - 5;
      // Handle CEFR levels (A1, A2, B1, B2, C1, C2) and other levels
      let levelValue = 0.5; // Default
      if (level === 'C2' || level === 'Native') levelValue = 1.0;
      else if (level === 'C1' || level === 'Advanced') levelValue = 0.9;
      else if (level === 'B2' || level === 'Upper Intermediate') levelValue = 0.8;
      else if (level === 'B1' || level === 'Intermediate') levelValue = 0.7;
      else if (level === 'A2' || level === 'Elementary') levelValue = 0.6;
      else if (level === 'A1' || level === 'Beginner') levelValue = 0.5;
      
      pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.rect(margin, leftY + 1, barWidth, 2, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(margin, leftY + 1, barWidth * levelValue, 2, 'F');
      leftY += langLines.length * lineSpacing + lineSpacing + smallLineSpacing;
    });
    leftY += lineSpacing + smallLineSpacing;
  }

  // Certifications
  if (cvData.certifications && cvData.certifications.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('CERTIFICATIONS', margin, leftY, BookOpen_Icon, true);
    cvData.certifications.forEach((cert) => {
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const certNameLines = pdf.splitTextToSize((cert.name || ''), leftColumnWidth - 5);
      checkLeftPageOverflow(lineSpacing * certNameLines.length + smallLineSpacing);
      pdf.text((cert.name || ''), margin, leftY, { maxWidth: leftColumnWidth - 5 });
      leftY += (certNameLines.length-1) * lineSpacing;
      if (cert.issuer) {
        pdf.setFontSize(9);
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        const issuerLines = pdf.splitTextToSize(cert.issuer, leftColumnWidth - 5);
        pdf.text(cert.issuer, margin, leftY + lineSpacing, { maxWidth: leftColumnWidth - 5 });
        leftY += issuerLines.length * lineSpacing;
      }
      leftY += lineSpacing + smallLineSpacing;
    });
  }

  // RIGHT COLUMN
  
  pdf.setPage(1)

  // Helper function to check and add new page for right column
  const checkRightPageOverflow = (nextBlockHeight: number) => {
    if (rightY + nextBlockHeight > pageHeight - margin) {
      rightpagenumber += 1
      if (rightpagenumber <= pagenumber){
        pdf.setPage(rightpagenumber)
      } else{
        pdf.addPage();
      }
      rightY = 11;
      // Draw separator line on new page
      pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin + leftColumnWidth + 5, margin, margin + leftColumnWidth + 5, pageHeight - margin);
    }
  };
  // Work Experience
  if (Array.isArray(cvData.experience) && cvData.experience.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('WORK EXPERIENCE', rightColumnStart, rightY, Briefcase_Icon);
    cvData.experience.forEach((exp) => {
      checkRightPageOverflow(lineSpacing * 4);
      // Company & Dates
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const dateRange = processDateRange(exp.start_date, exp.end_date)
      const companyLines = pdf.splitTextToSize((exp.company || ''), rightColumnWidth - dateRange.length*1.6);
      pdf.text((exp.company || ''), rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
      pdf.setFontSize(9);
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.6, rightY);
      
      rightY += companyLines.length * lineSpacing + 1;
      // Location
      if (exp.location) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        // const locationLines = pdf.splitTextToSize(exp.location, rightColumnWidth - 5);
        pdf.text(exp.location, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += lineSpacing + 1;
      }
      // Position
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      const titleLines = pdf.splitTextToSize(exp.title || '', rightColumnWidth - 5);
      pdf.text(exp.title || '', rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      rightY += titleLines.length * lineSpacing + 1;
      
      // Summary
      if (exp.summary) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const summaryLines = pdf.splitTextToSize(exp.summary, rightColumnWidth - 5);
        checkRightPageOverflow(summaryLines.length*lineSpacing);
        pdf.text(exp.summary, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += summaryLines.length * lineSpacing;
      }
      // Description
      if (Array.isArray(exp.description) && exp.description.length > 0) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('helvetica', 'normal');
        exp.description.forEach((desc) => {
          const descLines = pdf.splitTextToSize(`• ${desc}`, rightColumnWidth - 5);
          checkRightPageOverflow(lineSpacing * descLines.length);
          pdf.setFontSize(9);
          pdf.text(`• ${desc}`, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
          rightY += descLines.length * lineSpacing;
        });
      }
      rightY += smallLineSpacing*2;
    });
    rightY += lineSpacing + smallLineSpacing;
  }

  // Education
  if (Array.isArray(cvData.education) && cvData.education.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('EDUCATION', rightColumnStart, rightY, GraduationCap_Icon);
    cvData.education.forEach((edu) => {
      checkRightPageOverflow(lineSpacing * 4);
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const dateRange = processDateRange(edu.start_date, edu.end_date)
      const degreeLines = pdf.splitTextToSize(edu.degree || '', rightColumnWidth - dateRange.length*1.6);
      pdf.text(degreeLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
      
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.6, rightY);

      rightY += degreeLines.length * lineSpacing + 1;
      const institutionLines = pdf.splitTextToSize((edu.institution || ''), rightColumnWidth - 30);
      pdf.text((edu.institution || ''), rightColumnStart, rightY, { maxWidth: rightColumnWidth - 30});
      rightY += institutionLines.length * lineSpacing + 1;
      
      if (edu.field) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const fieldLines = pdf.splitTextToSize(edu.field, rightColumnWidth - 30);
        pdf.text(fieldLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 30});
        rightY += fieldLines.length * lineSpacing * 2;
      }
    });
    rightY += lineSpacing + smallLineSpacing;
  }

  // Projects
  if (Array.isArray(cvData.projects) && cvData.projects.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('PROJECTS', rightColumnStart, rightY, Briefcase_Icon);
    cvData.projects.forEach((project) => {
      let blockHeight = lineSpacing * 2;
      checkRightPageOverflow(blockHeight);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const dateRange = processDateRange(project.start_date, project.end_date)
      const projectNameLines = pdf.splitTextToSize((project.project_name || '').toUpperCase(), rightColumnWidth - dateRange.length*1.6);
      pdf.text((project.project_name || ''), rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
      pdf.setFontSize(9);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.6, rightY);
      console.log(projectNameLines.length)
      rightY += projectNameLines.length * lineSpacing + 1;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      if (project.organization) {
        console.log(project.organization)
        const orgLines = pdf.splitTextToSize(project.organization, rightColumnWidth - 5);
        pdf.text(project.organization, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += orgLines.length * lineSpacing + 2;
      }
     
      if (project.description) blockHeight = pdf.splitTextToSize(project.description, rightColumnWidth - 5).length * lineSpacing;
      checkRightPageOverflow(blockHeight);
      const descLines = pdf.splitTextToSize(project.description || '', rightColumnWidth - 5);
      pdf.setFontSize(9);
      pdf.text(project.description || '', rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      rightY += descLines.length * lineSpacing + smallLineSpacing;
    });
    rightY += lineSpacing + smallLineSpacing;
  }

  // Download the PDF
  pdf.save(filename);
};