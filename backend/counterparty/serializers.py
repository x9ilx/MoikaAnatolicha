from django.db.models import Q
from rest_framework import serializers

from core.string_utils import normalize_plate_number
from vehicle.models import Vehicle, VehicleOrTrailerType

from .models import LegalEntity


class VehicleMiniSerializer(serializers.ModelSerializer):
    plate_number = serializers.CharField(max_length=25)
    owner = serializers.PrimaryKeyRelatedField(
        queryset=LegalEntity.objects.all()
    )
    vehicle_type = serializers.PrimaryKeyRelatedField(
        queryset=VehicleOrTrailerType.objects.all()
    )
    owner_name = serializers.StringRelatedField(source='owner', read_only=True)
    vehicle_type_name = serializers.StringRelatedField(
        source='vehicle_type', read_only=True
    )
    vehicle_class_name = serializers.StringRelatedField(
        source='vehicle_type.vehicle_class.name', read_only=True
    )
    to_be_removed = serializers.BooleanField(default=False)
    to_be_added = serializers.BooleanField(default=False)

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'plate_number',
            'owner',
            'vehicle_model',
            'vehicle_type',
            'owner_name',
            'vehicle_type_name',
            'vehicle_class_name',
            'to_be_removed',
            'to_be_added',
        ]

    def create(self, validated_data):
        print(validated_data)
        return None

    def update(self, instance, validated_data):
        print(validated_data)
        return instance

class LegalEntitySerializer(serializers.ModelSerializer):
    vehicles = VehicleMiniSerializer(many=True)

    class Meta:
        model = LegalEntity
        fields = [
            'id',
            'name',
            'address',
            'ogrn',
            'inn',
            'kpp',
            'okpo',
            'okved',
            'name_of_bank',
            'correspondent_account_of_bank',
            'bik_of_bank',
            'account_number_of_IP',
            'email',
            'phone',
            'director_name',
            'mechanic_name',
            'accountent_name',
            'mechanic_phone',
            'accountent_phone',
            'vehicles',
        ]


    def create(self, validated_data):
        print("LegalEntitySerializer")
        print(validated_data)
        return None

    def update(self, instance, validated_data):
        vehicles = validated_data.pop('vehicles')
        
        for attr, value in validated_data.items():
            if (attr == 'plate_number'):
                value = normalize_plate_number(value)
            setattr(instance, attr, value)
        
        instance.save()
        
        for vehicle in vehicles:
            if vehicle['to_be_removed']:
                current_vehicle = instance.vehicles.get(
                plate_number=vehicle['plate_number']
            )
                current_vehicle.owner = None
                current_vehicle.save()

            if vehicle['to_be_added']:
                added_vehicle_exist = Vehicle.objects.filter(
                    plate_number=vehicle['plate_number']
                ).exists()

                if added_vehicle_exist:
                    added_vehicle = Vehicle.objects.get(
                        plate_number=vehicle['plate_number']
                    )
                    added_vehicle.owner = instance
                    added_vehicle.save()
                else:
                    new_vehicle = Vehicle.objects.create(
                        plate_number=vehicle['plate_number'],
                        owner=vehicle['owner'],
                        vehicle_model=vehicle['vehicle_model'],
                        vehicle_type=vehicle['vehicle_type'],
                    )
                    new_vehicle.save()

        return instance