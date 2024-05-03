import django_filters.rest_framework as django_filters
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import OnlyManager
from vehicle.models import VehicleOrTrailerType

from .models import Service, ServiceVehicleType
from .serializers import ServiceSerializer, ServiceVehicleTypeSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    pagination_class = None
    queryset = Service.objects.all()
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = [
        'additional_service',
    ]
    search_fields = ['name']
    ordering = ['name']

    def create(self, request, *args, **kwargs):
        name = request.data['service_name']
        if Service.objects.filter(name=name).exists():
            return Response(
                {'Ошибка': 'Услуга с таким названием уже существует'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance = Service.objects.create(name=name)
        instance.save()
        for vehicle_type in request.data['service_vehicle_types']:
            include = vehicle_type.get('include', None)
            if include is not None:
                if include:
                    ServiceVehicleType.objects.create(
                        service=instance,
                        vehicle_type_id=vehicle_type['id'],
                        cost=vehicle_type['cost'],
                        employer_salary=vehicle_type['employer_salary'],
                        percentage_for_washer=vehicle_type[
                            'percentage_for_washer'
                        ],
                    )

        return Response(
            {'Service Create': name}, status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        name = request.data['service_name']
        service_id = kwargs['pk']

        filters = Q(name=name)
        filters &= ~Q(pk=service_id)

        if Service.objects.filter(filters).exists():
            return Response(
                {'Ошибка': 'Услуга с таким названием уже существует'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance = get_object_or_404(Service, pk=service_id)
        instance.name = name
        instance.save()

        for vehicle_type in request.data['service_vehicle_types']:
            include = vehicle_type.get('include', None)
            if include is not None:
                if include:
                    service_vehicle_type = ServiceVehicleType.objects.filter(
                        service=instance, vehicle_type_id=vehicle_type['id']
                    )
                    if service_vehicle_type.exists():
                        service_type_instance = service_vehicle_type.first()
                        service_type_instance.cost = vehicle_type['cost']
                        service_type_instance.employer_salary = vehicle_type[
                            'employer_salary'
                        ]
                        service_type_instance.percentage_for_washer = (
                            vehicle_type['percentage_for_washer']
                        )
                        service_type_instance.save()
                    else:
                        ServiceVehicleType.objects.create(
                            service=instance,
                            vehicle_type_id=vehicle_type['id'],
                            cost=vehicle_type['cost'],
                            employer_salary=vehicle_type['employer_salary'],
                            percentage_for_washer=vehicle_type[
                                'percentage_for_washer'
                            ],
                        )
                else:
                    ServiceVehicleType.objects.filter(
                        service=instance, vehicle_type_id=vehicle_type['id']
                    ).delete()

        return Response(
            {'Service Update': name}, status=status.HTTP_201_CREATED
        )

    @action(
        detail=True,
        methods=['GET'],
        url_path='vehicle_types',
        url_name='vehicle-types',
    )
    def get_vehicle_types_for_service(self, request, pk):
        service = Service.objects.get(pk=pk)

        if not service:
            return Response(
                {'errors': 'Объект не существует'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vehicle_types = service.service_vehicle_types.all()
        serializer = ServiceVehicleTypeSerializer(vehicle_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
