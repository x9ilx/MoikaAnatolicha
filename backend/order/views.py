from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order, OrderPaimentMethod
from .serializers import OrderSerializer

user_model = get_user_model()


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'put', 'delete']
    serializer_class = OrderSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        'administrator',
        'payment_method',
        'vehicle',
        'is_paid',
        'is_completed',
        'has_been_modifed_after_save',
    ]
    ordering = [
        'order_datetime',
    ]
    ordering_fields = [
        'order_datetime',
        'payment_method',
        'has_been_modifed_after_save',
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        return Order.objects.all()

    @action(
        detail=False,
        methods=['GET'],
        url_path='get_payment_methods',
        url_name='get-payment-methods',
    )
    def get_payment_methods(self, request):
        payment_methods = [
            {'name': name, 'verbose_name': name.label}
            for name in OrderPaimentMethod
        ]
        return Response(payment_methods, status=status.HTTP_200_OK)
