# Generated by Django 3.2.3 on 2024-04-23 05:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('vehicle', '0008_vehiclemodel'),
        ('employer', '0005_employer_is_busy_working'),
        ('service', '0008_alter_servicevehicletypelegalentyty_legal_entity'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_datetime', models.DateTimeField(auto_now_add=True, verbose_name='Дата/время заказа')),
                ('order_close_datetime', models.DateTimeField(blank=True, null=True, verbose_name='Дата/время заказа')),
                ('payment_method', models.CharField(choices=[('CASH', 'Наличные'), ('TRANSFER', 'Перевод'), ('CARD', 'Карта'), ('CONTRACT', 'Договор')], default='CASH', max_length=50, verbose_name='Метод оплаты')),
                ('client_name', models.CharField(blank=True, max_length=255, verbose_name='ФИО/Наименование клиента')),
                ('client_phone', models.CharField(blank=True, max_length=255, verbose_name='Телефон клиента')),
                ('final_cost', models.IntegerField(verbose_name='Итоговая стоимость наличными')),
                ('final_cost_contract', models.IntegerField(verbose_name='Итоговая стоимость')),
                ('final_cost_for_employer_work', models.IntegerField(verbose_name='Итоговая оплата работы сотрудников')),
                ('each_washer_salary', models.IntegerField(verbose_name='Итоговая оплата работы сотрудника')),
                ('is_paid', models.BooleanField(default=False, verbose_name='Оплачен?')),
                ('is_completed', models.BooleanField(default=False, verbose_name='Завершен?')),
                ('has_been_modifed_after_save', models.BooleanField(default=False, verbose_name='Был изменён после сохарнения?')),
                ('backup_info', models.TextField(blank=True, verbose_name='Информация о заказе')),
                ('comments', models.TextField(blank=True, verbose_name='комментарии к заказу')),
                ('is_tractor_trailer', models.BooleanField(default=False, verbose_name='Тягач + ППЦ?')),
                ('trailer_plate_number', models.CharField(blank=True, max_length=20, verbose_name='Гос. номер ППЦ')),
                ('trailer_model', models.CharField(blank=True, max_length=150, verbose_name='Модель ППЦ')),
                ('administrator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='employer.employer', verbose_name='Администратор')),
            ],
            options={
                'verbose_name': 'Заказ',
                'verbose_name_plural': 'Заказы',
                'ordering': ['-order_datetime'],
            },
        ),
        migrations.CreateModel(
            name='OrderWashers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='washers_order', to='order.order', verbose_name='Заказ-ТС')),
                ('washer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders_washers', to='employer.employer', verbose_name='Мойщик')),
            ],
        ),
        migrations.CreateModel(
            name='OrderVehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles_in_order', to='order.order', verbose_name='Заказ-ТС')),
                ('vehicle', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vehicle_orders', to='vehicle.vehicle', verbose_name='ТС/ППЦ')),
            ],
        ),
        migrations.CreateModel(
            name='OrderService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cost', models.IntegerField(verbose_name='Cтоимость')),
                ('employer_salary', models.IntegerField(verbose_name='Оплата сотруднику')),
                ('percentage_for_washer', models.IntegerField(verbose_name='% мойщика')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services_in_order', to='order.order', verbose_name='Заказ-ТС')),
                ('service', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='service.service', verbose_name='Услуга для ТС/ППЦ')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='services',
            field=models.ManyToManyField(through='order.OrderService', to='service.Service', verbose_name='Услуга'),
        ),
        migrations.AddField(
            model_name='order',
            name='vehicle',
            field=models.ManyToManyField(through='order.OrderVehicle', to='vehicle.Vehicle', verbose_name='Услуга'),
        ),
        migrations.AddField(
            model_name='order',
            name='washers',
            field=models.ManyToManyField(through='order.OrderWashers', to='employer.Employer', verbose_name='Мойщики'),
        ),
    ]
