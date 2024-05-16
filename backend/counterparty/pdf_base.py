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
            leading=14
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

    # def __get_global_params(self):
    #     params = get_global_parameters_as_dict(
    #         ParametersType.DIRECTOR_FULL_NAME,
    #         ParametersType.ORGANIZATION_NAME,
    #         ParametersType.ORGANIZATION_INN,
    #         ParametersType.ORGANIZATION_KPP,
    #         ParametersType.ORGANIZATION_OGRN,
    #         ParametersType.ORGANIZATION_OKPO,
    #         ParametersType.ORGANIZATION_REGISTRY_DATE,
    #         ParametersType.ORGANIZATION_PHONE,
    #         ParametersType.ORGANIZATION_EMAIL,
    #         ParametersType.ORGANIZATION_ADDRES
    #     ) or {}
    #     self.director_name = params.get(ParametersType.DIRECTOR_FULL_NAME, 'x x x')
    #     self.organization_name = params.get(ParametersType.ORGANIZATION_NAME, '')
    #     self.organization_inn = params.get(ParametersType.ORGANIZATION_INN, '')
    #     self.organization_kpp = params.get(ParametersType.ORGANIZATION_KPP, '')
    #     self.organization_ogrn = params.get(ParametersType.ORGANIZATION_OGRN, '')
    #     self.organization_okpo = params.get(ParametersType.ORGANIZATION_OKPO, '')
    #     self.organization_registry_date = params.get(
    #         ParametersType.ORGANIZATION_REGISTRY_DATE,
    #         ''
    #     )
    #     self.organization_phone = params.get(ParametersType.ORGANIZATION_PHONE, '')
    #     self.organization_email = params.get(ParametersType.ORGANIZATION_EMAIL, '')
    #     self.organization_addres = params.get(
    #         ParametersType.ORGANIZATION_ADDRES,
    #         ''
    #     )

    # def get_details_and_signatures_pairs(self):
    #     dir_name_list = self.director_name.split()
    #     dir_initials = (f'{dir_name_list[1][0] or ''}. '
    #                     f'{dir_name_list[2][0] or ''}. '
    #                     f'{dir_name_list[0] or ''}')
        
    #     return Paragraph(
    #             (f'Автошкола: {self.organization_name} '
    #              f'ИНН {self.organization_inn} '
    #              f'ОГРН {self.organization_ogrn} '
    #              f'КПП {self.organization_kpp} '
    #              f'ОКПО {self.organization_okpo}<br/>'
    #              f'Дата регистрации: {self.organization_registry_date}<br/>'
    #              f'Адрес: {self.organization_addres}<br/>'
    #              f'Телефон, электронный адрес: '
    #              f'{self.organization_phone}, {self.organization_email}<br/>'
    #              f'<br/>Директор {self.organization_name} ___________________ '
    #              f'{dir_initials}<br/><br/><br/>'
    #              f'«Исполнитель»:<br/>'
    #              f'Ф.И.О.: {self.employer}, '
    #              f'дата рождения {self.employer.date_of_birth} <br/>'
    #              f'Паспорт: {self.employer.passport_number}; '
    #              f'Дата выдачи: {self.employer.date_of_passport}; '
    #              f'Выдан: {self.employer.who_issued_passport}<br/>'
    #              f'Регистрация: {self.employer.registration}<br/><br/>'
    #              '_________________________________________ (Ф. И. О.) '
    #              '________________ (Подпись)'),
    #             self.NORMAL_STYLE
    #         )

    @abstractmethod
    def get_pdf(self):
        pass