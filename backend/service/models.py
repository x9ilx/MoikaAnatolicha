from django.db import models


class Service(models.Model):
    """Model definition for Service."""

    name = models.CharField('Наименование', max_length=255)
    additional_service = models.BooleanField(
        'Дополнительная услуга',
        default=False,
    )
    vehicle_types = models.ManyToManyField(
        'vehicle.VehicleOrTrailerType',
        verbose_name='Типы ТС/ППЦ',
        through='service.ServiceVehicleType',
    )

    class Meta:
        """Meta definition for Service."""

        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['name']

    def __str__(self):
        """Unicode representation of Service."""
        return self.name


class ServiceVehicleType(models.Model):
    """Model definition for Service."""

    service = models.ForeignKey(
        Service,
        verbose_name='Услуга',
        on_delete=models.CASCADE,
        related_name='service_vehicle_types',
    )
    vehicle_type = models.ForeignKey(
        'vehicle.VehicleOrTrailerType',
        verbose_name='Тип ТС/ППЦ',
        on_delete=models.CASCADE,
        related_name='service_vehicle_types',
    )
    cost = models.IntegerField('Стоимость')
    employer_salary = models.IntegerField('Оплата сотруднику')
    percentage_for_washer = models.IntegerField('% мойщика')

    class Meta:
        """Meta definition for Service."""

        verbose_name = 'Услуга для типов ТС/ППЦ'
        verbose_name_plural = 'Услуги для типов ТС/ППЦ'
        ordering = ['service']

    def __str__(self):
        """Unicode representation of Service."""
        return f'{self.service.name}: {self.vehicle_type.name}'
