import io
import re
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

class DocumentExtractorService:
    """
    Robust multi-format document text extraction and normalization engine.
    Supports PDF, DOCX, TXT, and Markdown files with resilient encoding fallbacks.
    """

    @staticmethod
    def clean_and_normalize_text(text: str) -> str:
        """
        Sanitizes raw extracted text:
        - Normalizes Unicode spaces and control characters.
        - Standardizes bullet characters (•, -, *, etc.).
        - Removes excessive consecutive blank lines while preserving paragraph and section breaks.
        """
        if not text:
            return ""

        # Normalize unicode spaces and unusual hyphens/bullets
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        text = re.sub(r'[\u200B-\u200D\uFEFF]', '', text)  # Zero-width spaces
        text = re.sub(r'[\u2018\u2019]', "'", text)        # Smart single quotes
        text = re.sub(r'[\u201C\u201D]', '"', text)        # Smart double quotes
        text = re.sub(r'[\u2013\u2014]', '-', text)        # Em/En dashes
        
        # Standardize bullet markers at start of lines
        text = re.sub(r'^[ \t]*[•▪▫➢\*\-–—\>][ \t]+', '• ', text, flags=re.MULTILINE)

        # Remove null bytes and strange unprintable control chars
        text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F]', '', text)

        # Collapse excessive horizontal whitespace
        text = re.sub(r'[ \t]{3,}', '   ', text)

        # Collapse more than 2 consecutive newlines into 2
        text = re.sub(r'\n{3,}', '\n\n', text)

        return text.strip()

    @classmethod
    def extract_from_pdf(cls, file_bytes: bytes) -> str:
        """
        Extract text from PDF file bytes using PyPDF with layout flow awareness.
        """
        try:
            from pypdf import PdfReader
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            
            pages_text = []
            for idx, page in enumerate(reader.pages):
                try:
                    # extract_text supports extraction_mode="layout" in newer pypdf versions
                    try:
                        extracted = page.extract_text(extraction_mode="layout")
                    except Exception:
                        extracted = page.extract_text()
                    
                    if extracted and extracted.strip():
                        pages_text.append(extracted.strip())
                except Exception as page_err:
                    logger.warning(f"Error extracting page {idx} in PDF: {page_err}")

            combined_text = "\n\n".join(pages_text)
            return cls.clean_and_normalize_text(combined_text)
        except Exception as e:
            logger.error(f"PyPDF extraction error: {e}")
            raise ValueError(f"Could not parse PDF content: {str(e)}")

    @classmethod
    def extract_from_docx(cls, file_bytes: bytes) -> str:
        """
        Extract text from Microsoft Word (.docx) documents, including paragraphs and tables.
        """
        try:
            import docx
            doc_file = io.BytesIO(file_bytes)
            doc = docx.Document(doc_file)
            
            full_text = []
            
            # 1. Extract paragraphs
            for para in doc.paragraphs:
                p_text = para.text.strip()
                if p_text:
                    # If it looks like a bullet item in Word styles
                    if para.style.name.startswith('List') or para.style.name.startswith('Bullet'):
                        full_text.append(f"• {p_text}")
                    else:
                        full_text.append(p_text)
            
            # 2. Extract tabular resume data (common in multi-column CV templates)
            for table in doc.tables:
                for row in table.rows:
                    row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_cells:
                        # Deduplicate cells (Word merged cells appear multiple times)
                        unique_cells = []
                        for cell in row_cells:
                            if not unique_cells or cell != unique_cells[-1]:
                                unique_cells.append(cell)
                        if unique_cells:
                            full_text.append(" | ".join(unique_cells))

            return cls.clean_and_normalize_text("\n".join(full_text))
        except Exception as e:
            logger.error(f"DOCX extraction error: {e}")
            # Resilient fallback: Try raw XML text extraction if python-docx fails
            try:
                import zipfile
                import xml.etree.ElementTree as ET
                with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                    xml_content = z.read('word/document.xml')
                    tree = ET.fromstring(xml_content)
                    texts = [elem.text for elem in tree.iter() if elem.text]
                    return cls.clean_and_normalize_text(" ".join(texts))
            except Exception as xml_err:
                raise ValueError(f"Could not parse DOCX file: {str(e)} (XML fallback: {str(xml_err)})")

    @classmethod
    def extract_from_text(cls, file_bytes: bytes) -> str:
        """
        Extract text from raw text / Markdown files with multi-encoding detection.
        """
        encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']
        for enc in encodings:
            try:
                decoded = file_bytes.decode(enc)
                return cls.clean_and_normalize_text(decoded)
            except UnicodeDecodeError:
                continue
        # Fallback with replacement of unparseable chars
        return cls.clean_and_normalize_text(file_bytes.decode('utf-8', errors='replace'))

    @classmethod
    def extract_document(cls, filename: str, file_bytes: bytes) -> Tuple[str, str]:
        """
        Unified entry point to extract text based on filename extension.
        Returns (extracted_text, detected_type).
        """
        filename_lower = filename.lower()
        if filename_lower.endswith('.pdf'):
            text = cls.extract_from_pdf(file_bytes)
            return text, 'pdf'
        elif filename_lower.endswith(('.docx', '.doc')):
            text = cls.extract_from_docx(file_bytes)
            return text, 'docx'
        elif filename_lower.endswith(('.txt', '.md', '.rtf')):
            text = cls.extract_from_text(file_bytes)
            return text, 'text'
        else:
            # Attempt automatic detection
            # PDF magic bytes: %PDF-
            if file_bytes.startswith(b'%PDF-'):
                return cls.extract_from_pdf(file_bytes), 'pdf'
            # DOCX magic bytes: PK\x03\x04
            elif file_bytes.startswith(b'PK\x03\x04'):
                return cls.extract_from_docx(file_bytes), 'docx'
            else:
                return cls.extract_from_text(file_bytes), 'text'

extractor_service = DocumentExtractorService()
