from django.db import models


class VehicleOrTrailerClass(models.Model):
    """Model definition for VehicleOrTrailerClass."""

    name = models.CharField('Наименование', max_length=255)

    class Meta:
        """Meta definition for VehicleOrTrailerClass."""

        verbose_name = 'Класс ТС или ППЦ'
        verbose_name_plural = 'Классы ТС или ППЦ'
        ordering = ['name']

    def __str__(self):
        """Unicode representation of VehicleOrTrailerClass."""
        return self.name


class VehicleOrTrailerType(models.Model):
    """Model definition for VehicleOrTrailerClass."""

    name = models.CharField('Наименование', max_length=255)
    vehicle_class = models.ForeignKey(
        VehicleOrTrailerClass,
        verbose_name='Класс ТС или ППЦ',
        on_delete=models.SET_NULL,
        related_name='vehicle_types',
        null=True,
    )
    is_tractor_with_trailer = models.BooleanField(
        'Тягач с прицепом?', default=False
    )

    class Meta:
        """Meta definition for VehicleOrTrailerClass."""

        verbose_name = 'Тип ТС или ППЦ'
        verbose_name_plural = 'Типы ТС или ППЦ'
        ordering = ['name', 'vehicle_class']

    def __str__(self):
        """Unicode representation of VehicleOrTrailerClass."""
        return self.name


class Vehicle(models.Model):
    """Model definition for VehicleOrTrailerClass."""

    plate_number = models.CharField('Гос. номер', max_length=25)
    trailer_plate_number = models.CharField(
        'Гос. номер ППЦ', max_length=25, blank=True, null=True
    )
    vehicle_model = models.CharField(
        'Модель',
        max_length=255,
        null=True,
        blank=True,
    )
    vehicle_class = models.ForeignKey(
        VehicleOrTrailerClass,
        verbose_name='Класс ТС или ППЦ',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    owner = models.ForeignKey(
        'counterparty.LegalEntity',
        verbose_name='Владелец ТС/ППЦ',
        related_name='vehicles',
        on_delete=models.CASCADE,
    )

    class Meta:
        """Meta definition for VehicleOrTrailerClass."""

        verbose_name = 'ТС и/или ППЦ'
        verbose_name_plural = 'ТС и/или ППЦ'
        ordering = ['plate_number', 'trailer_plate_number']

    def __str__(self):
        """Unicode representation of VehicleOrTrailerClass."""
        return (
            f'{self.plate_number} ({self.vehicle_model} / '
            f'{self.vehicle_class})'
        )
