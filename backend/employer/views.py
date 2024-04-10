from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import OnlyManager
from employer.models import Employer, EmployerPositions
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

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_all_position',
        url_name='get-all-position',
    )
    def get_all_position(self, request, id=-1):
        positions = [
            {'name': name, 'verbose_name': name.label}
            for name in EmployerPositions
        ]
        return Response(positions, status=status.HTTP_200_OK)
