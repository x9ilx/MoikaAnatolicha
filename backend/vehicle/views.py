import django_filters.rest_framework as django_filters
from django.shortcuts import get_object_or_404
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from service.serializers import VehicleTypeServiceSerializer
from vehicle.filters import VehicleOrTrailerClassSearchFilter

from .models import VehicleOrTrailerClass, VehicleOrTrailerType
from .serializers import (VehicleOrTrailerClassSerializer,
                          VehicleOrTrailerTypeSerializer)


class VehicleOrTrailerClassViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleOrTrailerClassSerializer
    queryset = VehicleOrTrailerClass.objects.all()
    filter_backends = [
        django_filters.DjangoFilterBackend,
    ]
    filterset_class = VehicleOrTrailerClassSearchFilter

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def destroy(self, request, *args, **kwargs):
        vehicle_class = get_object_or_404(
            VehicleOrTrailerClass, pk=kwargs['pk']
        )
        vehicle_class.vehicle_types.all().delete()
        vehicle_class.delete()
        return Response(
            {'details': 'delete - ok'}, status=status.HTTP_204_NO_CONTENT
        )

    @action(
        detail=True,
        methods=['GET'],
        url_path='get_vehicle_types',
        url_name='get-vehicle-types',
    )
    def get_vehicle_types(self, request, pk):
        vehicle = VehicleOrTrailerClass.objects.get(pk=pk)

        if not vehicle:
            return Response(
                {'errors': 'Объект не существует'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vehicle_types = vehicle.vehicle_types.all()
        serializer = VehicleOrTrailerTypeSerializer(vehicle_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
