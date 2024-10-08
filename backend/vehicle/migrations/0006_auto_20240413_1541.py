# Generated by Django 3.2.3 on 2024-04-13 09:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('counterparty', '0005_auto_20240413_0850'),
        ('vehicle', '0005_alter_vehicleortrailertype_is_tractor_with_trailer'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='vehicle',
            options={
                'ordering': ['plate_number'],
                'verbose_name': 'ТС и/или ППЦ',
                'verbose_name_plural': 'ТС и/или ППЦ',
            },
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='trailer_plate_number',
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='owner',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='vehicles',
                to='counterparty.legalentity',
                verbose_name='Владелец ТС/ППЦ',
            ),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='vehicle_class',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='vehicles',
                to='vehicle.vehicleortrailerclass',
                verbose_name='Класс ТС или ППЦ',
            ),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='vehicle_model',
            field=models.CharField(
                blank=True, max_length=255, verbose_name='Модель'
            ),
        ),
    ]
