from django.db import models


class VehicleModel(models.Model):
    """Model definition for VehicleOrTrailerClass."""

    name = models.CharField('Наименование', max_length=255)

    class Meta:
        """Meta definition for VehicleOrTrailerClass."""

        verbose_name = 'Модель ТС или ППЦ'
        verbose_name_plural = 'Модели ТС или ППЦ'
        ordering = ['name']

    def __str__(self):
        """Unicode representation of VehicleOrTrailerClass."""
        return self.name


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

    plate_number = models.CharField('Гос. номер', max_length=255)

    vehicle_model = models.CharField(
        'Модель',
        max_length=255,
        blank=True,
    )
    vehicle_type = models.ForeignKey(
        VehicleOrTrailerType,
        verbose_name='Класс ТС или ППЦ',
        on_delete=models.SET_NULL,
        related_name='vehicles',
        blank=True,
        null=True,
    )
    owner = models.ForeignKey(
        'counterparty.LegalEntity',
        verbose_name='Владелец ТС/ППЦ',
        related_name='vehicles',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    without_plate_number = models.BooleanField(
        'Без гос. номера?', default=False
    )

    class Meta:
        """Meta definition for VehicleOrTrailerClass."""

        verbose_name = 'ТС и/или ППЦ'
        verbose_name_plural = 'ТС и/или ППЦ'
        ordering = ['plate_number']

    def __str__(self):
        """Unicode representation of VehicleOrTrailerClass."""
        return (
            f'{self.plate_number} ({self.vehicle_model} / '
            f'{self.vehicle_type.vehicle_class} ({self.vehicle_type})'
        )
