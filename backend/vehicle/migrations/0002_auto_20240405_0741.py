# Generated by Django 3.2.3 on 2024-04-05 01:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicle', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='vehicleortrailerclass',
            options={
                'ordering': ['name'],
                'verbose_name': 'Класс ТС или ППЦ',
                'verbose_name_plural': 'Классы ТС или ППЦ',
            },
        ),
        migrations.AlterModelOptions(
            name='vehicleortrailertype',
            options={
                'ordering': ['name', 'vehicle_class'],
                'verbose_name': 'Тип ТС или ППЦ',
                'verbose_name_plural': 'Типы ТС или ППЦ',
            },
        ),
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                (
                    'plate_number',
                    models.CharField(max_length=25, verbose_name='Гос. номер'),
                ),
                (
                    'trailer_plate_number',
                    models.CharField(
                        blank=True,
                        max_length=25,
                        null=True,
                        verbose_name='Гос. номер ППЦ',
                    ),
                ),
                (
                    'vehicle_model',
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name='Модель',
                    ),
                ),
                (
                    'vehicle_class',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to='vehicle.vehicleortrailerclass',
                        verbose_name='Класс ТС или ППЦ',
                    ),
                ),
            ],
            options={
                'verbose_name': 'ТС или ППЦ',
                'verbose_name_plural': 'ТС или ППЦ',
                'ordering': ['plate_number', 'trailer_plate_number'],
            },
        ),
    ]
