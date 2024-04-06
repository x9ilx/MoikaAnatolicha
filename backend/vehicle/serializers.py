from rest_framework import serializers

from .models import VehicleOrTrailerClass, VehicleOrTrailerType


class VehicleOrTrailerClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleOrTrailerClass
        fields = '__all__'


class VehicleOrTrailerTypeSerializer(serializers.ModelSerializer):
    vehicle_class = serializers.PrimaryKeyRelatedField(
        queryset=VehicleOrTrailerClass.objects.all()
    )
    vehicle_class_name = serializers.StringRelatedField(
        source='vehicle_class', read_only=True
    )

    class Meta:
        model = VehicleOrTrailerType
        fields = [
            'id',
            'name',
            'vehicle_class',
            'vehicle_class_name',
            'is_tractor_with_trailer',
        ]
