from django.db import models


class Order(models.Model):
    """Model definition for Order."""

    order_datetime = models.DateTimeField(
        'Дата/время заказа',
        auto_now_add=True,
    )
    order_close_datetime = models.DateTimeField(
        'Дата/время заказа',
    )
    vehicle_owner = models.ForeignKey(
        'counterparty.LegalEntity',
        verbose_name='Владелец ТС/ППЦ',
        related_name='orders',
        on_delete=models.SET_NULL,
        null=True,
    )
    vehicle_owner_name = models.CharField(
        'ФИО/Наименование владельца ТС/ППЦ',
        max_length=255,
        blank=True,
        null=True,
    )
    vehicle_owner_phone = models.CharField(
        'Телефон владельца ТС/ППЦ', max_length=255, blank=True, null=True
    )
    vehicle = models.ForeignKey(
        'vehicle.Vehicle',
        verbose_name='ТС/ППЦ',
        related_name='orders',
        on_delete=models.SET_NULL,
        null=True,
    )
    final_cost = models.DecimalField(
        'Итоговая стоимость', max_digits=5, decimal_places=1
    )
    final_cost_for_employer_work = models.DecimalField(
        'Итоговая оплата работы сотрудника', max_digits=5, decimal_places=1
    )
    is_paid = models.BooleanField('Оплачен?')
    is_completed = models.BooleanField('Завершен?')
    has_been_modifed_after_save = models.BooleanField(
        'Был изменён после сохарнения?'
    )
    services = models.ManyToManyField(
        'service.ServiceVehicleType',
        verbose_name='Услуга',
        through='order.OrderService',
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
        verbose_name='Заказ',
        on_delete=models.CASCADE,
        related_name='order_services',
    )
    service = models.ForeignKey(
        'service.ServiceVehicleType',
        verbose_name='Услуга для ТС/ППЦ',
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_services',
    )
    cost = models.DecimalField('Cтоимость', max_digits=5, decimal_places=1)
    employer_salary = models.DecimalField(
        'Оплата сотруднику', max_digits=5, decimal_places=1
    )

    class Meta:
        """Meta definition for OrderService."""

        verbose_name = 'Заказ-Услуга'
        verbose_name_plural = 'Заказы-Услуги'

    def __str__(self):
        """Unicode representation of OrderService."""
        return f'{self.order}: {self.service}'
