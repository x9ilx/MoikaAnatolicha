from reportlab.lib.pagesizes import A4, landscape, portrait
from reportlab.lib.styles import TA_CENTER, TA_LEFT, TA_RIGHT, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle

from backend import settings


class BaseDocPortraitTemplate(SimpleDocTemplate):
    def __init__(
        self,
        filename,
        right_margin=10,
        left_margin=15,
        top_margin=10,
        bottom_margin=5,
        pagesize=portrait(A4),
        **kw,
    ):
        super().__init__(filename, **kw)
        self.rightMargin = right_margin
        self.leftMargin = left_margin
        self.topMargin = top_margin
        self.bottomMargin = bottom_margin
        self.pagesize = pagesize

        pdfmetrics.registerFont(
            TTFont(
                'OpenSans',
                settings.BASE_DIR / 'static/fonts/OpenSans-Regular.ttf',
            )
        )
        pdfmetrics.registerFont(
            TTFont(
                'OpenSans-Bold',
                settings.BASE_DIR / 'static/fonts/OpenSans-Bold.ttf',
            )
        )

    def generate_sign_area(self, signature):
        right_footer_style = ParagraphStyle(
            name='Footer',
            fontName='OpenSans-Bold',
            fontSize=10,
            leading=11,
            alignment=TA_RIGHT,
        )
        center_footer_style = ParagraphStyle(
            name='Footer',
            fontName='OpenSans-Bold',
            fontSize=10,
            leading=11,
            alignment=TA_CENTER,
        )
        sign_data = [
            [
                Paragraph(f'{signature}', right_footer_style),
                Paragraph(
                    '______________________________', center_footer_style
                ),
            ],
            ['', Paragraph('(подпись)', center_footer_style)],
        ]
        table = Table(sign_data, colWidths=self.width * 0.50, hAlign='RIGHT')

        return table

    def generate_date_area(self, str_date):
        left_style = ParagraphStyle(
            name='Footer',
            fontName='OpenSans',
            fontSize=10,
            leading=11,
            alignment=TA_LEFT,
        )
        right_style = ParagraphStyle(
            name='Footer',
            fontName='OpenSans',
            fontSize=10,
            leading=11,
            alignment=TA_RIGHT,
        )
        data = [
            [
                Paragraph('г. Новосибирск', left_style),
                '',
                Paragraph(f'{str_date}', right_style),
            ],
        ]
        table = Table(data)

        return table
