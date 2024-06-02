import uuid

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from employer.models import Employer, EmployerPositions, EmployerShift
from service.models import ServiceVehicleType, ServiceVehicleTypeLegalEntyty
from vehicle.models import Vehicle
from vehicle.serializers import VehicleSerializer

from .models import Order, OrderPaimentMethod, OrderService, OrderWashers
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
        'is_paid',
        'is_completed',
        'has_been_modifed_after_save',
    ]
    ordering = [
        '-order_datetime',
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
        order_datetime__gte = self.request.GET.get('order_datetime__gte', None)
        order_datetime__lte = self.request.GET.get('order_datetime__lte', None)
        order_datetime__gt = self.request.GET.get('order_datetime__gt', None)
        order_datetime__lt = self.request.GET.get('order_datetime__lt', None)
        
        multi_search = self.request.GET.get('multi_search', None)

        filter = Q()
        if order_datetime__gte:
            filter &= Q(order_datetime__gte=order_datetime__gte)
        if order_datetime__lte:
            filter &= Q(order_datetime__lte=order_datetime__lte)
        if order_datetime__gt:
            filter &= Q(order_datetime__gt=order_datetime__gt)
        if order_datetime__lt:
            filter &= Q(order_datetime__lt=order_datetime__lt)
        if multi_search:
            filter &= (
                Q(administrator__name__icontains=multi_search)
                | Q(administrator__short_name__icontains=multi_search)
                | Q(washers_order__washer__name__icontains=multi_search)
                | Q(washers_order__washer__short_name__icontains=multi_search)
                | Q(services_in_order__vehicle__plate_number__icontains=multi_search)
                | Q(services_in_order__vehicle__owner__name__icontains=multi_search)
                | Q(services_in_order__vehicle__owner__short_name__icontains=multi_search)
            )

        return Order.objects.filter(filter).distinct().order_by('-order_datetime')

    def __get_completed_order_for_day(self, request):
        start_date_time = timezone.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        end_date_time = timezone.now().replace(hour=23, minute=59, second=59)
        employer = get_object_or_404(Employer, user=request.user)

        filter = Q(is_completed=True)
        filter &= Q(order_datetime__gte=start_date_time)
        filter &= Q(order_datetime__lte=end_date_time)
        
        if employer.position == EmployerPositions.ADMINISTRATOR:
            shift_pk = get_object_or_404(
                EmployerShift, employer=employer, is_closed=False
            )
            start_date_time = shift_pk.start_shift_time
            end_date_time = timezone.now()
            filter &= Q(administrator=employer)

        return Order.objects.filter(filter).order_by('-order_datetime')

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

    def __get_active_order_count(self):
        return Order.objects.filter(is_completed=False).count()

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_active_order_count',
        url_name='get-active-order-count',
    )
    def get_active_order_count(self, request):
        return Response(
            self.__get_active_order_count(),
            status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_complete_order_for_day',
        url_name='get-complete-order-count-for-day',
    )
    def get_complete_order_for_day(self, request):
        orders = self.paginate_queryset(
            self.__get_completed_order_for_day(request)
        )
        serializer = OrderMiniSerializer(orders, many=True)
        return self.get_paginated_response(serializer.data)

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_complete_order_count_for_day',
        url_name='get-complete-order-count-for-day',
    )
    def get_complete_order_count_for_day(self, request):
        order_count = self.__get_completed_order_for_day(request).count()
        return Response(order_count, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['POST'],
        url_path='set_order_close',
        url_name='set-order-close',
    )
    def set_order_close(self, request, pk=None):
        if pk:
            order = get_object_or_404(Order, pk=pk)
            order.is_completed = True
            order.is_paid = True
            order.order_close_datetime = timezone.now()
            order.save()
            serializer = OrderMiniSerializer(instance=order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {'Ошибка', 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND
        )

    @action(
        detail=True,
        methods=['DELETE'],
        url_path='cancel_order',
        url_name='cancel-order',
    )
    def cancel_order(self, request, pk=None):
        if pk:
            order = get_object_or_404(Order, pk=pk)
            order_number = order.order_number
            employer = Employer.objects.get(user=request.user)
            
            if not order.is_completed:
                order.delete()
                
                return Response(
                    {
                        'Успешная отмена': 
                        f'Заказ № {order_number} успешно отменён'
                    },
                    status=status.HTTP_204_NO_CONTENT
                )
            else:
                if employer.position != EmployerPositions.MANAGER:
                    return Response(
                        {'Ошибка': 'Недостаточно прав'},
                        status=status.HTTP_403_FORBIDDEN
                    )
                else:
                    order.delete()

                    return Response(
                        {
                            'Успешное удаление': 
                            f'Заказ № {order_number} успешно удалён'
                        },
                        status=status.HTTP_204_NO_CONTENT
                    )

        return Response(
            {'Ошибка', 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND
        )

    def update(self, request, *args, **kwargs):
        user = Employer.objects.get(user=request.user)
        services = request.data['services']
        washers = request.data['washers']
        payment_method = request.data['payment_method']
        order = get_object_or_404(Order, pk=kwargs['pk'])

        order.washers_order.all().delete()
        order.services_in_order.all().delete()

        washer_objs = [
            OrderWashers(
                order=order,
                washer_id=washer['id'],
            ) for washer in washers
        ]
        OrderWashers.objects.bulk_create(washer_objs)
        
        total_cost = 0
        total_cost_contract = 0
        final_cost_for_employer = 0
        each_washer_salary = 0
        comments = order.comments
        backup_info = f'{order.backup_info}\n{user.name} / Редактирование заказа:\n'

        service_create_list = []
        for service in services:
            
            if (payment_method != 'CONTRACT'
                and service['legal_entity_service'] == True):
                continue
            
            b_service = None
            contract = ''
            new_employer_salary = service['employer_salary']
            
            if service['legal_entity_service'] == True:
                b_service_exist = ServiceVehicleTypeLegalEntyty.objects.filter(
                    pk=service['base_service_id']
                )
                
                if b_service_exist:
                    b_service = ServiceVehicleTypeLegalEntyty.objects.get(
                        pk=service['base_service_id']
                    )
                    total_cost_contract += service['cost']
                    contract = '(по договору)'
            else:
                b_service_exist = ServiceVehicleTypeLegalEntyty.objects.filter(
                    pk=service['base_service_id']
                )
                
                if b_service_exist:
                    b_service = ServiceVehicleType.objects.get(
                        pk=service['base_service_id']
                    )
                    total_cost += service['cost']

            if not b_service is None:
                new_employer_salary = b_service.employer_salary

                if b_service.cost != service['cost']:
                    comments += f'{user.name} изменил \
                                    стоимость услуги{contract} \
                                    "{service['service_name']}" c \
                                    {b_service.cost}₽ на {service['cost']}₽\n'
                    new_employer_salary = round(
                        (service['cost'] / b_service.cost) * new_employer_salary
                    )
                    service['employer_salary'] = new_employer_salary

            if service['vehicle']['id'] == -1:
                vehicle_obj = Vehicle.objects.get(
                    plate_number=service['vehicle']['plate_number']
                )
                service['vehicle']['id'] = vehicle_obj.pk

            service_create_list.append(
                OrderService(
                    order=order,
                    base_service_id=service['base_service_id'],
                    service_id=service['service']['id'],
                    cost=service['cost'],
                    employer_salary=new_employer_salary,
                    percentage_for_washer=service['percentage_for_washer'],
                    vehicle_id=service['vehicle']['id'],
                    legal_entity_service=service['legal_entity_service']
                )
            )

            calculated_salary = round((service['employer_salary']
                                * (service['percentage_for_washer'] / 100)))
            final_cost_for_employer += calculated_salary


        OrderService.objects.bulk_create(service_create_list)

        each_washer_salary = round(final_cost_for_employer / len(washers))
        backup_info += f'Итоговая стоимость наличные: {total_cost}\n\
                        Итоговая оплата по договору: {total_cost_contract}\n\
                        Итоговая ЗП мойщиков: {final_cost_for_employer}\n\
                        Каждый мойщик получит: {each_washer_salary}'
        order.comments = comments
        order.backup_info = backup_info
        order.final_cost = total_cost
        order.final_cost_contract = total_cost_contract
        order.final_cost_for_employer_work = final_cost_for_employer
        order.each_washer_salary = each_washer_salary
        order.save()
        return Response({'result': 'updated'}, status=status.HTTP_200_OK)
        

    def create(self, request, *args, **kwargs):
        administrator = request.data['administrator']
        administrator_object = Employer.objects.get(pk=administrator)
        payment_method = request.data['payment_method']
        client_name = request.data['client_name']
        clinet_phone = request.data['clinet_phone']
        vehicles = request.data['vehicles']
        services = request.data['services']
        washers = request.data['washers']
        is_paid = request.data['is_paid']
        tractor_trailer = request.data['tractor_trailer']

        if self.__get_active_order_count() >= 6:
            return Response(
                {'Ошибка': 'Создано максимальное количество заказов'},
                status=status.HTTP_400_BAD_REQUEST
            )

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

        order_datetime = timezone.now()
        order_number = order_datetime.strftime("%d%m%Y%H%M%S")

        backup_info = f'Заказ №{order_number}, от {order_datetime.strftime("%d.%m.%Y %H:%M:%S")}\n\
            Метод оплаты: {payment_method}\n\
            Имя клиента: {client_name}\nТелефон клиента:{clinet_phone}\n\
            Администратор: {administrator_object.name}\n\
            Автомобили {vehicles}\nУслуги: {services}\nМойщики: {washers}\n'
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
            is_paid=is_paid,
            is_completed=False,
            has_been_modifed_after_save=False,
            tractor_trailer_plate_numbers=tractor_trailer,
        )

        dict_unique_id = {}

        for vehicle in vehicles:
            if (vehicle['plate_number'] == 'Без гос. номера'
                or vehicle['without_plate_number']):
                new_vehicle = Vehicle.objects.create(
                    without_plate_number=True,
                    plate_number=uuid.uuid4().hex.upper(),
                    owner_id=vehicle['owner'],
                    vehicle_model=vehicle['vehicle_model'],
                    vehicle_type_id=vehicle['vehicle_type'],
                )
                dict_unique_id[vehicle['unique_id']] = new_vehicle.plate_number

        washer_objs = [
            OrderWashers(
                order=order,
                washer_id=washer['id'],
            ) for washer in washers
        ]
        OrderWashers.objects.bulk_create(washer_objs)

        service_create_list = []
        for service in services:
            
            if (payment_method != 'CONTRACT'
                and service['legal_entity_service'] == True):
                continue
            
            b_service = None
            contract = ''
            new_employer_salary = service['employer_salary']
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

            new_employer_salary = b_service.employer_salary

            if service['vehicle']['id'] == -1:  
                vehicle_obj = Vehicle.objects.get(
                    plate_number=dict_unique_id[
                        service['vehicle']['unique_id']
                    ]
                )
                service['vehicle']['id'] = vehicle_obj.pk
                
            if b_service.cost != service['cost']:
                comments += f'{administrator_object.short_name} изменил \
                                стоимость услуги{contract} \
                                "{service['service']['name']}" c \
                                {b_service.cost}₽ на {service['cost']}₽\n'
                new_employer_salary = round(
                    (service['cost'] / b_service.cost) * new_employer_salary
                )
               
                service['employer_salary'] = new_employer_salary

            service_create_list.append(
                OrderService(
                    order=order,
                    base_service_id=service['id'],
                    service_id=service['service']['id'],
                    cost=service['cost'],
                    employer_salary=new_employer_salary,
                    percentage_for_washer=service['percentage_for_washer'],
                    vehicle_id=service['vehicle']['id'],
                    legal_entity_service=service['legal_entity_service']
                )
            )
            

            calculated_salary = round((service['employer_salary']
                                * (service['percentage_for_washer'] / 100)))
            final_cost_for_employer += calculated_salary


        OrderService.objects.bulk_create(service_create_list)

        each_washer_salary = round(final_cost_for_employer / len(washers))
        backup_info += f'Итоговая стоимость наличные: {total_cost}\n\
                        Итоговая оплата по договору: {total_cost_contract}\n\
                        Итоговая ЗП мойщиков: {final_cost_for_employer}\n\
                        Каждый мойщик получит: {each_washer_salary}'
        order.comments = comments
        order.backup_info = backup_info
        order.final_cost = total_cost
        order.final_cost_contract = total_cost_contract
        order.final_cost_for_employer_work = final_cost_for_employer
        order.each_washer_salary = each_washer_salary
        order.save()
        return Response(order.pk, status=status.HTTP_201_CREATED)
