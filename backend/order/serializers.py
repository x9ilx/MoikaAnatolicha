from django.db.models import Q
from rest_framework import serializers

from vehicle.serializers import VehicleMiniSerializer
from core.string_utils import normalize_plate_number
from employer.models import Employer

from .models import Order, OrderService


class OrderServiceSerializer(serializers.ModelSerializer):
    vehicle_type = serializers.StringRelatedField(read_only=True, source='vehicle.vehicle_type.id')
    vehicle_type_name = serializers.StringRelatedField(read_only=True, source='vehicle.vehicle_type.name')
    vehicle_class_name = serializers.StringRelatedField(read_only=True, source='vehicle.vehicle_type.vehicle_class.name')
    service_name = serializers.StringRelatedField(read_only=True, source='service.name')
    vehicle_plate_number = serializers.StringRelatedField(read_only=True, source='vehicle.plate_number')
    vehicle_model = serializers.StringRelatedField(read_only=True, source='vehicle.vehicle_model')

    class Meta:
        model = OrderService
        fields = [
            'service',
            'service_name',
            'cost',
            'employer_salary',
            'percentage_for_washer',
            'vehicle_type',
            'vehicle_type_name',
            'vehicle_class_name',
            'vehicle_plate_number',
            'vehicle_model',
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
    vehicle = VehicleMiniSerializer(many=True)
    services = OrderServiceSerializer(source='services_in_order', many=True)

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
            'final_cost_contract',
            'final_cost_for_employer_work',
            'each_washer_salary',
            'is_paid',
            'is_completed',
            'has_been_modifed_after_save',
            'backup_info',
            'comments',
        ]
