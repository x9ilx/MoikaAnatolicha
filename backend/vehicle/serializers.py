import uuid

from django.db.models import Q
from rest_framework import serializers

from core.string_utils import normalize_plate_number
from counterparty.models import LegalEntity
from counterparty.serializers import LegalEntitySerializer

from .models import (Vehicle, VehicleModel, VehicleOrTrailerClass,
                     VehicleOrTrailerType)


class VehicleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModel
        fields = [
            'id',
            'name',
        ]


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
                name=vehicle_type['name'], vehicle_class_id=instance.pk
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
        ]


class VehicleMiniSerializer(serializers.ModelSerializer):
    vehicle_type = serializers.StringRelatedField(
        source='vehicle_type.name', read_only=True
    )
    owner = serializers.StringRelatedField(
        source='owner.short_name', read_only=True
    )
    vehicle_class = serializers.StringRelatedField(
        read_only=True, source='vehicle_type.vehicle_class.name'
    )

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'plate_number',
            'vehicle_model',
            'owner',
            'vehicle_type',
            'vehicle_class',
            'owner_id',
            'vehicle_type_id',
        ]


class VehicleSerializer(serializers.ModelSerializer):
    vehicle_type = VehicleOrTrailerTypeSerializer(read_only=True)
    owner = LegalEntitySerializer(read_only=True)
    vehicle_type_id = serializers.PrimaryKeyRelatedField(
        queryset=VehicleOrTrailerType.objects.all(), write_only=True
    )
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=LegalEntity.objects.all(), write_only=True
    )

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'plate_number',
            'vehicle_model',
            'owner',
            'vehicle_type',
            'owner_id',
            'vehicle_type_id',
            'without_plate_number',
        ]

    def validate(self, attrs):
        filter = Q(plate_number=attrs['plate_number'])
        response = (
            {
                'Невозможно изменить на гос. номер': f"Гос. номер \"{attrs['plate_number']}\" уже используется"
            }
            if self.context['request'].method == 'PATCH'
            else {
                'Невозможно добавить гос. номер': f"Гос. номер \"{attrs['plate_number']}\" уже используется"
            }
        )

        if self.context['request'].method == 'PATCH':
            filter &= ~Q(pk=self.instance.pk)

        if Vehicle.objects.filter(filter).exists():
            raise serializers.ValidationError(response)
        return attrs

    def create(self, validated_data):
        validated_data['owner'] = validated_data['owner_id']
        del validated_data['owner_id']
        validated_data['vehicle_type'] = validated_data['vehicle_type_id']
        del validated_data['vehicle_type_id']
        plate_number = normalize_plate_number(
            validated_data.pop('plate_number')
        )

        new_model, _ = VehicleModel.objects.update_or_create(
            name=validated_data['vehicle_model']
        )
        new_model.save()

        if (
            plate_number == 'Без гос. номера'
            or validated_data['without_plate_number']
        ):
            plate_number = uuid.uuid4().hex.upper()

        vehicle = Vehicle.objects.create(
            **validated_data, plate_number=plate_number
        )

        return vehicle

    def update(self, instance, validated_data):
        validated_data['owner'] = validated_data['owner_id']
        del validated_data['owner_id']
        validated_data['vehicle_type'] = validated_data['vehicle_type_id']
        del validated_data['vehicle_type_id']

        for attr, value in validated_data.items():
            if attr == 'plate_number':
                value = normalize_plate_number(value)
            setattr(instance, attr, value)

        instance.save()

        new_model, _ = VehicleModel.objects.update_or_create(
            name=validated_data['vehicle_model']
        )
        new_model.save()

        return instance
