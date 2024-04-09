# Generated by Django 3.2.3 on 2024-04-05 16:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('counterparty', '0001_initial'),
        ('vehicle', '0002_auto_20240405_0741'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='vehicle',
            options={
                'ordering': ['plate_number', 'trailer_plate_number'],
                'verbose_name': 'ТС и/или ППЦ',
                'verbose_name_plural': 'ТС и/или ППЦ',
            },
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner',
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='vehicles',
                to='counterparty.legalentity',
                verbose_name='Владелец ТС/ППЦ',
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='vehicleortrailertype',
            name='is_tractor_with_trailer',
            field=models.BooleanField(
                default=False, verbose_name='Тягач с прицепом?'
            ),
            preserve_default=False,
        ),
    ]
