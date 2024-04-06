import django_filters.rest_framework as django_filters
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from service.serializers import VehicleTypeServiceSerializer

from .models import VehicleOrTrailerClass, VehicleOrTrailerType
from .serializers import (
    VehicleOrTrailerClassSerializer,
    VehicleOrTrailerTypeSerializer,
)


class VehicleOrTrailerClassViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleOrTrailerClassSerializer
    pagination_class = None
    queryset = VehicleOrTrailerClass.objects.all()
    filter_backends = [
        filters.SearchFilter,
    ]
    search_fields = ['name']


class VehicleOrTrailerTypeViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleOrTrailerTypeSerializer
    pagination_class = None
    queryset = VehicleOrTrailerType.objects.all().select_related(
        'vehicle_class'
    )
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = [
        'vehicle_class',
    ]
    search_fields = ['name']

    @action(
        detail=True,
        methods=['GET'],
        url_path='services',
        url_name='services',
        # permission_classes=[OnlyAuthor],
    )
    def get_service_for_vehicle_type(self, request, pk):
        vehicle = VehicleOrTrailerType.objects.get(pk=pk)

        if not vehicle:
            return Response(
                {'errors': 'Объект не существует'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        services = vehicle.service_vehicle_types.all()
        serializer = VehicleTypeServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
