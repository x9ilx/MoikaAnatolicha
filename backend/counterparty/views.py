import django_filters.rest_framework as django_filters
from django.shortcuts import get_object_or_404
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_vehicle_services',
        url_name='vehicle-services',
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
