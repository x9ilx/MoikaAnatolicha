import django_filters

from .models import EmployerShift


class ShiftFilter(django_filters.FilterSet):
    employer = django_filters.NumberFilter(
        field_name='employer__pk', lookup_expr='exact'
    )
    start_time = django_filters.DateTimeFilter(lookup_expr='gte')
    end_time = django_filters.DateTimeFilter(lookup_expr='lte')

    class Meta:
        model = EmployerShift
        fields = ['employer', 'start_shift_time', 'end_shift_time']
