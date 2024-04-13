from django.db import models


class LegalEntity(models.Model):
    """Model definition for LegalEntity."""

    name = models.TextField('Наименование', blank=True)
    address = models.TextField('Адрес', blank=True)
    ogrn = models.TextField('ОГРН', blank=True)
    inn = models.TextField('ИНН', blank=True)
    kpp = models.TextField('КПП', blank=True)
    okpo = models.TextField('ОКПО', blank=True)
    okved = models.TextField('ОКВЭД', blank=True)
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
    director_name = models.TextField('Должность/ФИО руководителя', blank=True)
    mechanic_name = models.TextField('ФИО механика', blank=True)
    accountent_name = models.TextField('ФИО бухгалтера', blank=True)
    mechanic_phone = models.TextField('Телефон механика', blank=True)
    accountent_phone = models.TextField('Телефон бухгалтера', blank=True)


    class Meta:
        """Meta definition for LegalEntity."""
        ordering = ['name']
        verbose_name = 'Контрагент'
        verbose_name_plural = 'Контрагенты'

    def __str__(self):
        """Unicode representation of LegalEntity."""
        return self.name
