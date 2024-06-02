from django.db.models import Q
from rest_framework import serializers

from core.string_utils import normalize_plate_number
from employer.models import Employer
from vehicle.serializers import VehicleMiniSerializer, VehicleSerializer

from .models import Order, OrderPaimentMethod, OrderService


class OrderServiceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, source='service.id')
    service_name = serializers.StringRelatedField(
        read_only=True, source='service.name'
    )
    vehicle = VehicleSerializer(read_only=True)
    start_cost = serializers.IntegerField(
        read_only=True, source='service.cost'
    )

    class Meta:
        model = OrderService
        fields = [
            'id',
            'service',
            'service_name',
            'base_service_id',
            'cost',
            'start_cost',
            'employer_salary',
            'percentage_for_washer',
            'vehicle',
            'legal_entity_service',
        ]


class EmployerMiniSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=250, read_only=True)
    short_name = serializers.CharField(max_length=250, read_only=True)

    class Meta:
        model = Employer
        fields = ['id', 'name', 'short_name']


class OrderMiniSerializer(serializers.ModelSerializer):
    administrator = EmployerMiniSerializer()
    washers = EmployerMiniSerializer(many=True)
    services = OrderServiceSerializer(source='services_in_order', many=True)
    payment_method_verbose = serializers.SerializerMethodField()

    def get_payment_method_verbose(self, obj):
        return OrderPaimentMethod(obj.payment_method).label

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
            'payment_method_verbose',
            'client_name',
            'client_phone',
            'services',
            'final_cost',
            'final_cost_contract',
            'final_cost_for_employer_work',
            'each_washer_salary',
            'is_paid',
            'is_completed',
            'has_been_modifed_after_save',
            'backup_info',
            'tractor_trailer_plate_numbers',
            'comments',
        ]
