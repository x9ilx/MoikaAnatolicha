from django.db.models import Q
from rest_framework import serializers

from core.string_utils import normalize_plate_number
from employer.models import Employer

from .models import Order


class EmployerMiniSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=250, read_only=True)
    short_name = serializers.CharField(max_length=250, read_only=True)

    class Meta:
        model = Employer
        fields = ['id', 'name', 'short_name']


class OrderSerializer(serializers.ModelSerializer):
    administrator = EmployerMiniSerializer()
    washers = EmployerMiniSerializer(many=True)
    services = serializers.ListField()

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'order_datetime',
            'order_close_datetime',
            'administrator',
            'washers',
            'payment_method',
            'client_name',
            'client_phone',
            'vehicle',
            'services',
            'final_cost',
            'final_cost_for_employer_work',
            'is_paid',
            'is_completed',
            'has_been_modifed_after_save',
            'backup_info',
            'comments',
            'if_tractor_trailer',
            'trailer_plate_number',
        ]
