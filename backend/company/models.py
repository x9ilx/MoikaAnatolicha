from django.db import models


class CompanyRequisites(models.Model):
    """Model definition for CompanyRequisites."""

    name = models.TextField('Наименование', blank=True)
    address = models.TextField('Адрес', blank=True)
    ogrn = models.TextField('ОГРН', blank=True)
    inn = models.TextField('ИНН', blank=True)
    okved = models.TextField('ОКВЭД', blank=True)
    okpo = models.TextField('ОКПО', blank=True)
    name_of_bank = models.TextField(
        'Наименование банка ИП', blank=True
    )
    correspondent_account_of_bank = models.TextField(
        'Корреспондентский счёт банка ИП', blank=True
    )
    bik_of_bank = models.TextField('БИК банка ИП', blank=True)
    account_number_of_IP = models.TextField(
        'Расчётный счёт ИП', blank=True
    )
    email = models.TextField('E-mail', blank=True)
    phone = models.TextField('Телефон', blank=True)
    director_name = models.TextField('ФИО руководителя', blank=True)

    class Meta:
        """Meta definition for CompanyRequisites."""

        verbose_name = 'Реквизиты организации'
        verbose_name_plural = 'Реквизиты организации'

    def __str__(self):
        """Unicode representation of CompanyRequisites."""
        return self.name
