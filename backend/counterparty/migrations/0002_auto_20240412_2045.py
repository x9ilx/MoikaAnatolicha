# Generated by Django 3.2.3 on 2024-04-12 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('counterparty', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='legalentity',
            options={'ordering': ['name'], 'verbose_name': 'Контрагент', 'verbose_name_plural': 'Контрагенты'},
        ),
        migrations.AddField(
            model_name='legalentity',
            name='account_number_of_IP',
            field=models.TextField(blank=True, null=True, verbose_name='Расчётный счёт ИП'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='address',
            field=models.TextField(blank=True, null=True, verbose_name='Адрес'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='bik_of_bank',
            field=models.TextField(blank=True, null=True, verbose_name='БИК банка ИП'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='correspondent_account_of_bank',
            field=models.TextField(blank=True, null=True, verbose_name='Корреспондентский счёт банка ИП'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='director_name',
            field=models.TextField(blank=True, null=True, verbose_name='Должность/ФИО руководителя'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='email',
            field=models.TextField(blank=True, null=True, verbose_name='E-mail'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='inn',
            field=models.TextField(blank=True, null=True, verbose_name='ИНН'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='kpp',
            field=models.TextField(blank=True, null=True, verbose_name='КПП'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='name',
            field=models.TextField(blank=True, null=True, verbose_name='Наименование'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='name_of_bank',
            field=models.TextField(blank=True, null=True, verbose_name='Наименование банка ИП'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='ogrn',
            field=models.TextField(blank=True, null=True, verbose_name='ОГРН'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='okved',
            field=models.TextField(blank=True, null=True, verbose_name='ОКВЭД'),
        ),
        migrations.AddField(
            model_name='legalentity',
            name='phone',
            field=models.TextField(blank=True, null=True, verbose_name='Телефон'),
        ),
    ]
