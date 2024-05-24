from abc import ABC, abstractmethod

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph


class BaseEmployerDocsPDF(ABC):
    COLORS_BLACK_COLOR = (0, 0, 0)
    styles = getSampleStyleSheet()

    def __init__(self, buffer, employer):
        self.employer = employer
        self.buffer = buffer
        self.__create_styles()

    def __create_styles(self):
        self.HEADER_STYLE = ParagraphStyle(
            name='doc_header',
            fontName='OpenSans-Bold',
            fontSize=12,
            leading=25,
            alignment=TA_CENTER,
        )
        self.NORMAL_STYLE = ParagraphStyle(
            name='doc_header',
            fontName='OpenSans',
            fontSize=9,
            leading=14,
        )
        self.NORMAL_STYLE_INDENT = ParagraphStyle(
            name='doc_header',
            fontName='OpenSans',
            fontSize=9,
            leading=14,
            firstLineIndent=25,
        )

        self.NORMAL_CENTERED_STYLE = ParagraphStyle(
            name='doc_header',
            fontName='OpenSans',
            fontSize=9,
            leading=14,
            alignment=TA_CENTER,
        )
        self.BOLD_STYLE = ParagraphStyle(
            name='BOLD_STYLE', fontName='OpenSans-Bold', fontSize=9, leading=14
        )
        self.RIGHT_HEADER_STYLE = ParagraphStyle(
            name='Header',
            fontName='OpenSans',
            fontSize=8,
            leading=14,
            alignment=TA_RIGHT,
        )
        self.LIST_STYLE = ParagraphStyle(
            name='ListStyle',
            fontName='OpenSans',
            fontSize=8,
            leading=14,
            spaceAfter=2,
            spaceBefore=2,
            leftIndent=12,
            bulletAnchor='start',
            bulletFontSize=9,
            bulletIndent=7,
        )

    def get_details_and_signature(self):
        return Paragraph(
            (
                f'Ф.И.О.: {self.employer}, '
                '_________________________________________ (Ф. И. О.) '
                '________________ (Подпись)'
            ),
            self.NORMAL_STYLE,
        )

    @abstractmethod
    def get_pdf(self):
        pass
