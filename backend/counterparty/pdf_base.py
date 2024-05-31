from abc import ABC, abstractmethod

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, Table

from counterparty.models import LegalEntity


class BaseLegalEntityDocsPDF(ABC):
    COLORS_BLACK_COLOR = (0, 0, 0)
    styles = getSampleStyleSheet()

    def __init__(self, buffer, legal_entity_contract):
        self.legal_entity_contract = legal_entity_contract
        self.buffer = buffer
        self.__get_global_params()
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
            name='BOLD_STYLE',
            fontName='OpenSans-Bold',
            fontSize=9,
            leading=14,
        )
        self.BOLD_HEADER_STYLE = ParagraphStyle(
            name='BOLD_STYLE',
            fontName='OpenSans-Bold',
            fontSize=12,
            leading=14,
            alignment=TA_CENTER,
            spaceAfter=15,
        )
        self.RIGHT_BOLD_STYLE = ParagraphStyle(
            name='BOLD_STYLE',
            fontName='OpenSans-Bold',
            fontSize=9,
            leading=14,
            alignment=TA_RIGHT,
        )
        self.BOLD_STYLE_LEFT_INDED_50 = ParagraphStyle(
            name='BOLD_STYLE',
            fontName='OpenSans-Bold',
            fontSize=9,
            leading=14,
            leftIndent=50,
        )
        self.RIGHT_BOLD_STYLE_RIGHT_INDED_75 = ParagraphStyle(
            name='BOLD_STYLE',
            fontName='OpenSans-Bold',
            fontSize=9,
            leading=14,
            alignment=TA_RIGHT,
            rightIndent=75,
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

    def __get_global_params(self):
        self.director_name = 'Демидов Евгений Леонидович'
        self.organization_name = 'Индивидуальный Предприниматель Демидов Евгений Леонидович'
        self.organization_inn = '541000885202'
        self.organization_phone = '8-983-123-1111'
        self.organization_email = '89831231111@mail.ru'
        self.organization_addres = '630061, г. Новосибирск, ул. Тюленина, д. 15/1, кв. 111'
        self.current_account = '40802810213234220682'
        self.bank = 'ВТБ (ПАО)'
        self.correspondent_account = '30101810145250000411'
        self.bik = '044525411'
        self.okved = '45.20.3'
        self.ogrnip = '321547600137541'
        self.inn = '541000885202'

    def get_details_and_signatures_pairs(self):
        l_en: LegalEntity = self.legal_entity_contract.legal_entity
        dir_name_list = self.director_name.split()
        dir_initials = (f'{dir_name_list[0] or ''}. '
                        f'{dir_name_list[1][0] or ''}. '
                        f'{dir_name_list[2][0] or ''}.')
        le_name_list = l_en.director_name.split()
        le_initials = (f'{le_name_list[0] or ''}. '
                        f'{le_name_list[1][0] or ''}. '
                        f'{le_name_list[2][0] or ''}.')
        
        elements = []
        add_doc_data = [
            [
                    [Paragraph(
                        f'Исполнитель:<br/>{self.organization_name}<br/>',
                        self.BOLD_STYLE
                    ),
                    Paragraph(
                        (f'<br/>{self.organization_addres}<br/>'
                        f'P/c {self.current_account}<br/>'
                        f'Банк {self.bank}<br/>'
                        f'K/c {self.correspondent_account}<br/>'
                        f'БИК {self.bik}<br/>'
                        f'ОКВЭД {self.okved}<br/>'
                        f'ОГРНИП {self.ogrnip}<br/>'
                        f'ИНН {self.organization_inn}<br/><br/>'
                        f'Телефон: {self.organization_phone}<br/>'
                        f'ЭП: {self.organization_email}'
                        ), self.NORMAL_STYLE
                    )],
                    [Paragraph(
                        f'Заказчик:<br/>{l_en.name}<br/>',
                        self.BOLD_STYLE
                    ),
                    Paragraph(
                        (f'<br/>{l_en.address}<br/>'
                        f'P/c {l_en.account_number_of_IP}<br/>'
                        f'Банк {l_en.name_of_bank}<br/>'
                        f'K/c {l_en.correspondent_account_of_bank}<br/>'
                        f'БИК {l_en.bik_of_bank}<br/>'
                        f'ОГРН {l_en.ogrn}<br/>'
                        f'ИНН {l_en.inn}<br/>'
                        f'КПП {l_en.kpp}<br/><br/>'
                        f'Телефон: {l_en.phone}<br/>'
                        f'ЭП: {l_en.email}'
                        ), self.NORMAL_STYLE
                    )]
            ],
        ]
        add_doc_data2 = [
            [
                    Paragraph(
                        f'ИСПОЛНИТЕЛЬ:',
                        self.BOLD_STYLE
                    ),
                    Paragraph(
                        f'ЗАКАЗЧИК:',
                        self.RIGHT_BOLD_STYLE
                    ),
            ],
            [],
            [
                    Paragraph(
                        f'________________________________ {dir_initials}',
                        self.BOLD_STYLE
                    ),
                    Paragraph(
                        f'_________________________________ {le_initials}',
                        self.RIGHT_BOLD_STYLE
                    ),
            ],
            [
                 Paragraph(
                        'М. П.',
                        self.BOLD_STYLE_LEFT_INDED_50
                    ),
                Paragraph(
                        'М. П.',
                        self.RIGHT_BOLD_STYLE_RIGHT_INDED_75
                    ),
            ]
        ]

        add_doc_table = Table(add_doc_data, style=[
                ('GRID',(0,0),(-1,-1),0.5,colors.black),
                ('VALIGN',(0,0),(-1,-1),'TOP'),
                ])
        add_doc_table2 = Table(add_doc_data2, style=[
                ('VALIGN',(0,0),(-1,-1),'TOP'),
                ('ALIGN',(0,0),(-1,-1),'RIGHT'),
                ])
         
        
        elements.append(add_doc_table)
        elements.append(Paragraph('<br/><br/>', self.BOLD_STYLE))
        elements.append(add_doc_table2)

        return elements

    @abstractmethod
    def get_pdf(self):
        pass
