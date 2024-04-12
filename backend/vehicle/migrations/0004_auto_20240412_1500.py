# Generated by Django 3.2.3 on 2024-04-12 09:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vehicle', '0003_auto_20240405_2223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehicleortrailertype',
            name='is_tractor_with_trailer',
            field=models.BooleanField(blank=True, null=True, verbose_name='Тягач с прицепом?'),
        ),
        migrations.AlterField(
            model_name='vehicleortrailertype',
            name='vehicle_class',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vehicle_types', to='vehicle.vehicleortrailerclass', verbose_name='Класс ТС или ППЦ'),
        ),
    ]