import csv
import os
from io import StringIO
from pathlib import Path

from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection, transaction

from employer.models import Employer, EmployerPositions

User = get_user_model()


class Command(BaseCommand):
    help = 'Загружает данные из приложенных CSV-файлов (../data/)'

    def call_sqlsequence_all_app(self):
        commands = StringIO()
        cursor = connection.cursor()

        self.stdout.write(
            self.style.SUCCESS((f'\nНачинаем: sqlsequencereset'))
        )
        for app in apps.get_app_configs():
            call_command('sqlsequencereset', app.label, stdout=commands)

        cursor.execute(commands.getvalue())

    def print_divider(self):
        """Печатает разделитель в вывод."""
        self.stdout.write(
            self.style.SUCCESS(
                '---------------------------------------------------------'
            )
        )

    def get_data_file_path(self, data_file_name):
        path = settings.BASE_DIR / data_file_name
        result = Path.absolute(path)
        if result:
            self.stdout.write(
                self.style.SUCCESS(f'Файл с данными "{path}" найден')
            )
            return result
        self.stdout.write(
            self.style.ERROR(f'Файл с данными "{path}" не найден')
        )
        return None

    def check_installed_apps(self, app_name):
        if apps.is_installed(app_name):
            self.stdout.write(
                self.style.SUCCESS(f'Приложение "{app_name}" найдено')
            )
            return True

        self.stdout.write(
            self.style.ERROR(f'Приложение "{app_name}" не найдено')
        )
        return False

    def check_table_exist(self, table_name):
        if table_name in connection.introspection.table_names():
            self.stdout.write(
                self.style.SUCCESS(f'Запись в таблицу "{table_name}":')
            )
            return True
        self.stdout.write(
            self.style.ERROR(
                (
                    f'Таблица "{table_name}" не найдена '
                    f'(необходимо выполнить миграции)'
                )
            )
        )
        return False

    def load_requisites(self, data_file_path, model):
        with open(data_file_path, newline='', encoding='UTF-8') as csvfile:
            csv_reader = csv.DictReader(f=csvfile)

            index = 0
            index_all = 0
            with transaction.atomic():
                for row in csv_reader:
                    try:
                        index = index + 1
                        index_all = index_all + 1
                        requisites = model.objects.filter(pk=1)
                        if requisites:
                            requisites.update(**row)
                        else:
                            model.objects.create(**row)

                    except Exception as ex:
                        index = index - 1
                        self.stdout.write(
                            self.style.ERROR(
                                f'Запись "{row}" не добавлена: {ex}'
                            )
                        )
            self.stdout.write(
                self.style.SUCCESS(
                    (f'\nДобавлено {index} записей ' f'из {index_all}\n\n')
                )
            )

    def load_no_foreign_key_table(self, data_file_path, model):
        with open(data_file_path, newline='', encoding='UTF-8') as csvfile:
            csv_reader = csv.DictReader(f=csvfile)

            index = 0
            index_all = 0
            with transaction.atomic():
                for row in csv_reader:
                    try:
                        index = index + 1
                        index_all = index_all + 1
                        model.objects.update_or_create(**row)

                    except Exception as ex:
                        index = index - 1
                        self.stdout.write(
                            self.style.ERROR(
                                f'Запись "{row}" не добавлена: {ex}'
                            )
                        )
            self.stdout.write(
                self.style.SUCCESS(
                    (f'\nДобавлено {index} записей ' f'из {index_all}\n\n')
                )
            )

    def load_data(self, app_name, model_name, data_file_name, load_func):
        model = apps.get_model(app_name, model_name)
        table_name = model.objects.model._meta.db_table

        if self.check_table_exist(table_name):
            data_file_path = self.get_data_file_path(data_file_name)

            if data_file_path:
                load_func(data_file_path, model)
                return

            self.stdout.write('\n')
            self.stdout.write(
                self.style.ERROR(
                    (
                        f'Ошибка при загрузке данных в таблицу "{table_name}" '
                        f'из файла "../{data_file_name}"'
                    )
                )
            )
            self.stdout.write('\n\n')

    def create_super_user(self):
        self.stdout.write(self.style.SUCCESS(f'Создание суперпользователя'))
        try:
            newuser, _ = User.objects.update_or_create(
                pk=1,
                username=os.getenv('SUPERUSER_NAME'),
                is_superuser=True,
                is_staff=True,
                is_active=True,
            )
            newuser.set_password(os.getenv('SUPERUSER_PASSWORD'))
            newuser.save()

            Employer.objects.update_or_create(
                pk=1,
                name='Управляющий',
                short_name='Управляющий',
                user=newuser,
                position=EmployerPositions.MANAGER,
            )
            self.stdout.write(self.style.SUCCESS(f'Суперпользователь создан'))
        except Exception as ex:
            self.stdout.write('\n')
            self.stdout.write(
                self.style.ERROR((f'Ошибка при создании пользователя: {ex}'))
            )
        self.stdout.write('\n\n')

    def handle(self, *args, **kwargs):

        self.print_divider()

        self.create_super_user()

        if self.check_installed_apps('company'):
            self.load_data(
                'company',
                'CompanyRequisites',
                './data/company_requisites.csv',
                self.load_requisites,
            )

        if self.check_installed_apps('vehicle'):
            self.load_data(
                'vehicle',
                'VehicleOrTrailerClass',
                './data/vehicle_or_trailer_class.csv',
                self.load_no_foreign_key_table,
            )
            self.load_data(
                'vehicle',
                'VehicleOrTrailerType',
                './data/vehicle_or_trailer_type.csv',
                self.load_no_foreign_key_table,
            )
            self.load_data(
                'vehicle',
                'VehicleModel',
                './data/vehicle_models.csv',
                self.load_no_foreign_key_table,
            )
        if self.check_installed_apps('service'):
            self.load_data(
                'service',
                'Service',
                './data/services.csv',
                self.load_no_foreign_key_table,
            )
            self.load_data(
                'service',
                'ServiceVehicleType',
                './data/service_vehicle_types.csv',
                self.load_no_foreign_key_table,
            )

        self.call_sqlsequence_all_app()
        self.print_divider()
