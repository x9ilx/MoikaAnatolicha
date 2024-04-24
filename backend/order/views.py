from datetime import datetime

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from vehicle.models import Vehicle
from vehicle.serializers import VehicleSerializer
from employer.models import Employer
from service.models import ServiceVehicleType, ServiceVehicleTypeLegalEntyty

from .models import Order, OrderPaimentMethod, OrderService, OrderVehicle, OrderWashers
from .serializers import OrderMiniSerializer

user_model = get_user_model()


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'put', 'delete']
    serializer_class = OrderMiniSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        'administrator',
        'payment_method',
        'vehicle',
        'is_paid',
        'is_completed',
        'has_been_modifed_after_save',
    ]
    ordering = [
        'order_datetime',
    ]
    ordering_fields = [
        'order_datetime',
        'payment_method',
        'has_been_modifed_after_save',
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        return Order.objects.all()

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_payment_methods',
        url_name='get-payment-methods',
    )
    def get_payment_methods(self, request):
        payment_methods = [
            {'name': name, 'verbose_name': name.label}
            for name in OrderPaimentMethod
        ]
        return Response(payment_methods, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        administrator = request.data['administrator']
        administrator_object = Employer.objects.get(pk=administrator)
        payment_method = request.data['payment_method']
        client_name = request.data['client_name']
        clinet_phone = request.data['clinet_phone']
        vehicles = request.data['vehicles']
        services = request.data['services']
        washers = request.data['washers']


        if not services:
             return Response(
                 {'Ошибка': 'Необхоидмо выбрать услуги'},
                 status=status.HTTP_400_BAD_REQUEST
                )
        if not washers:
             return Response(
                 {'Ошибка': 'Необхоидмо назначить мойщиков'},
                 status=status.HTTP_400_BAD_REQUEST
                )
        if not vehicles:
             return Response(
                 {'Ошибка': 'Необхоидмо указать ТС/ПЦ/ППЦ'},
                 status=status.HTTP_400_BAD_REQUEST
                )

        order_datetime = datetime.now()
        order_number = order_datetime.strftime("%d%m%Y%H%M%S")

        backup_info = (f"Заказ №{order_number}, от {order_datetime.strftime(
            "%d.%m.%Y %H:%M:%S")}\nМетод оплаты: {payment_method}\n"
            f'Имя клиента: {client_name}\nТелефон клиента:{clinet_phone}\n'
            f'Администратор: {administrator_object.name}\n'
            f'Автомобили {vehicles}\nУслуги: {services}\nМойщики: {washers}\n')
        comments = ""

        total_cost = 0
        total_cost_contract = 0
        final_cost_for_employer = 0
        each_washer_salary = 0

        order = Order.objects.create(
            order_number=order_number,
            order_datetime=order_datetime,
            order_close_datetime=None,
            administrator_id=administrator,
            payment_method=payment_method,
            client_name=client_name,
            client_phone=clinet_phone,
            final_cost=total_cost,
            final_cost_contract=total_cost_contract,
            final_cost_for_employer_work=final_cost_for_employer,
            each_washer_salary=each_washer_salary,
            is_paid=False,
            is_completed=False,
            has_been_modifed_after_save=False,
        )

        washer_objs = [
            OrderWashers(
                order=order,
                washer_id=washer['id'],
            ) for washer in washers
        ]
        OrderWashers.objects.bulk_create(washer_objs)

        for vehicle in vehicles:
            vehicle_exist = Vehicle.objects.filter(pk=vehicle['id'])
            
            if vehicle_exist.exists():
                OrderVehicle.objects.create(
                    order=order,
                    vehicle_id=vehicle['id'],
                )
            else:
                data = {
                    'plate_number': vehicle['plate_number'],
                    'vehicle_model': vehicle['vehicle_model'],
                    'owner_id': vehicle['owner'],
                    'vehicle_type_id': vehicle['vehicle_type'],
                }
                vehicle_serializer = VehicleSerializer(
                    data=data,
                    context={'request': request}
                )
                vehicle_serializer.is_valid(raise_exception=True)
                new_vehicle = vehicle_serializer.save()
                OrderVehicle.objects.create(
                    order=order,
                    vehicle_id=new_vehicle.pk,
                )
        

        for service in services:
            b_service = None
            contract = ''
            if service['legal_entity_service'] == True:
                b_service = ServiceVehicleTypeLegalEntyty.objects.get(
                    pk=service['id']
                )
                total_cost_contract += service['cost']
                contract = '(по договору)'
            else:
                b_service = ServiceVehicleType.objects.get(
                    pk=service['id']
                )
                total_cost += service['cost']

            if service['vehicle']['id'] == -1:
                vehicle_obj = Vehicle.objects.get(
                    plate_number=service['vehicle']['plate_number']
                )
                service['vehicle']['id'] = vehicle_obj.pk

            order.services_in_order.create(
                order=order,
                service_id=service['service']['id'],
                cost=service['cost'],
                employer_salary=service['employer_salary'],
                percentage_for_washer=service['percentage_for_washer'],
                vehicle_id=service['vehicle']['id'],
                legal_entity_service=service['legal_entity_service']
            )
            if b_service.cost != service['cost']:
                comments += (f'{administrator_object.short_name} изменил '
                                f'стоимость услуги{contract} '
                                f'"{service['service']['name']}" c '
                                f'{b_service.cost}₽ на {service['cost']}₽\n')

            calculated_salary = round((service['employer_salary']
                                * (service['percentage_for_washer'] / 100)))
            final_cost_for_employer += calculated_salary
            

        each_washer_salary = round(final_cost_for_employer / len(washers))
        backup_info += (f'Итоговая стоимость наличные: {total_cost}\n'
                        f'Итоговая оплата по договору: {total_cost_contract}\n'
                        f'Итоговая ЗП мойщиков: {final_cost_for_employer}\n'
                        f'Кажды мойщик получит: {each_washer_salary}')
        order.comments = comments
        order.backup_info = backup_info
        order.final_cost = total_cost
        order.final_cost_contract = total_cost_contract
        order.final_cost_for_employer_work = final_cost_for_employer
        order.each_washer_salary = each_washer_salary
        order.save()
        return Response(order.pk, status=status.HTTP_201_CREATED)