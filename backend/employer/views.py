from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from djoser.views import UserViewSet
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import OnlyManager
from employer.models import Employer, EmployerPositions
from employer.serializers import EmployerSerializer

user_model = get_user_model()


class CHGUserViewSet(UserViewSet):
    def get_queryset(self):
        return user_model.objects.filter(~Q(pk=1))


class EmployerViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    serializer_class = EmployerSerializer
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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        return Employer.objects.filter(~Q(pk=1))

    def destroy(self, request, *args, **kwargs):
        employer = get_object_or_404(Employer, pk=kwargs['pk'])
        employer.user.delete()
        employer.delete()
        return Response(
            {'details': 'delete - ok'}, status=status.HTTP_204_NO_CONTENT
        )

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_all_position',
        url_name='get-all-position',
    )
    def get_all_position(self, request):
        positions = [
            {'name': name, 'verbose_name': name.label}
            for name in EmployerPositions
        ]
        return Response(positions, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_free_washers_count',
        url_name='get-free-washers-count',
    )
    def get_free_washers_count(self, request):
        washers = Employer.objects.filter(
            position=EmployerPositions.WASHER, is_busy_working=False
        ).count()
        return Response(
            {'free_washers_count': washers}, status=status.HTTP_200_OK
        )
