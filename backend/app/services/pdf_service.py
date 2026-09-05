import io
import logging
from pypdf import PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

logger = logging.getLogger(__name__)

class PDFService:
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        """
        Extract raw text content from uploaded PDF file bytes using PyPDF.
        """
        try:
            pdf_file = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)
            extracted_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
            return extracted_text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise ValueError(f"Could not parse PDF file: {e}")

    @staticmethod
    def generate_cv_pdf(cv_data: dict) -> bytes:
        """
        Generate a premium, professional PDF CV from structured data using ReportLab.
        Returns the PDF file contents as bytes.
        """
        buffer = io.BytesIO()
        
        # 1. Page settings
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        story = []
        
        # 2. Premium Custom Styles
        primary_color = colors.HexColor("#1A365D")  # Deep Blue
        secondary_color = colors.HexColor("#4A5568")  # Charcoal Grey
        text_color = colors.HexColor("#2D3748")  # Dark Slate
        
        title_style = ParagraphStyle(
            'CVTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=primary_color,
            alignment=0,  # Left aligned
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            'CVSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=12,
            leading=16,
            textColor=secondary_color,
            spaceAfter=8
        )
        
        contact_style = ParagraphStyle(
            'CVContact',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=secondary_color,
            spaceAfter=15
        )
        
        section_heading_style = ParagraphStyle(
            'CVSectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=primary_color,
            spaceBefore=12,
            spaceAfter=6,
            keepWithNext=True
        )
        
        body_style = ParagraphStyle(
            'CVBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=text_color,
            spaceAfter=6
        )

        bullet_style = ParagraphStyle(
            'CVBullet',
            parent=body_style,
            leftIndent=15,
            firstLineIndent=-10,
            spaceAfter=4
        )

        # 3. Header Section (Name & Info)
        name = cv_data.get("name", "John Doe")
        role = cv_data.get("role", "Professional Professional")
        email = cv_data.get("email", "email@example.com")
        phone = cv_data.get("phone", "+1 234 567 890")
        state = cv_data.get("state", "CA")
        country = cv_data.get("country", "USA")
        
        story.append(Paragraph(name, title_style))
        story.append(Paragraph(role, subtitle_style))
        
        contact_info = f"Email: {email}  |  Phone: {phone}  |  Location: {state}, {country}"
        story.append(Paragraph(contact_info, contact_style))
        
        # Helper line divider
        def draw_divider():
            t = Table([[""]], colWidths=[532])
            t.setStyle(TableStyle([
                ('LINEBELOW', (0,0), (-1,-1), 1, primary_color),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(t)
            story.append(Spacer(1, 8))

        # 4. Summary Section
        summary = cv_data.get("summary")
        if summary:
            story.append(Paragraph("Professional Summary", section_heading_style))
            draw_divider()
            story.append(Paragraph(summary, body_style))
            story.append(Spacer(1, 10))

        # 5. Work Experience Section
        experience = cv_data.get("experience", [])
        if experience:
            story.append(Paragraph("Work Experience", section_heading_style))
            draw_divider()
            for exp in experience:
                company = exp.get("company", "Company")
                role_title = exp.get("role", "Role")
                dates = exp.get("dates", "")
                desc = exp.get("description", [])
                
                exp_header = f"<b>{role_title}</b> at <i>{company}</i>"
                # Use a table to layout header and dates side-by-side
                hdr_p = Paragraph(exp_header, body_style)
                date_p = Paragraph(f"<font color='{secondary_color}'>{dates}</font>", ParagraphStyle('DateS', parent=body_style, alignment=2))
                
                t = Table([[hdr_p, date_p]], colWidths=[380, 152])
                t.setStyle(TableStyle([
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('LEFTPADDING', (0,0), (-1,-1), 0),
                    ('RIGHTPADDING', (0,0), (-1,-1), 0),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                    ('TOPPADDING', (0,0), (-1,-1), 2),
                ]))
                story.append(t)
                
                for item in desc:
                    story.append(Paragraph(f"• {item}", bullet_style))
                story.append(Spacer(1, 6))
            story.append(Spacer(1, 10))

        # 6. Education Section
        education = cv_data.get("education", [])
        if education:
            story.append(Paragraph("Education", section_heading_style))
            draw_divider()
            for edu in education:
                degree = edu.get("degree", "Degree")
                school = edu.get("school", "School")
                dates = edu.get("dates", "")
                
                edu_header = f"<b>{degree}</b>, {school}"
                hdr_p = Paragraph(edu_header, body_style)
                date_p = Paragraph(f"<font color='{secondary_color}'>{dates}</font>", ParagraphStyle('DateS2', parent=body_style, alignment=2))
                
                t = Table([[hdr_p, date_p]], colWidths=[380, 152])
                t.setStyle(TableStyle([
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('LEFTPADDING', (0,0), (-1,-1), 0),
                    ('RIGHTPADDING', (0,0), (-1,-1), 0),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                    ('TOPPADDING', (0,0), (-1,-1), 2),
                ]))
                story.append(t)
            story.append(Spacer(1, 10))

        # 7. Skills Section
        skills = cv_data.get("skills", [])
        if skills:
            story.append(Paragraph("Core Skills", section_heading_style))
            draw_divider()
            skills_str = ", ".join(skills)
            story.append(Paragraph(skills_str, body_style))

        # Build Document
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes

pdf_service = PDFService()
