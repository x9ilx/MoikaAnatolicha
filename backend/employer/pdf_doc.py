from reportlab.platypus import Paragraph, Spacer, Table, flowables

from core.pdf import BaseDocPortraitTemplate
from employer.models import EmployerSalary
from employer.pdf_base import BaseEmployerDocsPDF


class EmployerSalaryDocPDF(BaseEmployerDocsPDF):
    def __init__(self, buffer, salary: EmployerSalary):
        self.salary = salary
        super().__init__(buffer, employer=salary.employer)

    def get_pdf(self):
        doc = BaseDocPortraitTemplate(self.buffer)

        elements = []
        elements.append(
            Paragraph(
                f'Заработная плата, от {self.salary.date_of_issue.strftime('%d.%m.%Y')}г.',
                self.RIGHT_HEADER_STYLE),
        )
        elements.append(flowables.HRFlowable(width='100%', spaceAfter=10))
        elements.append(
            Paragraph(
                f"Расчёт ЗП за период: {self.salary.start_date.strftime('%d.%m.%Y')}г. - {self.salary.end_date.strftime('%d.%m.%Y')}г.",
                self.HEADER_STYLE,
            )
        )
        elements.append(
            Paragraph(
                f'<b>Сотрудник: {self.salary.employer.name}</b>',
                self.NORMAL_STYLE,
            )
        )
        elements.append(
            Paragraph(
                f'<b>Дата выдачи: '
                f'{self.salary.date_of_issue.strftime('%d.%m.%Y')}г.</b>',
                self.NORMAL_STYLE,
            )
        )
        elements.append(
            Paragraph(
                f'Сумма: {self.salary.employer_salary}p.',
                self.NORMAL_STYLE,
            )
        )

        elements.append(doc.generate_sign_area(self.salary.employer.name))

        doc.build(elements)
        pdf = self.buffer.getvalue()
        self.buffer.close()
        return pdf
