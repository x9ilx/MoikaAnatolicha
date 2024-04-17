import django_filters.rest_framework as django_filters
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Service
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
