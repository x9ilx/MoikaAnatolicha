# Generated by Django 3.2.3 on 2024-04-17 12:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0004_servicevehicletype_percentage_for_washer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='servicevehicletype',
            name='cost',
            field=models.IntegerField(verbose_name='Стоимость'),
        ),
        migrations.AlterField(
            model_name='servicevehicletype',
            name='employer_salary',
            field=models.IntegerField(verbose_name='Оплата сотруднику'),
        ),
    ]
