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
  const pdf = new jsPDF({ format: [200, 280], unit: 'mm' });
  const pageWidth = pdf.internal.pageSize.width;
  console.log(pageWidth)
  const pageHeight = pdf.internal.pageSize.height;

  // Define colors
  const redColor = [220, 38, 38]; //rgb(255, 0, 34)
  const grayColor = [188, 190, 192]; // #BCBEC0
  const blackColor = [30, 30, 30]; //rgb(71, 70, 70)

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
  const leftColumnRatio = 0.37;
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
      pdf.text(`${firstName.toUpperCase()} ${lastName.charAt(0).toUpperCase()}`, margin, yPos);
      yPos += headerSpacing;
    } else {
      // Show full name (both full and name_only options)
      pdf.text(`${firstName.toUpperCase()} ${lastName.toUpperCase()}`, margin, yPos);
      yPos += headerSpacing;
    }
  } else {
    pdf.setFontSize(24);
    pdf.setFont('Lato-Black', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.text('PROFESSIONAL CV', margin, yPos);
    yPos += headerSpacing + 4;
  }
  let contactY = yPos

  pdf.setFontSize(12);
  pdf.setFont('Lato-Regular', 'normal');
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  const titleText = (cvData.title || '');
  const safeTitle_mini = titleText.replace(/●/g, '|')

  const maxTitleWidth = pageWidth * 0.5;
  const titleWidth = pdf.getTextWidth(safeTitle_mini);
  const titlelines = Math.floor((titleWidth + maxTitleWidth - 1) / maxTitleWidth)
  const titleheight = pdf.getLineHeight()/2.835
  const safetitle = safeTitle_mini.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  pdf.text(safetitle, margin, yPos, { maxWidth: maxTitleWidth});
  yPos += titlelines * titleheight;
  // Header Logo Image
  pdf.addImage(Logo, 'PNG', pageWidth - 38, 8, 25, 0);
  
  const optimizeTwoColumnWidths = (
    contact_info: { contact: string; image: string; width: number }[]
  ): [{ contact: string; image: string; width: number }[], number, number, number] => {
    // Step 1: Sort items descending by width
    const sorted = [...contact_info].sort((a, b) => a.width - b.width);

    let solo: typeof contact_info[0] | null = null;
    if (sorted.length % 2 === 1) {
      solo = sorted.pop()!; // Remove the longest (last after sort ascending)
    }
    const result: typeof contact_info = [];
    let left = 0;
    let right = sorted.length - 1;
    let maxwidthleft = 0
    let maxwidthright = 0
    let space = 10
    while (left <= right) {
      if (left === right) {
        // Odd number, push the last single item
        result.push(sorted[left]);
        break;
      }
      // Pair the widest with narrowest to balance row width
      result.push(sorted[left]);
      result.push(sorted[right]);
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
      result.push(solo)
      if (solo.width > maxwidthleft + maxwidthright + 10) {
        space = solo.width - (maxwidthleft + maxwidthright)
      }
    }
    return [result, maxwidthleft, maxwidthright, space];
  }

  // Contact info (right side) - only show for 'full' option
  if (options.includePersonalInfo && options.includePrivateInfo && options.downloadOption == 'full' && cvData.contact) {
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(9); 
    pdf.setFont('Lato-Regular', 'normal');
    let telegramUrl = ""
    if(cvData.contact.links){
      telegramUrl = Object.entries(cvData.contact.links).find(
        ([key]) => key.toLowerCase() === "telegram"
      )?.[1] || "";
    }
    let contact_info: { contact: string; image: string; width: number }[] = [];
    if (cvData.contact.location) {
      const safe = cvData.contact.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      contact_info = [
        ...contact_info,
        {
          contact: safe,
          image : Address_Icon,
          width : pdf.getTextWidth(cvData.contact.location)
        }
      ]
    }
    if (cvData.contact.email) {
      const safe = cvData.contact.email.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      contact_info = [
        ...contact_info,
        {
          contact: safe,
          image : Email_Icon,
          width : pdf.getTextWidth(cvData.contact.email)
        }
      ]
    }
    if (cvData.contact.phone) {
      const safe = cvData.contact.phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      contact_info = [
        ...contact_info,
        {
          contact: safe,
          image : Phone_Icon,
          width : pdf.getTextWidth(cvData.contact.phone)
        }
      ]
    }
    if (telegramUrl) {
      contact_info = [
        ...contact_info,
        {
          contact: telegramUrl,
          image : Telegram_Icon,
          width : pdf.getTextWidth(telegramUrl)
        }
      ]
    }
    
    const [contact_info_sorted, maxwidthleft, maxwidthright, space]: [{ contact: string; image: string; width: number }[], number, number, number] = optimizeTwoColumnWidths(contact_info);
    
    contactY = contactY - contactSpacing
    const contactX = pageWidth - margin - space - maxwidthright - maxwidthleft -5
    // if ( contactX > pageWidth - margin - space - maxwidthright - maxwidthleft){
    //   contactX = pageWidth - margin - space - maxwidthright - maxwidthleft
    // }
    for (let i = 0; i < contact_info_sorted.length; i += 2) {
      contactY += contactSpacing;
      const first = contact_info_sorted[i];
      const second = contact_info_sorted[i + 1] ?? null
      
      pdf.addImage(first.image, 'PNG', contactX, contactY - 3.5, 4, 4);
      pdf.text(first.contact, contactX + 6, contactY);

      if (second) {
        pdf.addImage(second.image, 'PNG', contactX + space + maxwidthleft, contactY - 3.5, 4, 4);
        pdf.text(second.contact, contactX + space + 6 + maxwidthleft, contactY);
      }
    }
    contactY += 3
    if (contactY > yPos){
      yPos = contactY
    }
  }

  // Red separator line
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
    const grayWidth = isLeftColumn ? leftColumnWidth - 15 : rightColumnWidth - margin;
    
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
      pdf.line(pageWidth*leftColumnRatio, margin - 3, pageWidth*leftColumnRatio, pageHeight - margin +3);
    }
  };

  const drawStyledText = (
    pdf: jsPDF, 
    segments: { text: string; font: string; style: string, color: number[] }[], 
    x: number,  
    maxWidth: number, 
    lineHeight: number
  ) =>{
    let textX = x
    segments.forEach((segment, index) => {
      pdf.setFont(segment.font, segment.style);
      pdf.setTextColor(segment.color[0], segment.color[1], segment.color[2])
      const words = pdf.splitTextToSize(segment.text, maxWidth - textX + x)
      if(words.length == 1) {
        checkLeftPageOverflow(lineHeight)
        const wordWidth = pdf.getTextWidth(segment.text);
        pdf.text(segment.text, textX, leftY);
        textX += wordWidth;
        if(index == segments.length - 1){
          leftY += lineHeight
        }
      } else {
        checkLeftPageOverflow(lineHeight)
        pdf.text(words[0], textX, leftY);
        textX = x;
        leftY += lineHeight;
        
        const lefttext = segment.text.split(words[0])[1]
        const lefttextsplit = pdf.splitTextToSize(lefttext, maxWidth)
        lefttextsplit.forEach((element: string) => {
          checkLeftPageOverflow(lineHeight)
          pdf.text(element, textX, leftY, {maxWidth: maxWidth})
          leftY += lineHeight
        });
      }
    });
    return { textX, leftY };
  }
  // Professional Summary
  if (cvData.summary) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('PROFESSIONAL SUMMARY', margin, leftY, User_Icon, true);
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10);
    pdf.setFont('Lato-Regular', 'normal');
    
    // const summaryWidth = pdf.splitTextToSize(cvData.summary, leftColumnWidth).length;
    const summary = [
      // { text: `• `, font: 'Lato-Light', style: 'normal' },
      { text: cvData.summary,  font: 'Lato-Regular', style: 'normal', color: blackColor  },
    ];
    
    const summaryheight = pdf.getLineHeight() / 2.835
    const summaryLines = pdf.splitTextToSize(cvData.summary, leftColumnWidth).length;
    if (leftY + summaryLines*summaryheight > pageHeight - margin){
      drawStyledText(pdf, summary, margin, leftColumnWidth, summaryheight)
    } else {
      pdf.text(cvData.summary, margin, leftY, { maxWidth: leftColumnWidth});
      leftY += summaryLines*summaryheight;
    }
    leftY += sectionpadding
  }

  // Skills
  if (Array.isArray(cvData.skills) && cvData.skills.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('SKILLS', margin, leftY, Award_Icon, true);
    let skill_total: string[] = []
    cvData.skills.forEach((skill) => {
      skill_total = [...skill_total, ...skill.skills]
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFont('Lato-Regular', 'normal');
      pdf.setFontSize(10);
      const skilllineheight = pdf.getLineHeight()/2.835
      const skilltext = [
        // { text: `• `, font: 'Lato-Light', style: 'normal' },
        { text: `${skill.category}: `, font: 'Lato-Bold', style: "bold", color: blackColor },
        { text: `${skill.skills.join(', ').trim()}`, font: 'Lato-Regular', style: 'normal', color:blackColor }
      ];
      const skillwidth = pdf.splitTextToSize(`• ${skill.category}: ${skill.skills.join(', ').trim()}`, rightColumnWidth)
      const skillLines = skillwidth.length//Math.floor((skillwidth + rightColumnWidth - 1) / rightColumnWidth)
      checkLeftPageOverflow(lineSpacing * skillLines);
      drawStyledText(pdf, skilltext, margin, leftColumnWidth, skilllineheight)
      const level = skill.level || 'Intermediate';
      let levelValue = 0.5; // Default
      if (level === 'Expert') levelValue = 1.0;
      else if (level === 'Advanced') levelValue = 0.75;
      else if (level === 'Intermediate') levelValue = 0.5;
      else if (level === 'Beginner') levelValue = 0.25;

      pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.rect(margin, leftY-skilllineheight+2, leftColumnWidth, 1, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(margin, leftY-skilllineheight+2, leftColumnWidth * levelValue, 1, 'F');
      leftY += skillLines + 2
    });
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFont('Lato-Regular', 'normal');
    pdf.setFontSize(10);
    leftY += sectionSpacing / 2;
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
      pdf.setFontSize(10);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.text("•", margin-5.5, leftY)
      
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Regular', 'normal');

      pdf.text(education_institution_year, margin, leftY, { maxWidth: leftColumnWidth});
      leftY += education_institution_year.length * eduheight;
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.text(degreeLines, margin, leftY, { maxWidth: leftColumnWidth});
      leftY += degreeLines.length * eduheight;
      // pdf.text((edu.institution || ''), margin, leftY, { maxWidth: leftColumnWidth});
      
      if (edu.field) {
        pdf.setFontSize(10);
        pdf.setFont('Lato-Regular', 'normal');
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
        pdf.setFont('Lato-Regular', 'normal');
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
      pdf.setFont('Lato-Regular', 'normal');
      const langLines = pdf.splitTextToSize(lang, leftColumnWidth - 5);
      pdf.text(langLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      const barWidth = leftColumnWidth;
      // Handle CEFR levels (A1, A2, B1, B2, C1, C2) and other levels
      let levelValue = 0.5; // Default
      if (level === 'C2' || level === 'Native') levelValue = 1.0;
      else if (level === 'C1' || level === 'Advanced') levelValue = 1.0;
      else if (level === 'B2' || level === 'Upper Intermediate') levelValue = 0.75;
      else if (level === 'B1' || level === 'Intermediate') levelValue = 0.6;
      else if (level === 'A2' || level === 'Elementary') levelValue = 0.45;
      else if (level === 'A1' || level === 'Beginner') levelValue = 0.25;
      
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
      pdf.setFontSize(10);
      pdf.setFont('Lato-Blod', 'bold');
      pdf.text("•", margin-5.5, leftY)

      if (cert.issuer) {  
        pdf.setFontSize(10);
        pdf.setFont('Lato-Regular', 'normal');
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        const issuerLines = pdf.splitTextToSize(cert.issuer, leftColumnWidth);
        pdf.text(cert.issuer, margin, leftY, { maxWidth: leftColumnWidth});
        leftY += issuerLines.length * lineSpacing + 1;
      }

      if (cert.date) {  
        pdf.setFontSize(10);
        pdf.setFont('Lato-Regular', 'normal');
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
    if (rightY + nextBlockHeight > pageHeight - margin + 5) {
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
      pdf.line(pageWidth*leftColumnRatio, margin - 3, pageWidth*leftColumnRatio, pageHeight - margin + 3);
    }
  };

  const multilineText = (
    pdf: jsPDF, 
    text: string, 
    maxWidth: number, 
    lineHeight: number,
  ) =>{
    const words = pdf.splitTextToSize(text, maxWidth)
    words.forEach((element: string) => {
      checkRightPageOverflow(lineHeight)
      pdf.text(element, rightColumnStart, rightY);
      rightY += lineHeight;
    });
  }
  // Work Experience
  if (Array.isArray(cvData.experience) && cvData.experience.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('WORK EXPERIENCE', rightColumnStart, rightY, Briefcase_Icon);
    cvData.experience.forEach((exp) => {
      checkRightPageOverflow(lineSpacing * 4);
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.text("•", rightColumnStart-5.5, rightY)
      // Company & Dates
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(11);
      pdf.setFont('Lato-Regular', 'normal');
      let dateRange = processDateRange(exp.start_date, exp.end_date)
      if (!exp.end_date){
        dateRange = dateRange + " - Present"
      }
      const companyLines = pdf.splitTextToSize((exp.company || ''), rightColumnWidth - dateRange.length*1.6);
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.9, rightY);
      if(exp.company){
        pdf.text(exp.company, rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
        pdf.setFontSize(10);
        rightY += companyLines.length * lineSpacing + 1;
      }  
      
      // Location
      if (exp.location) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFontSize(10);
        pdf.setFont('Lato-Regular', 'normal');
        // const locationLines = pdf.splitTextToSize(exp.location, rightColumnWidth - 5);
        pdf.text(exp.location, rightColumnStart, rightY, { maxWidth: rightColumnWidth});
        rightY += lineSpacing + 1;
      }
      // Position
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.setFontSize(10);
      if(exp.title){
        const titleLines = pdf.splitTextToSize(exp.title, rightColumnWidth);
        pdf.text(exp.title.toUpperCase(), rightColumnStart, rightY, { maxWidth: rightColumnWidth});
        rightY += titleLines.length * lineSpacing + 1;
      }
        
      // Summary
      if (exp.summary) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('Lato-Regular', 'normal');
        pdf.setFontSize(10);
        const summaryLines = pdf.splitTextToSize(exp.summary, rightColumnWidth);
        checkRightPageOverflow(summaryLines.length*lineSpacing);
        pdf.text(exp.summary, rightColumnStart, rightY, { maxWidth: rightColumnWidth});
        rightY += summaryLines.length * lineSpacing;
      }
      // Description
      if (Array.isArray(exp.description) && exp.description.length > 0) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('Lato-Regular', 'normal');
        exp.description.forEach((desc) => {
          const descwidth = pdf.splitTextToSize(`• ${desc}`, rightColumnWidth)
          const descLines = descwidth.length//Math.floor((descwidth + rightColumnWidth - 1) / rightColumnWidth)
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
      checkRightPageOverflow(lineSpacing * 2);
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Bold', 'bold');
      pdf.text("•", rightColumnStart-5.5, rightY)

      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('Lato-Bold', 'bold');
      const dateRange = processDateRange(project.start_date, project.end_date)
      const projectNameWidth = pdf.getTextWidth((project.project_name || ''))
      const projectLines = Math.floor((projectNameWidth + pageWidth - margin - dateRange.length*1.6 - rightColumnStart - 1 ) / (pageWidth - margin - dateRange.length*1.6 - rightColumnStart));
      pdf.text((project.project_name || ''), rightColumnStart, rightY, { maxWidth: rightColumnWidth - dateRange.length*1.6 });
      pdf.setFontSize(10);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFont('Lato-Regular', 'normal');
      pdf.text(dateRange, pageWidth - margin - dateRange.length*1.6, rightY);
      console.log(projectLines)
      rightY += projectLines * lineSpacing + 1;
      pdf.setFontSize(10);
      pdf.setFont('Lato-Regular', 'normal');
      if (project.organization) {
        console.log(project.organization)
        const orgLines = pdf.splitTextToSize(project.organization, rightColumnWidth - 5);
        pdf.text(project.organization, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += orgLines.length * lineSpacing + 2;
      }
     
      if (project.description) {
        const projectheight = pdf.getLineHeight()/2.835
        multilineText(pdf, project.description, rightColumnWidth, projectheight)
        rightY += smallLineSpacing;
        }
    });
    rightY += lineSpacing + smallLineSpacing;
  } 
  // Skills
  // if (Array.isArray(cvData.skills) && cvData.skills.length > 0) {
  //   checkRightPageOverflow(sectionSpacing);
  //   rightY = addSectionHeader('SKILLS', rightColumnStart, rightY, Award_Icon);
  //   let skill_total: string[] = []
  //   cvData.skills.forEach((skill) => {
  //     skill_total = [...skill_total, ...skill.skills]
  //     pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  //     pdf.setFont('Lato-Regular', 'normal');
  //     pdf.setFontSize(10);
  //     const skilllineheight = pdf.getLineHeight()/2.835
  //     const skilltext = [
  //       { text: `• `, font: 'Lato-Light', style: 'normal' },
  //       { text: `${skill.category}: `, font: 'Lato-Bold', style: "bold" },
  //       { text: `${skill.skills.join(', ').trim()}`, font: 'Lato-Light', style: 'normal' }
  //     ];
  //     const skillwidth = pdf.splitTextToSize(`• ${skill.category}: ${skill.skills.join(', ').trim()}`, rightColumnWidth)
  //     const skillLines = skillwidth.length//Math.floor((skillwidth + rightColumnWidth - 1) / rightColumnWidth)
  //     checkRightPageOverflow(lineSpacing * skillLines);
  //     rightY = drawStyledText1(pdf, skilltext, rightColumnStart, rightY, rightColumnWidth, skilllineheight).textY
  //     rightY += skillLines/2
  //   });
  //   pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  //   pdf.setFont('Lato-Regular', 'normal');
  //   pdf.setFontSize(10);
  //   rightY += sectionSpacing / 2;
  // }
  // Download the PDF
  pdf.save(filename);
};