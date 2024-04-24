from django.db.models import Q
from django_filters.rest_framework import FilterSet, filters

from .models import LegalEntity


class LegalEntitySearchFilter(FilterSet):
    search = filters.CharFilter(method='filter_search', label='search')

    class Meta:
        model = LegalEntity
        fields = ['search']

    def filter_search(self, queryset, name, value):
        filters = Q(name__icontains=value)
        filters |= Q(short_name__icontains=value)
        filters |= Q(inn__istartswith=value)
        filters |= Q(vehicles__plate_number__istartswith=value)
        return queryset.filter(filters).distinct().order_by('name')
