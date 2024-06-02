import uuid

from django.db.models import Q
from rest_framework import serializers

from core.string_utils import normalize_phone, normalize_plate_number
from counterparty.helpers import get_services_from_service_legal_entity
from vehicle.models import Vehicle, VehicleModel, VehicleOrTrailerType

from .models import (LegalEntity, LegalEntityContract, LegalEntityInvoice,
                     LegalEntytyInvoiceServices)


class VehicleMiniSerializer(serializers.ModelSerializer):
    plate_number = serializers.CharField(max_length=255)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    vehicle_type = serializers.PrimaryKeyRelatedField(
        queryset=VehicleOrTrailerType.objects.all(), allow_null=True
    )
    owner_name = serializers.StringRelatedField(source='owner', read_only=True)
    owner_short_name = serializers.StringRelatedField(
        source='owner.short_name', read_only=True
    )
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
            'owner_short_name',
            'vehicle_type_name',
            'vehicle_class_name',
            'to_be_removed',
            'to_be_added',
            'without_plate_number',
        ]


class LegalEntitySerializer(serializers.ModelSerializer):
    vehicles = serializers.SerializerMethodField()
    vehicles_save = VehicleMiniSerializer(many=True, write_only=True)
    current_contract_verbose = serializers.StringRelatedField(
        source='current_contract', read_only=True
    )

    def get_vehicles(self, obj):
        vehicles = Vehicle.objects.filter(owner=obj).order_by('plate_number')
        return VehicleMiniSerializer(vehicles, many=True).data

    class Meta:
        model = LegalEntity
        fields = [
            'id',
            'name',
            'short_name',
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
            'vehicles_save',
            'current_contract',
            'current_contract_verbose',
        ]

    def update_create_vehicle(self, vehicle_list, instance):
        for vehicle in vehicle_list:  
            if vehicle['to_be_removed'] or vehicle['vehicle_type'] is None:
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
                    plate_number = vehicle['plate_number']
                    if (
                        plate_number == 'Без гос. номера'
                        or vehicle['without_plate_number']
                    ):
                        plate_number = uuid.uuid4().hex.upper()

                    new_vehicle = Vehicle.objects.create(
                        plate_number=plate_number,
                        owner=instance,
                        vehicle_model=vehicle['vehicle_model'],
                        vehicle_type=vehicle['vehicle_type'],
                        without_plate_number=vehicle['without_plate_number'],
                    )
                    new_vehicle.save()

                    new_model, _ = VehicleModel.objects.update_or_create(
                        name=vehicle['vehicle_model']
                    )
                    new_model.save()

    def create(self, validated_data):
        vehicles = validated_data.pop('vehicles_save')

        instance = LegalEntity.objects.create(**validated_data)
        instance.save()

        for attr, value in validated_data.items():
            if attr == 'plate_number':
                value = normalize_plate_number(value)
            if attr == 'phone':
                value = normalize_phone(value)
            setattr(instance, attr, value)

        self.update_create_vehicle(vehicles, instance)

        return instance

    def update(self, instance, validated_data):
        vehicles = validated_data.pop('vehicles_save')

        for attr, value in validated_data.items():
            if attr == 'plate_number':
                value = normalize_plate_number(value)
            if attr == 'phone':
                value = normalize_phone(value)
            setattr(instance, attr, value)

        instance.save()

        self.update_create_vehicle(vehicles, instance)

        return instance


class ContractSerializer(serializers.ModelSerializer):
    vehicles = VehicleMiniSerializer(many=True)
    legal_entity = LegalEntitySerializer()
    services = serializers.SerializerMethodField()

    def get_services(self, obj):
        queryset = obj.services_contract.all()
        result = get_services_from_service_legal_entity(queryset)
        return result

    class Meta:
        model = LegalEntityContract
        fields = '__all__'


class LegalEntytyInvoiceServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalEntytyInvoiceServices
        fields = [
            'id',
            'name',
            'count',
            'cost',
            'total_cost',
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()
    legal_entity = LegalEntitySerializer()

    def get_services(self, obj):
        services = obj.services_invoice.all()
        serializer = LegalEntytyInvoiceServicesSerializer(services, many=True)
        return serializer.data

    class Meta:
        model = LegalEntityInvoice
        fields = '__all__'
