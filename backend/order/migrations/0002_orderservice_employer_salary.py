# Generated by Django 3.2.3 on 2024-04-06 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderservice',
            name='employer_salary',
            field=models.DecimalField(
                decimal_places=1,
                default=1,
                max_digits=5,
                verbose_name='Оплата сотруднику',
            ),
            preserve_default=False,
        ),
    ]
