# Generated by Django 3.2.3 on 2024-04-13 02:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('counterparty', '0003_auto_20240412_2048'),
    ]

    operations = [
        migrations.AddField(
            model_name='legalentity',
            name='okpo',
            field=models.TextField(blank=True, null=True, verbose_name='ОКПО'),
        ),
        migrations.AlterField(
            model_name='legalentity',
            name='accountent_phone',
            field=models.TextField(
                blank=True, null=True, verbose_name='Телефон бухгалтера'
            ),
        ),
        migrations.AlterField(
            model_name='legalentity',
            name='mechanic_phone',
            field=models.TextField(
                blank=True, null=True, verbose_name='Телефон механика'
            ),
        ),
    ]