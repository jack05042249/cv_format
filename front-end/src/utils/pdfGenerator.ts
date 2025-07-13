import jsPDF from 'jspdf';
import { CVData, GenerationOptions } from '../types/cv';
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

//Fonts
import '../font/lato/Lato-Black-bold.js'
import '../font/lato/Lato-Bold-bold.js'
import '../font/lato/Lato-Regular-normal.js'
import '../font/lato/Lato-Light-normal.js'

// console.log(typeof(User_Icon))
export const generatePDF = async (
  cvData: CVData,
  options: GenerationOptions,
  filename: string
) => {
  console.log(options)
  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageWidth = pdf.internal.pageSize.width;
  console.log(pageWidth)
  const pageHeight = pdf.internal.pageSize.height;

  // Define colors
  const redColor = [185, 25, 47]; // #B9192F
  const grayColor = [188, 190, 192]; // #BCBEC0
  const blackColor = [0, 0, 0];

  // Layout variables for flexibility
  const margin = 15;
  const headerSpacing = 8;
  const headersectionSpacing = 15
  const sectionSpacing = 10;
  const sectionpadding = 7;
  // const content_margin = 4
  const lineSpacing = 5;
  const smallLineSpacing = 2;
  const contactSpacing = 7;
  const leftColumnRatio = 0.35;
  const leftColumnWidth = (pageWidth * leftColumnRatio - margin - 7);
  const rightColumnStart = pageWidth * leftColumnRatio + 12; // 8mm gap
  const rightColumnWidth = pageWidth - rightColumnStart - margin;

  // LingHeight Set 
  pdf.setLineHeightFactor(1.5)

  let pagenumber = 1
  let rightpagenumber = 1

  let yPos = 20; // Default value, will be updated if personal info is included
  
  // Header section
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  
  // Name and title (left side)
  const firstName = cvData.first_name || '';
  const lastName = cvData.last_name || '';
  
  if (options.includePersonalInfo) {
    pdf.setFontSize(24);
    pdf.setFont('Lato-Black', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    
    // Handle different name display options
    if (options.downloadOption === 'name_initial') {
      // Show first name and last name initial
      pdf.text(firstName.toUpperCase(), margin, yPos);
      yPos += 11;
      pdf.text(lastName.charAt(0).toUpperCase(), margin, yPos);
      yPos += headerSpacing;
    } else {
      // Show full name (both full and name_only options)
      pdf.text(firstName.toUpperCase(), margin, yPos);
      yPos += 11;
      pdf.text(lastName.toUpperCase(), margin, yPos);
      yPos += headerSpacing;
    }
  } else {
    pdf.setFontSize(24);
    pdf.setFont('Lato-Black', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.text('PROFESSIONAL CV', margin, yPos);
    yPos += headerSpacing + 4;
  }

  pdf.setFontSize(12);
  pdf.setFont('Lato-Regular', 'normal');
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  const titleText = (cvData.title || '');
  const safeTitle_mini = titleText.replace(/●/g, '|')

  const maxTitleWidth = pageWidth * 0.5;
  const titleWidth = pdf.getTextWidth(safeTitle_mini);
  const titlelines = Math.floor((titleWidth + maxTitleWidth - 1) / maxTitleWidth)
  
  const safetitle = safeTitle_mini.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  pdf.text(safetitle, margin, yPos, { maxWidth: maxTitleWidth});
  yPos += titlelines * 4;
  
  // Header Logo Image
  pdf.addImage(Logo, 'PNG', pageWidth - 38, 8, 20, 0);
  
  // Contact info (right side) - only show for 'full' option
  if (options.includePersonalInfo && options.includePrivateInfo && options.downloadOption == 'full' && cvData.contact) {
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10); 
    pdf.setFont('Lato-Regular', 'normal');
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
    let contactY = margin;
    let contactX = pageWidth - margin - maxlength*1.6;
    if (contactX > pageWidth*0.55){
      contactX = pageWidth*0.55
    }
    
    if (cvData.contact.location) {
      contactY += contactSpacing;
      const safe = cvData.contact.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pdf.addImage(Address_Icon, 'PNG', contactX, contactY - 3.5, 4, 4);
      pdf.text(safe, contactX + 6, contactY);
    }
    if (cvData.contact.phone) {
      contactY += contactSpacing;
      const safe = cvData.contact.phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pdf.addImage(Phone_Icon, 'PNG', contactX, contactY - 3.5, 4, 4);
      pdf.text(safe, contactX + 6, contactY);
    }
    if (telegramUrl) {
      contactY += contactSpacing;
      pdf.addImage(Telegram_Icon, 'PNG', contactX, contactY - 3.5, 4, 4);
      pdf.text(telegramUrl, contactX + 6, contactY);
    }
    if (cvData.contact.email) {
      contactY += contactSpacing;
      pdf.addImage(Email_Icon, 'PNG', contactX, contactY - 3.5, 4, 4);
      pdf.text(cvData.contact.email, contactX + 6, contactY);
    }
    contactY += 3
    if (contactY > yPos){
      yPos = contactY
    }
  }

  // Red separator line
  yPos += 5
  pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(0, yPos, pageWidth, yPos);
  pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
  const x1 = 0, y1 = yPos-1;
  const x2 = pageWidth*leftColumnRatio -2, y2 = yPos-1;
  const x3 = pageWidth*leftColumnRatio, y3 = yPos;
  const x4 = 0, y4 = yPos;
  
  // Draw and fill triangle using `lines`
  pdf.lines(
    [
      [x2 - x1, y2 - y1], // From x1,y1 to x2,y2
      [x3 - x2, y3 - y2], // x2,y2 to x3,y3
      [x4 - x3, y4 - y3], 
      [x1 - x4, y1 - y4],// x3,y3 to x1,y1
    ],
    x1,
    y1,
    [1, 1], // scale
    'FD'     // 'F' = fill, 'D' = draw, 'FD' = fill and draw
  );
  
  yPos += headersectionSpacing;

  // Draw vertical separator line on the first page
  pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth*leftColumnRatio, yPos - 4, pageWidth*leftColumnRatio, pageHeight - margin);

  // Helper function for section headers
  const addSectionHeader = (title: string, x: number, y: number, icon:string, isLeftColumn = false) => {
    pdf.addImage(icon, 'PNG', x - 6, y - 3.5, 4, 4);
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.setFontSize(11.5);
    pdf.setFont('Lato-Black', 'bold');
    pdf.text(title, x, y);
    
    // Underline
    const headerWidth = isLeftColumn ? 15 : 20;
    const grayWidth = isLeftColumn ? leftColumnWidth - 15 : rightColumnWidth - 20;
    
    pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(x, y + 3, x + headerWidth, y + 3);
    
    pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
    pdf.line(x + headerWidth, y + 3, x + headerWidth + grayWidth, y + 3);
    
    return y + sectionSpacing + 3;
  };

  // LEFT COLUMN
  let leftY = yPos;
  let rightY = yPos; // <-- Start both columns just after the header

  // Helper function to check and add new page for left column
  const checkLeftPageOverflow = (nextBlockHeight: number) => {
    if (leftY + nextBlockHeight > pageHeight - margin) {
      pdf.addPage();
      pagenumber += 1
      leftY = margin;
      // Draw separator line on new page
      pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth*leftColumnRatio, margin - 3, pageWidth*leftColumnRatio, pageHeight - margin);
    }
  };

  // Professional Summary
  if (cvData.summary) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('PROFESSIONAL SUMMARY', margin, leftY, User_Icon, true);
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10);
    pdf.setFont('Lato-Light', 'normal');
    
    // const summaryWidth = pdf.splitTextToSize(cvData.summary, leftColumnWidth).length;
    const summaryheight = pdf.getLineHeight() / 2.835
    const summaryLines = pdf.splitTextToSize(cvData.summary, leftColumnWidth).length;
    checkLeftPageOverflow(summaryLines*summaryheight);
    pdf.text(cvData.summary, margin, leftY, { maxWidth: leftColumnWidth});
    console.log(summaryLines, summaryheight)
    leftY += summaryLines*summaryheight;

    leftY += sectionpadding
  }

  // Education
  if (Array.isArray(cvData.education) && cvData.education.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('EDUCATION', margin, leftY, GraduationCap_Icon, true);
    cvData.education.forEach((edu) => { 
      const eduheight = pdf.getLineHeight()/2.835
      const institutionLines = pdf.splitTextToSize((edu.institution || ''), leftColumnWidth);
      const dateRange = processDateRange(edu.start_date, edu.end_date)
      const degreeLines = pdf.splitTextToSize(edu.degree || '', leftColumnWidth);
      
      const education_institution_year = [...institutionLines, dateRange]

      checkLeftPageOverflow(education_institution_year.length * eduheight);
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(13);
      pdf.setFont('Lato-Black', 'bold');
      pdf.text("•", margin-5.5, leftY)
      
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Light', 'normal');

      pdf.text(education_institution_year, margin, leftY, { maxWidth: leftColumnWidth});
      leftY += education_institution_year.length * eduheight;
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.text(degreeLines, margin, leftY, { maxWidth: leftColumnWidth});
      leftY += degreeLines.length * eduheight;
      // pdf.text((edu.institution || ''), margin, leftY, { maxWidth: leftColumnWidth});
      
      if (edu.field) {
        pdf.setFontSize(10);
        pdf.setFont('Lato-Light', 'normal');
        const fieldLines = pdf.splitTextToSize(edu.field, leftColumnWidth);
        pdf.text(fieldLines, margin, leftY, { maxWidth: leftColumnWidth});
        leftY += fieldLines.length * eduheight;
      }
      leftY += smallLineSpacing;
    });
    leftY += sectionpadding;
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
        pdf.setFont('Lato-Bold', 'bold');
        pdf.text(linkType, margin, leftY);
        leftY += lineSpacing + 1;
        pdf.setFont('Lato-Light', 'normal');
        const linklineheight = pdf.getLineHeight()/2.835
        const linkLines = pdf.splitTextToSize(linkUrl, leftColumnWidth - 5);
        checkLeftPageOverflow(linkLines.length * linklineheight + smallLineSpacing);
        pdf.text(linkUrl, margin, leftY , { maxWidth: leftColumnWidth - 5 });
        leftY += linkLines.length* linklineheight + smallLineSpacing;
      }
    });
    
    leftY += sectionpadding;
  }

  // Languages
  if (cvData.languages_spoken && cvData.languages_spoken.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('LANGUAGES', margin, leftY, Language_Icon, true);
    cvData.languages_spoken.forEach((language) => {
      const lang = typeof language === 'string' ? language : language.language || language.name || '';
      const level = typeof language === 'string' ? 'Intermediate' : language.level || 'Intermediate';
      checkLeftPageOverflow(lineSpacing * 2);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Light', 'normal');
      const langLines = pdf.splitTextToSize(lang, leftColumnWidth - 5);
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
      pdf.rect(margin, leftY + 2, barWidth, 1, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(margin, leftY + 2, barWidth * levelValue, 1, 'F');
      leftY += langLines.length * lineSpacing + lineSpacing + smallLineSpacing;
    });
    leftY += lineSpacing + smallLineSpacing;
  }

  // Certifications
  if (cvData.certifications && cvData.certifications.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('CERTIFICATIONS', margin, leftY, BookOpen_Icon, true);
    cvData.certifications.forEach((cert) => {
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(13);
      pdf.setFont('Lato-Black', 'bold');
      pdf.text("•", margin-5.5, leftY)

      if (cert.issuer) {  
        pdf.setFontSize(10);
        pdf.setFont('Lato-Light', 'normal');
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        const issuerLines = pdf.splitTextToSize(cert.issuer, leftColumnWidth);
        pdf.text(cert.issuer, margin, leftY, { maxWidth: leftColumnWidth});
        leftY += issuerLines.length * lineSpacing + 1;
      }

      if (cert.date) {  
        pdf.setFontSize(10);
        pdf.setFont('Lato-Light', 'normal');
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        const dateLines = pdf.splitTextToSize(cert.date, leftColumnWidth);
        pdf.text(cert.date, margin, leftY, { maxWidth: leftColumnWidth});
        leftY += dateLines.length * lineSpacing + 1;
      }

      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Bold', 'bold');
      
      // const certwidth = pdf.getTextWidth((cert.name || ''))
      const certlines = pdf.splitTextToSize((cert.name || ''),  leftColumnWidth).length
      checkLeftPageOverflow(lineSpacing * certlines);
      pdf.text((cert.name || ''), margin, leftY, { maxWidth: leftColumnWidth});
      leftY += certlines * pdf.getLineHeight()/2.835;
      
      leftY += smallLineSpacing;
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
      rightY = margin;
      // Draw separator line on new page
      pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth*leftColumnRatio, margin - 3, pageWidth*leftColumnRatio, pageHeight - margin);
    }
  };
  // Work Experience
  if (Array.isArray(cvData.experience) && cvData.experience.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('WORK EXPERIENCE', rightColumnStart, rightY, Briefcase_Icon);
    cvData.experience.forEach((exp) => {
      checkRightPageOverflow(lineSpacing * 4);
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(13);
      pdf.setFont('Lato-Black', 'bold');
      pdf.text("•", rightColumnStart-5.5, rightY)
      // Company & Dates
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(11);
      pdf.setFont('Lato-Light', 'normal');
      const dateRange = processDateRange(exp.start_date, exp.end_date)
      const companyLines = pdf.splitTextToSize((exp.company || ''), rightColumnWidth - dateRange.length*1.6);
      pdf.text((exp.company || ''), rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
      pdf.setFontSize(10);
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.9, rightY);
      
      rightY += companyLines.length * lineSpacing + 1;
      // Location
      if (exp.location) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFontSize(10);
        pdf.setFont('Lato-Light', 'normal');
        // const locationLines = pdf.splitTextToSize(exp.location, rightColumnWidth - 5);
        pdf.text(exp.location, rightColumnStart, rightY, { maxWidth: rightColumnWidth});
        rightY += lineSpacing + 1;
      }
      // Position
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.setFontSize(10);
      const titleLines = pdf.splitTextToSize(exp.title || '', rightColumnWidth);
      pdf.text(exp.title?.toUpperCase() || '', rightColumnStart, rightY, { maxWidth: rightColumnWidth});
      rightY += titleLines.length * lineSpacing + 1;
      
      // Summary
      if (exp.summary) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('Lato-Light', 'normal');
        pdf.setFontSize(10);
        const summaryLines = pdf.splitTextToSize(exp.summary, rightColumnWidth);
        checkRightPageOverflow(summaryLines.length*lineSpacing);
        pdf.text(exp.summary, rightColumnStart, rightY, { maxWidth: rightColumnWidth});
        rightY += summaryLines.length * lineSpacing;
      }
      // Description
      if (Array.isArray(exp.description) && exp.description.length > 0) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('Lato-Light', 'normal');
        exp.description.forEach((desc) => {
          const descwidth = pdf.getTextWidth(`• ${desc}`.trim())
          const descLines = Math.floor((descwidth + rightColumnWidth - 1) / rightColumnWidth)
          checkRightPageOverflow(lineSpacing * descLines);
          pdf.setFontSize(10);
          pdf.text(`• ${desc}`, rightColumnStart, rightY, { maxWidth: rightColumnWidth});
          rightY += descLines * lineSpacing + 2;
        });
      }
      rightY += smallLineSpacing*2;
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
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(13);
      pdf.setFont('Lato-Black', 'bold');
      pdf.text("•", rightColumnStart-5.5, rightY)

      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Bold', 'bold');
      const dateRange = processDateRange(project.start_date, project.end_date)
      const projectNameLines = pdf.splitTextToSize((project.project_name || '').toUpperCase(), rightColumnWidth - dateRange.length*1.6);
      pdf.text((project.project_name || ''), rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
      pdf.setFontSize(10);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFont('Lato-Light', 'normal');
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.6, rightY);
      console.log(projectNameLines.length)
      rightY += projectNameLines.length * lineSpacing + 1;
      pdf.setFontSize(10);
      pdf.setFont('Lato-Light', 'normal');
      if (project.organization) {
        console.log(project.organization)
        const orgLines = pdf.splitTextToSize(project.organization, rightColumnWidth - 5);
        pdf.text(project.organization, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += orgLines.length * lineSpacing + 2;
      }
     
      if (project.description) blockHeight = pdf.splitTextToSize(project.description, rightColumnWidth - 5).length * lineSpacing;
      checkRightPageOverflow(blockHeight);
      const descLines = pdf.splitTextToSize(project.description || '', rightColumnWidth - 5);
      pdf.setFontSize(10);
      pdf.text(project.description || '', rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      rightY += descLines.length * lineSpacing + smallLineSpacing;
    });
    rightY += lineSpacing + smallLineSpacing;
  }

  // Skills
  if (Array.isArray(cvData.skills) && cvData.skills.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('SKILLS', rightColumnStart, rightY, Award_Icon);
    let skill_total: string[] = []
    cvData.skills.forEach((skill) => {
      skill_total = [...skill_total, ...skill.skills]
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFont('Lato-Light', 'normal');
      pdf.setFontSize(10);
      const skilllineheight = pdf.getLineHeight()/2.835
      const skillwidth = pdf.getTextWidth(skill.skills.join(", ").trim())
      const skillLines = Math.floor((skillwidth + rightColumnWidth - 1) / rightColumnWidth)
      checkRightPageOverflow(lineSpacing * (skillLines + 1));
      pdf.text(skill.skills.join(", "), rightColumnStart, rightY, { maxWidth: rightColumnWidth });
      rightY += skilllineheight * (skillLines - 1)
    
      const skillLevel = 0.8;
      pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.rect(rightColumnStart, rightY + 2, rightColumnWidth, 1, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(rightColumnStart, rightY + 2, rightColumnWidth * skillLevel, 1, 'F');
      rightY += skilllineheight*2;
    });
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFont('Lato-Light', 'normal');
    pdf.setFontSize(10);
    // for (let i = 0; i < skill_total.length; i += 2) {
    //   const first = skill_total[i];
    //   const second = skill_total[i + 1] ?? null; // handle case where second might not exist

    //   const skillcolumnwidth = (rightColumnWidth - 10)/2
    //   let skillline = 0
    //   // First skill
    //   const firstwidth = pdf.getTextWidth(first.trim())
    //   const firstLines = Math.floor((firstwidth + skillcolumnwidth - 1) / skillcolumnwidth)
    //   checkRightPageOverflow(lineSpacing * (firstLines + 1));
    //   pdf.text(first, rightColumnStart, rightY, { maxWidth: skillcolumnwidth });
    //   skillline = firstLines
    //   const skillLevel = 0.8;
    //   pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
    //   pdf.rect(rightColumnStart, rightY + 2, skillcolumnwidth, 1, 'F');
    //   pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    //   pdf.rect(rightColumnStart, rightY + 2, skillcolumnwidth * skillLevel, 1, 'F');

    //   if(second){
    //     const secondwidth = pdf.getTextWidth(second.trim())
    //     const secondLines = Math.floor((secondwidth + skillcolumnwidth - 1) / skillcolumnwidth)
    //     checkRightPageOverflow(lineSpacing * (secondLines + 1));
    //     pdf.text(second, rightColumnStart + skillcolumnwidth + 10, rightY, { maxWidth: skillcolumnwidth });

    //     pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
    //     pdf.rect(rightColumnStart + skillcolumnwidth + 10, rightY + 2, skillcolumnwidth, 1, 'F');
    //     pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    //     pdf.rect(rightColumnStart + skillcolumnwidth + 10, rightY + 2, skillcolumnwidth * skillLevel, 1, 'F');

    //     skillline = Math.max(firstLines, secondLines)
    //   }

    //   rightY += lineSpacing*skillline + smallLineSpacing*2;
    //   // console.log("Pair:", first, second);
    // }
    rightY += sectionSpacing / 2;
  }

  // Download the PDF
  pdf.save(filename);
};