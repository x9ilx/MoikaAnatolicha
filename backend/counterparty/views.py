from unittest import result

import django_filters.rest_framework as django_filters
from django.shortcuts import get_object_or_404
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import OnlyManager
from service.models import ServiceVehicleType, ServiceVehicleTypeLegalEntyty
from vehicle.models import VehicleOrTrailerType

from .filters import LegalEntitySearchFilter
from .models import LegalEntity
from .serializers import LegalEntitySerializer


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

    def get_services_from_service_legal_entity(self, legal_entity_services):
        results = []
        vehicle_classes = {}

        for legal_entity_service in legal_entity_services:
            vehicle_type_id = (
                legal_entity_service.service_vehicle_type.vehicle_type.id
            )
            vehicle_type_name = (
                legal_entity_service.service_vehicle_type.vehicle_type.name
            )
            vehicle_type_class_id = (
                legal_entity_service.service_vehicle_type.vehicle_type.vehicle_class.id
            )
            vehicle_type_class_name = (
                legal_entity_service.service_vehicle_type.vehicle_type.vehicle_class.name
            )

            if vehicle_type_class_id not in vehicle_classes.keys():
                vehicle_classes[vehicle_type_class_id] = {
                    'vehicle_class_id': vehicle_type_class_id,
                    'vehicle_class_name': vehicle_type_class_name,
                    'show': True,
                    'vehicle_type': [],
                }

            added = True
            for v_t_id in vehicle_classes[vehicle_type_class_id][
                'vehicle_type'
            ]:
                if v_t_id['vehicle_type_id'] == vehicle_type_id:
                    added = False

            if added:
                vehicle_classes[vehicle_type_class_id]['vehicle_type'].append(
                    {
                        'vehicle_type_id': vehicle_type_id,
                        'vehicle_type_name': vehicle_type_name,
                        'show': True,
                        'services': [],
                    }
                )

            service_info = legal_entity_service.service_vehicle_type

            for vehicle_type in vehicle_classes[vehicle_type_class_id][
                'vehicle_type'
            ]:
                if vehicle_type['vehicle_type_id'] == vehicle_type_id:
                    vehicle_type['services'].append(
                        {
                            'service_type_id': service_info.id,
                            'id': service_info.service.id,
                            'name': service_info.service.name,
                            'cost': legal_entity_service.cost,
                            'employer_salary': legal_entity_service.employer_salary,
                            'percentage_for_washer': legal_entity_service.percentage_for_washer,
                            'to_be_added': True,
                            'to_be_removed': False,
                        }
                    )

        for res in vehicle_classes.values():
            results.append(res)

        return results

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_services',
        url_name='get-services',
    )
    def get_services(self, request, pk):
        legal_entity = get_object_or_404(LegalEntity, pk=pk)
        legal_entity_services = legal_entity.service_legal_entity.all()

        results = self.get_services_from_service_legal_entity(
            legal_entity_services
        )

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
        legal_entity.service_legal_entity.all().delete()

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
