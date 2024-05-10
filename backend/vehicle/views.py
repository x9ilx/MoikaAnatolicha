import django_filters.rest_framework as django_filters
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import filters, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from service.serializers import VehicleTypeServiceSerializer
from vehicle.filters import VehicleOrTrailerClassSearchFilter

from .models import (Vehicle, VehicleModel, VehicleOrTrailerClass,
                     VehicleOrTrailerType)
from .serializers import (VehicleModelSerializer,
                          VehicleOrTrailerClassSerializer,
                          VehicleOrTrailerTypeSerializer, VehicleSerializer)


class VehicleModelDelete(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    def destroy(self, request, *args, **kwargs):
        vehicle_model = get_object_or_404(VehicleModel, pk=kwargs['pk'])
        vehicle_model.delete()
        return Response(
            {'result': 'Модель успешно удалена'},
            status=status.HTTP_204_NO_CONTENT,
        )


class VehicleOrTrailerClassViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleOrTrailerClassSerializer
    queryset = VehicleOrTrailerClass.objects.all()
    filter_backends = [
        django_filters.DjangoFilterBackend,
    ]
    filterset_class = VehicleOrTrailerClassSearchFilter
    ordering = ['name']

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
    ordering = ['name']

    @action(
        detail=True,
        methods=['GET'],
        url_path='services',
        url_name='services',
    )
    def get_service_for_vehicle_type(self, request, pk):
        if pk == 'undefined':
            return Response({}, status=status.HTTP_200_OK)
        vehicle = VehicleOrTrailerType.objects.get(pk=pk)

        if not vehicle:
            return Response(
                {'errors': 'Объект не существует'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        services = vehicle.service_vehicle_types.all()
        serializer = VehicleTypeServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer

    def get_queryset(self):
        queryset = Vehicle.objects.all()
        excludes = self.request.GET.getlist('exclude', [])
        search = self.request.GET.get('search', '')
        plate_number = self.request.GET.get('plate_number', '')
        filters = Q()

        if excludes:
            filters &= ~Q(plate_number__in=excludes)

        if search:
            filters &= Q(plate_number__istartswith=search)
            filters |= Q(owner__name__icontains=search)
            filters |= Q(owner__inn__istartswith=search)

        if plate_number:
            filters = Q(plate_number=plate_number)

        return (
            queryset.filter(filters)
            .select_related('owner', 'vehicle_type')
            .order_by('plate_number')
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    @action(
        detail=False,
        methods=['GET'],
        url_path='models',
        url_name='models',
    )
    def get_vehicle_models(self, request):
        search = request.GET.get('search', '')

        models = VehicleModel.objects.filter(
            Q(name__icontains=search)
        ).order_by('name')

        serializer = VehicleModelSerializer(models, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['GET'],
        url_path='find_vehicle_for_plate_number/(?P<plate_number>[\w-]+)',
        url_name='find_vehicle_for_plate_number',
    )
    def find_vehicle_for_plate_number(self, request, plate_number):
        vehicle = Vehicle.objects.filter(plate_number=plate_number)

        if vehicle.exists():
            serializer = VehicleSerializer(instance=vehicle.first())
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({}, status=status.HTTP_200_OK)
