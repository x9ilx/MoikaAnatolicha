from datetime import date, datetime, time
from io import BytesIO

import django_filters.rest_framework as django_filters
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import OnlyManager
from counterparty.helpers import get_services_from_service_legal_entity
from counterparty.pdf_doc import LegalEntityContractDocPDF
from order.models import Order, OrderService
from order.serializers import OrderMiniSerializer, OrderServiceSerializer
from service.models import ServiceVehicleType, ServiceVehicleTypeLegalEntyty
from vehicle.models import Vehicle

from .filters import LegalEntitySearchFilter
from .models import (LegalEntity, LegalEntityContract, LegalEntityInvoice,
                     LegalEntytyContractServices, LegalEntytyInvoiceServices)
from .serializers import (ContractSerializer, InvoiceSerializer,
                          LegalEntitySerializer)


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [
        OnlyManager,
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        queryset = LegalEntityInvoice.objects.all()
        return queryset.select_related('legal_entity').order_by('-pk')

    def create(self, request, *args, **kwargs):
        legal_entity_id = request.data.get('legal_entity', -1)
        services = request.data.get('services', -1)
        str_start_date = request.data.get('start_date', '')
        str_end_date = request.data.get('end_date', '')

        if str_start_date:
            start_date = date.fromisoformat(str_start_date)
        if str_end_date:
            end_date = date.fromisoformat(str_end_date)

        legal_entity = get_object_or_404(LegalEntity, pk=legal_entity_id)
        invoice = LegalEntityInvoice.objects.create(
            legal_entity=legal_entity,
            start_date=start_date,
            end_date=end_date,
        )
        invoice.save()

        new_services_list = []
        for service in services:
            new_services_list.append(
                LegalEntytyInvoiceServices(
                    legal_entity_invoice=invoice,
                    name=service['name'],
                    cost=service['cost'],
                    count=service['count'],
                    total_cost=service['total_cost'],
                )
            )
        LegalEntytyInvoiceServices.objects.bulk_create(new_services_list)

        return Response(invoice.pk, status=status.HTTP_200_OK)


class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [
        OnlyManager,
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        'legal_entity',
    ]
    ordering = [
        '-pk',
    ]
    ordering_fields = [
        '-pk',
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        queryset = LegalEntityContract.objects.all()
        return queryset.select_related('legal_entity').order_by('-pk')

    def create(self, request, *args, **kwargs):
        legal_entity_id = request.data.get('legal_entity', -1)
        str_start_date = request.data.get('start_date', '')
        str_end_date = request.data.get('end_date', '')

        if str_start_date:
            start_date = date.fromisoformat(str_start_date)
        if str_end_date:
            end_date = date.fromisoformat(str_end_date)

        legal_entity = get_object_or_404(LegalEntity, pk=legal_entity_id)
        vehicle_list = legal_entity.vehicles.all()
        service_list = legal_entity.service_legal_entity.all()

        contract = LegalEntityContract.objects.create(
            legal_entity_id=legal_entity.pk,
            start_date=start_date,
            end_date=end_date,
        )

        for vehicle in vehicle_list:
            contract.vehicles.add(get_object_or_404(Vehicle, pk=vehicle.pk))

        contract.save()

        new_services_list = []

        for service in service_list:
            new_services_list.append(
                LegalEntytyContractServices(
                    legal_entity_contract=contract,
                    service_vehicle_type=service.service_vehicle_type,
                    cost=service.cost,
                )
            )
        LegalEntytyContractServices.objects.bulk_create(new_services_list)
        legal_entity.current_contract = contract
        legal_entity.save()
        return Response(contract.pk, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_contract_pdf',
        url_name='get_contract_pdf',
        permission_classes=[],
    )
    def get_contract_pdf(self, request, pk):
        legal_entity_contract = get_object_or_404(LegalEntityContract, pk=pk)
        pdf_template = LegalEntityContractDocPDF(
            legal_entity_contract=legal_entity_contract,
            buffer=BytesIO(),
        )
        response = HttpResponse(content_type='application/pdf')

        pdf = pdf_template.get_pdf()
        response.write(pdf)
        return response

    @action(
        detail=True,
        methods=['POST'],
        url_path='set_contract_to_current',
        url_name='set_contract_to_current',
        permission_classes=[],
    )
    def set_contract_to_current(self, request, pk):
        legal_entity_contract = get_object_or_404(LegalEntityContract, pk=pk)
        legal_entity = legal_entity_contract.legal_entity
        legal_entity.current_contract = legal_entity_contract
        legal_entity.save()
        
        return Response({'legal_entity_contract': str(legal_entity_contract)}, status=status.HTTP_200_OK)

class LegalEntityViewSet(viewsets.ModelViewSet):
    serializer_class = LegalEntitySerializer
    queryset = LegalEntity.objects.all()
    filter_backends = [
        django_filters.DjangoFilterBackend,
    ]
    filterset_class = LegalEntitySearchFilter
    permission_classes = [
        OnlyManager,
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_services_for_period',
        url_name='get_services_for_period',
    )
    def get_services_for_period(self, request, pk):
        legal_entity = get_object_or_404(LegalEntity, pk=pk)

        start_date = ''
        end_date = ''
        str_start_date = self.request.GET.get('start_date', '')
        str_end_date = self.request.GET.get('end_date', '')

        if str_start_date:
            start_date = date.fromisoformat(str_start_date)
            start_date = datetime.combine(start_date, time.min)
        if str_end_date:
            end_date = date.fromisoformat(str_end_date)
            end_date = datetime.combine(end_date, time.max)

        filters = Q(vehicle__owner=legal_entity)
        filters &= Q(legal_entity_service=True)
        filters &= Q(order__is_completed=True)

        if start_date == end_date and start_date and end_date:

            filters &= Q(order__order_datetime=start_date)
        else:
            if start_date:
                filters &= Q(order__order_datetime__gte=start_date)

            if end_date:
                filters &= Q(order__order_datetime__lte=end_date)

        services = OrderService.objects.filter(filters)

        orders_id = []
        for service in services:
            orders_id.append(service.order.pk)

        orders = Order.objects.filter(pk__in=orders_id).order_by(
            'order_datetime'
        )
        serializer = OrderMiniSerializer(orders, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_legal_entity_short_name',
        url_name='get_legal_entity_short_name',
    )
    def get_legal_entity_short_name(self, request, pk):
        employer = get_object_or_404(LegalEntity, pk=pk)
        return Response(employer.short_name, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_vehicle_services',
        url_name='get-vehicle-services',
    )
    def get_vehicle_services(self, request, pk):
        results = []
        legal_entity = get_object_or_404(LegalEntity, pk=pk)
        vehicle_list = legal_entity.vehicles.all()
        vehicle_classes = {}
        added_services = []

        for vehicle in vehicle_list:
            class_id = vehicle.vehicle_type.vehicle_class.id
            class_name = vehicle.vehicle_type.vehicle_class.name

            if class_id not in vehicle_classes.keys():
                vehicle_classes[class_id] = {}
                vehicle_class_res = {
                    'vehicle_class_id': class_id,
                    'vehicle_class_name': class_name,
                    'show': True,
                    'vehicle_type': {},
                }
                vehicle_classes[class_id] = vehicle_class_res

            vehicle_type_id = vehicle.vehicle_type.id
            if (
                vehicle_type_id
                not in vehicle_classes[class_id]['vehicle_type'].keys()
            ):
                vehicle_classes[class_id]['vehicle_type'][vehicle_type_id] = {}
                vehicle_type_res = {
                    'vehicle_type_id': vehicle.vehicle_type.id,
                    'vehicle_type_name': vehicle.vehicle_type.name,
                    'show': True,
                    'services': [],
                }
                vehicle_classes[class_id]['vehicle_type'][
                    vehicle_type_id
                ] = vehicle_type_res

            for service in vehicle.vehicle_type.service_vehicle_types.all():
                service_res = {
                    'service_type_id': service.id,
                    'id': service.service.id,
                    'name': service.service.name,
                    'cost': service.cost,
                    'employer_salary': service.employer_salary,
                    'percentage_for_washer': service.percentage_for_washer,
                    'to_be_added': True,
                    'to_be_removed': False,
                }

                if service.id not in added_services:
                    vehicle_classes[class_id]['vehicle_type'][vehicle_type_id][
                        'services'
                    ].append(service_res)
                    added_services.append(service.id)

        for res in vehicle_classes.values():
            res['vehicle_type'] = res['vehicle_type'].values()
            results.append(res)

        return Response(results, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_services',
        url_name='get-services',
    )
    def get_services(self, request, pk):
        legal_entity = get_object_or_404(LegalEntity, pk=pk)
        legal_entity_services = legal_entity.service_legal_entity.all()

        results = get_services_from_service_legal_entity(legal_entity_services)

        return Response(results, status=status.HTTP_200_OK)

    def legal_entity_service_create(
        self, service_vehicle, service_info, legal_entity
    ):
        legal_entity_service = ServiceVehicleTypeLegalEntyty.objects.create(
            service_vehicle_type=service_vehicle,
            legal_entity=legal_entity,
            cost=service_info['cost'],
            employer_salary=service_info['employer_salary'],
            percentage_for_washer=service_info['percentage_for_washer'],
        )
        legal_entity_service.save()

    @action(
        detail=True,
        methods=['POST'],
        url_path='set_vehicle_services',
        url_name='set-vehicle-services',
    )
    def set_vehicle_services(self, request, pk):
        results = []
        legal_entity = get_object_or_404(LegalEntity, pk=pk)
        # legal_entity.service_legal_entity.all().delete()

        for vehicle_class in request.data.values():
            for vehicle_type in vehicle_class['vehicle_type']:
                for service in vehicle_type['services']:
                    service_v_type_filter = ServiceVehicleType.objects.filter(
                        service_id=service['id'],
                        vehicle_type_id=vehicle_type['vehicle_type_id'],
                    )
                    if service_v_type_filter.exists():
                        service_v_type = service_v_type_filter.first()
                        if service['to_be_added']:
                            legal_entity_service_filter = (
                                ServiceVehicleTypeLegalEntyty.objects.filter(
                                    service_vehicle_type=service_v_type,
                                    legal_entity=legal_entity,
                                )
                            )
                            if legal_entity_service_filter.exists():
                                legal_entity_service = (
                                    legal_entity_service_filter.first()
                                )
                                legal_entity_service.cost = service['cost']
                                legal_entity_service.employer_salary = service[
                                    'employer_salary'
                                ]
                                legal_entity_service.percentage_for_washer = (
                                    service['percentage_for_washer']
                                )
                                legal_entity_service.save()
                            else:
                                self.legal_entity_service_create(
                                    service_v_type,
                                    service,
                                    legal_entity,
                                )
                        if service['to_be_removed'] == True:
                            legal_entity_service_filter = (
                                ServiceVehicleTypeLegalEntyty.objects.filter(
                                    service_vehicle_type=service_v_type,
                                    legal_entity=legal_entity,
                                )
                            )
                            print(legal_entity_service_filter)
                            if legal_entity_service_filter.exists():
                                legal_entity_service_filter.delete()

        return Response(results, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_services_for_vehicle_type/(?P<vehicle_type_id>\d+)',
        url_name='get-services-for-vehicle-type',
    )
    def get_services_for_vehicle_type(self, request, pk, vehicle_type_id):
        results = []
        legal_entity = get_object_or_404(LegalEntity, pk=pk)
        legal_entity_services = legal_entity.service_legal_entity.filter(
            service_vehicle_type__vehicle_type=vehicle_type_id
        )

        for legal_entity_service in legal_entity_services:
            results.append(
                {
                    'id': legal_entity_service.id,
                    'base_service_id': legal_entity_service.id,
                    'service': {
                        'id': legal_entity_service.service_vehicle_type.service.id,
                        'name': legal_entity_service.service_vehicle_type.service.name,
                        'additional_service': legal_entity_service.service_vehicle_type.service.additional_service,
                    },
                    'cost': legal_entity_service.cost,
                    'employer_salary': legal_entity_service.employer_salary,
                    'percentage_for_washer': legal_entity_service.percentage_for_washer,
                    'vehicle_type_id': vehicle_type_id,
                    'legal_entity_service': True,
                }
            )

        return Response(results, status=status.HTTP_200_OK)
