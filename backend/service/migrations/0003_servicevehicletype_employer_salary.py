# Generated by Django 3.2.3 on 2024-04-05 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0002_auto_20240405_0804'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicevehicletype',
            name='employer_salary',
            field=models.DecimalField(decimal_places=1, default=1, max_digits=5, verbose_name='Оплата сотруднику'),
            preserve_default=False,
        ),
    ]
