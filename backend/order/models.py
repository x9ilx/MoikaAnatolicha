from django.db import models


class OrderPaimentMethod(models.TextChoices):
    CASH = 'CASH', 'Наличные'
    TRANSFER = 'TRANSFER', 'Перевод'
    CARD = 'CARD', 'Карта'
    CONTRACT = 'CONTRACT', 'Договор'


class Order(models.Model):
    """Model definition for Order."""

    order_number = models.CharField(max_length=255)
    order_datetime = models.DateTimeField(
        'Дата/время заказа',
        auto_now_add=True,
    )
    order_close_datetime = models.DateTimeField(
        'Дата/время заказа', blank=True, null=True
    )
    administrator = models.ForeignKey(
        'employer.Employer',
        verbose_name='Администратор',
        on_delete=models.SET_NULL,
        related_name='+',
        null=True,
    )
    washers = models.ManyToManyField(
        'employer.Employer',
        verbose_name='Мойщики',
        through='order.OrderWashers',
    )
    payment_method = models.CharField(
        max_length=50,
        choices=OrderPaimentMethod.choices,
        default=OrderPaimentMethod.CASH,
        null=False,
        blank=False,
        verbose_name='Метод оплаты',
    )
    client_name = models.CharField(
        'ФИО/Наименование клиента',
        max_length=255,
        blank=True,
    )
    client_phone = models.CharField(
        'Телефон клиента', max_length=255, blank=True
    )
    vehicle = models.ManyToManyField(
        'vehicle.Vehicle',
        verbose_name='Услуга',
        through='order.OrderVehicle',
    )
    services = models.ManyToManyField(
        'service.Service',
        verbose_name='Услуга',
        through='order.OrderService',
    )
    final_cost = models.IntegerField('Итоговая стоимость наличными')
    final_cost_contract = models.IntegerField('Итоговая стоимость')
    final_cost_for_employer_work = models.IntegerField(
        'Итоговая оплата работы сотрудников'
    )
    each_washer_salary = models.IntegerField(
        'Итоговая оплата работы сотрудника'
    )
    is_paid = models.BooleanField('Оплачен?', default=False)
    is_completed = models.BooleanField('Завершен?', default=False)
    has_been_modifed_after_save = models.BooleanField(
        'Был изменён после сохарнения?', default=False
    )
    backup_info = models.TextField('Информация о заказе', blank=True)
    comments = models.TextField('комментарии к заказу', blank=True)
    is_tractor_trailer = models.BooleanField('Тягач + ППЦ?', default=False)
    trailer_plate_number = models.CharField(
        'Гос. номер ППЦ',
        max_length=20,
        blank=True,
    )
    trailer_model = models.CharField(
        'Модель ППЦ',
        max_length=150,
        blank=True,
    )

    class Meta:
        """Meta definition for Order."""

        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-order_datetime']

    def __str__(self):
        """Unicode representation of Order."""
        return f'{self.vehicle}: {self.final_cost}р.'


class OrderService(models.Model):
    """Model definition for OrderService."""

    order = models.ForeignKey(
        'order.Order',
        verbose_name='Заказ-ТС',
        on_delete=models.CASCADE,
        related_name='services_in_order',
    )
    service = models.ForeignKey(
        'service.Service',
        verbose_name='Услуга для ТС/ППЦ',
        on_delete=models.SET_NULL,
        null=True,
        related_name='services_in_order',
    )
    vehicle = models.ForeignKey(
        'vehicle.Vehicle',
        verbose_name='ТС/ППЦ',
        on_delete=models.SET_NULL,
        null=True,
        related_name='+',
    )
    legal_entity_service = models.BooleanField('По договору?', default=False)
    cost = models.IntegerField('Cтоимость')
    employer_salary = models.IntegerField('Оплата сотруднику')
    percentage_for_washer = models.IntegerField('% мойщика')


class OrderVehicle(models.Model):
    """Model definition for OrderService."""

    order = models.ForeignKey(
        'order.Order',
        verbose_name='Заказ-ТС',
        on_delete=models.CASCADE,
        related_name='vehicles_in_order',
    )
    vehicle = models.ForeignKey(
        'vehicle.Vehicle',
        verbose_name='ТС/ППЦ',
        on_delete=models.SET_NULL,
        null=True,
        related_name='vehicle_orders',
    )


class OrderWashers(models.Model):
    """Model definition for OrderService."""

    order = models.ForeignKey(
        'order.Order',
        verbose_name='Заказ-ТС',
        on_delete=models.CASCADE,
        related_name='washers_order',
    )
    washer = models.ForeignKey(
        'employer.Employer',
        verbose_name='Мойщик',
        on_delete=models.SET_NULL,
        null=True,
        related_name='orders_washers',
    )
