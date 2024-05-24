from datetime import datetime
from reportlab.platypus import Paragraph, Spacer, Table, flowables

from counterparty.models import LegalEntityContract
from core.pdf import BaseDocPortraitTemplate
from counterparty.pdf_base import BaseLegalEntityDocsPDF

MONTH_LIST = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
           'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


def date_verbose(date: datetime):
    result = f'«{"0" if date.day < 10 else ""}{date.day}» {MONTH_LIST[date.month]} {date.year} г.'
    return result

class LegalEntityContractDocPDF(BaseLegalEntityDocsPDF):
    def __init__(self, buffer, legal_entity_contract: LegalEntityContract):
        self.legal_entity_contract = legal_entity_contract
        super().__init__(buffer, legal_entity_contract=legal_entity_contract)

    def get_pdf(self):
        doc = BaseDocPortraitTemplate(self.buffer)

        elements = []

        elements.append(
            Paragraph(
                f'Договор на оказание услуг по мойке автотранспорта №{self.legal_entity_contract.pk}',
                self.BOLD_HEADER_STYLE
            )
        )

        add_doc_data2 = [
            [
                    Paragraph(
                        f'г. Новосибирск',
                        self.BOLD_STYLE
                    ),
                    Paragraph(
                        f'{date_verbose(self.legal_entity_contract.start_date)}',
                        self.RIGHT_BOLD_STYLE
                    ),
            ],
        ]
        add_doc_table2 = Table(add_doc_data2, style=[
            ('VALIGN',(0,0),(-1,-1),'TOP'),
        ])
        elements.append(add_doc_table2)
        
        elements.append(
            Paragraph(
                f'<b>{self.legal_entity_contract.legal_entity.short_name}</b>, Именуемый в дальнейшем "ЗАКАЗЧИК", в лице Директора: {self.legal_entity_contract.legal_entity.director_name}, действующего на основании Устава, и <b>Индивидуальный Предприниматель Демидов Евгений Леонидович</b>, именуемый в дальшейшев "ИСПОЛНИТЕЛЬ", действующий на основании Листа записи в ЕГРИП о гусдарственной регистрации физического лица в качестве индивидуального предпринимателя от 23 сентября 2021 года, заключили договор о нижеследующем:',
                self.NORMAL_STYLE
            )
        )

        elements += self.get_details_and_signatures_pairs()

        doc.build(elements)
        pdf = self.buffer.getvalue()
        self.buffer.close()
        return pdf
