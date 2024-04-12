from django.db.models import Q
from rest_framework import serializers

from .models import VehicleOrTrailerClass, VehicleOrTrailerType


class VehicleOrTrailerTypeMiniSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    to_be_removed = serializers.BooleanField(default=False)
    to_be_added = serializers.BooleanField(default=False)

    class Meta:
        model = VehicleOrTrailerType
        fields = [
            'id',
            'name',
            'to_be_removed',
            'to_be_added',
        ]


class VehicleOrTrailerClassSerializer(serializers.ModelSerializer):
    vehicle_types = VehicleOrTrailerTypeMiniSerializer(many=True)
    name = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = VehicleOrTrailerClass
        fields = [
            'id',
            'name',
            'vehicle_types',
        ]

    def validate(self, attrs):
        filter = Q(name=attrs['name'])
        response = (
            {
                'Невозможно изменить имя': f"Класс \"{attrs['name']}\" уже существует"
            }
            if self.context['request'].method == 'PATCH'
            else {
                'Невозможно добавить новый объект': f"Класс \"{attrs['name']}\" уже существует"
            }
        )

        if self.context['request'].method == 'PATCH':
            filter &= ~Q(pk=self.instance.pk)

        if VehicleOrTrailerClass.objects.filter(filter).exists():
            raise serializers.ValidationError(response)
        return attrs

    def create(self, validated_data):
        validated_data.pop('vehicle_types')
        vehicle_class = VehicleOrTrailerClass.objects.create(**validated_data)
        return vehicle_class

    def update(self, instance, validated_data):
        vehicle_types = validated_data.pop('vehicle_types')
        vehicle_types_delete_list = [
            vehicle_type['id']
            for vehicle_type in vehicle_types
            if vehicle_type['to_be_removed'] == True
        ]
        vehicle_types_add_list = [
            vehicle_type
            for vehicle_type in vehicle_types
            if vehicle_type['to_be_added'] == True
        ]
        instance.name = validated_data['name']

        VehicleOrTrailerType.objects.filter(
            pk__in=vehicle_types_delete_list
        ).delete()
        new_vehilce_types = [
            VehicleOrTrailerType(
                name=vehicle_type['name'],
                vehicle_class_id=instance.pk
            )
            for vehicle_type in vehicle_types_add_list
        ]
        VehicleOrTrailerType.objects.bulk_create(new_vehilce_types)
        instance.save()

        return instance


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
