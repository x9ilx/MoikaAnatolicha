from django.db import models


class LegalEntity(models.Model):
    """Model definition for LegalEntity."""

    name = models.TextField('Наименование', blank=True)
    short_name = models.TextField('Короткое наименование', blank=True)
    address = models.TextField('Адрес', blank=True)
    ogrn = models.TextField('ОГРН', blank=True)
    inn = models.TextField('ИНН', blank=True)
    kpp = models.TextField('КПП', blank=True)
    okpo = models.TextField('ОКПО', blank=True)
    okved = models.TextField('ОКВЭД', blank=True)
    name_of_bank = models.TextField('Наименование банка ИП', blank=True)
    correspondent_account_of_bank = models.TextField(
        'Корреспондентский счёт банка ИП', blank=True
    )
    bik_of_bank = models.TextField('БИК банка ИП', blank=True)
    account_number_of_IP = models.TextField('Расчётный счёт ИП', blank=True)
    email = models.TextField('E-mail', blank=True)
    phone = models.TextField('Телефон', blank=True)
    director_name = models.TextField('Должность/ФИО руководителя', blank=True)
    mechanic_name = models.TextField('ФИО механика', blank=True)
    accountent_name = models.TextField('ФИО бухгалтера', blank=True)
    mechanic_phone = models.TextField('Телефон механика', blank=True)
    accountent_phone = models.TextField('Телефон бухгалтера', blank=True)

    current_contract = models.ForeignKey(
        'counterparty.LegalEntityContract',
        verbose_name='Текущий договор',
        on_delete=models.SET_NULL,
        related_name='+',
        null=True,
        blank=True,
    )

    class Meta:
        """Meta definition for LegalEntity."""

        ordering = ['name']
        verbose_name = 'Контрагент'
        verbose_name_plural = 'Контрагенты'

    def __str__(self):
        """Unicode representation of LegalEntity."""
        return self.name


class LegalEntityContract(models.Model):
    start_date = models.DateField(
        'Начало действия договора',
    )
    end_date = models.DateField(
        'Окончание действия договора',
    )
    legal_entity = models.ForeignKey(
        LegalEntity,
        verbose_name='Контрагент',
        on_delete=models.CASCADE,
        related_name='contracts',
    )
    vehicles = models.ManyToManyField(
        'vehicle.Vehicle', verbose_name='ТС/ПП/ППЦ', related_name='+'
    )
    services = models.ManyToManyField(
        'service.ServiceVehicleType',
        verbose_name='Услуга',
        through='counterparty.LegalEntytyContractServices',
    )

    class Meta:
        """Meta definition for LegalEntity."""

        ordering = ['-start_date']
        verbose_name = 'Договор на оказание услуг'
        verbose_name_plural = 'Договоры на оказание услуг'

    def __str__(self):
        """Unicode representation of LegalEntity."""
        return f'Договор №{self.pk}: {self.legal_entity.short_name}'


class LegalEntytyContractServices(models.Model):
    """Model definition for Service."""

    legal_entity_contract = models.ForeignKey(
        LegalEntityContract,
        verbose_name='Договор',
        on_delete=models.CASCADE,
        related_name='services_contract',
    )
    service_vehicle_type = models.ForeignKey(
        'service.ServiceVehicleType',
        verbose_name='Услуга',
        on_delete=models.SET_NULL,
        related_name='contract_services',
        null=True,
    )
    cost = models.IntegerField('Стоимость')

    class Meta:
        """Meta definition for Service."""

        verbose_name = 'Услуга для типов ТС/ППЦ для юр. лиц'
        verbose_name_plural = 'Услуги для типов ТС/ППЦ для юр. лиц'
        ordering = ['-legal_entity_contract__pk']


class LegalEntityInvoice(models.Model):
    start_date = models.DateField(
        'Начало выборки заказов',
    )
    end_date = models.DateTimeField(
        'Окончание выборки заказов',
    )
    legal_entity = models.ForeignKey(
        LegalEntity,
        verbose_name='Контрагент',
        on_delete=models.CASCADE,
        related_name='invoices',
    )

    class Meta:
        """Meta definition for LegalEntity."""

        ordering = ['-start_date']
        verbose_name = 'Счёт на оплату'
        verbose_name_plural = 'Счета на оплату'

    def __str__(self):
        """Unicode representation of LegalEntity."""
        return f'Счёт № {self.pk}: {self.legal_entity.short_name}'
