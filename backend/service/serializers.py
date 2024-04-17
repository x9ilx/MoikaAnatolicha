from rest_framework import serializers

from vehicle.serializers import VehicleOrTrailerTypeSerializer

from .models import Service, ServiceVehicleType


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'additional_service',
        ]


class SerializerForCreateUpdateService(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'additional_service',
        ]


class ServiceVehicleTypeSerializer(serializers.ModelSerializer):
    vehicle_type = VehicleOrTrailerTypeSerializer()

    class Meta:
        model = ServiceVehicleType
        fields = [
            'vehicle_type',
            'cost',
            'employer_salary',
            'percentage_for_washer',
        ]


class VehicleTypeServiceSerializer(serializers.ModelSerializer):
    service = ServiceSerializer()

    class Meta:
        model = ServiceVehicleType
        fields = [
            'service',
            'cost',
            'employer_salary',
            'percentage_for_washer',
        ]
