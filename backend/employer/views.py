from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets

from core.permissions import OnlyManager
from employer.models import Employer
from employer.serializers import EmployerSerializer


class EmployerViewSet(viewsets.ModelViewSet):
    serializer_class = EmployerSerializer
    queryset = Employer.objects.all()
    permission_classes = [
        OnlyManager,
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        'position',
    ]
    ordering = [
        'name',
    ]
    ordering_fields = [
        'name',
        'position',
    ]
