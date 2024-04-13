from django.db.models import Q
from django_filters.rest_framework import FilterSet, filters

from vehicle.models import VehicleOrTrailerClass


class VehicleOrTrailerClassSearchFilter(FilterSet):
    search = filters.CharFilter(method='filter_search', label='search')

    class Meta:
        model = VehicleOrTrailerClass
        fields = ['search']

    def filter_search(self, queryset, name, value):
        filters = Q(name__icontains=value)
        filters |= Q(vehicle_types__name__icontains=value)
        return queryset.filter(filters).distinct().order_by('name')


class VehicleSearchFilter(FilterSet):
    search = filters.CharFilter(method='filter_search', label='search')

    class Meta:
        fields = ['search']

    def filter_search(self, queryset, name, value):
        filters = Q(plate_number__istartswith=value)
        return queryset.filter(filters).distinct().order_by('plate_number')
