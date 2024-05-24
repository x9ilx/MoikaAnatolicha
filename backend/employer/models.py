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
    on_shift = models.BooleanField('На смене?', default=False)

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


class EmployerShift(models.Model):
    """Model definition for EmployerShift."""

    employer = models.ForeignKey(
        Employer,
        verbose_name='Сотрудник',
        on_delete=models.CASCADE,
        related_name='shifts',
    )
    start_shift_time = models.DateTimeField('Начало смены', auto_now_add=True)
    end_shift_time = models.DateTimeField(
        'Конец смены', null=True, default=None
    )
    employer_salary = models.IntegerField('ЗП сотрудника, за смену', default=0)
    total_order_cost = models.IntegerField('Сумма заказов', default=0)
    is_closed = models.BooleanField('Смена закрыта?', default=False)

    class Meta:
        """Meta definition for EmployerShift."""

        verbose_name = 'EmployerShift'
        verbose_name_plural = 'EmployerShifts'

    def __str__(self):
        """Unicode representation of EmployerShift."""
        return (
            f'{self.employer.name}: '
            f'{self.start_shift_time} - {self.end_shift_time}'
        )


class EmployerSalary(models.Model):
    employer = models.ForeignKey(
        Employer,
        verbose_name='Сотрудник',
        on_delete=models.CASCADE,
        related_name='salaries',
    )
    date_of_issue = models.DateField(
        'Дата выдачи ЗП', auto_now_add=True, null=True
    )
    start_date = models.DateField('Начало расчёта ЗП', null=True, default=None)
    end_date = models.DateField('Конец расчёта ЗП', null=True, default=None)
    employer_salary = models.IntegerField('ЗП сотрудника', default=0)
    total_order_income = models.IntegerField('Доход с заказов', default=0)
    shifts_description = models.TextField('Перечень смен')
    orders_description = models.TextField('Перечень заказов')

    class Meta:
        verbose_name = 'EmployerSalary'
        verbose_name_plural = 'EmployerSalary'

    def __str__(self):
        """Unicode representation of EmployerShift."""
        return f'{self.employer.name}: ' f'{self.start_date} - {self.end_date}'
