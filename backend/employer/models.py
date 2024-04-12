from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class EmployerPositions(models.TextChoices):
    MANAGER = 'MANAGER', 'Управляющий'
    ADMINISTRATOR = 'ADMINISTRATOR', 'Администратор'
    WASHER = 'WASHER', 'Мойщик'


class Employer(models.Model):
    """Model definition for Employer."""

    position = models.CharField(
        max_length=50,
        choices=EmployerPositions.choices,
        default=EmployerPositions.ADMINISTRATOR,
        null=False,
        blank=False,
        verbose_name='Должность',
    )
    name = models.CharField('Ф. И. О.', max_length=250)
    short_name = models.CharField('Короткое имя', max_length=250)
    phone = models.CharField('Телефон', max_length=25, blank=True, null=True)
    user = models.ForeignKey(
        User,
        verbose_name='Пользователь в БД',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    is_busy_working = models.BooleanField('Занят работой?', default=False)

    class Meta:
        """Meta definition for Employer."""

        ordering = [
            'name',
        ]
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'

    def __str__(self):
        """Unicode representation of Employer."""
        return f'{self.name}: {EmployerPositions(self.position).label}'
