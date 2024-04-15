from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer as BaseUserSerializer
from pkg_resources import require
from rest_framework import serializers

from core.string_utils import normalize_phone
from employer.models import Employer, EmployerPositions

user_model = get_user_model()


class EmployerSerializer(serializers.ModelSerializer):
    user_name = serializers.StringRelatedField(source='user', read_only=True)
    position = serializers.ChoiceField(EmployerPositions, required=True)
    position_verbose = serializers.SerializerMethodField(read_only=True)
    add_user = serializers.BooleanField(write_only=True, required=True)
    username = serializers.SlugField(
        write_only=True, required=False, allow_null=True, allow_blank=True
    )
    password = serializers.CharField(
        max_length=255,
        write_only=True,
        required=False,
        allow_null=True,
        allow_blank=True,
    )

    def get_position_verbose(self, obj):
        return EmployerPositions[obj.position].label

    class Meta:
        model = Employer
        fields = [
            'id',
            'position',
            'name',
            'short_name',
            'phone',
            'user_name',
            'position_verbose',
            'add_user',
            'username',
            'password',
        ]
        optional_fields = ['username', 'password', 'add_user']

    def validate_username(self, value):
        if self.context['request'].method == 'POST':
            if user_model.objects.filter(username=value).exists():
                raise serializers.ValidationError(
                    f'Пользователь {value} уже существует'
                )
        return value

    def create(self, validated_data):
        add_user = validated_data.pop('add_user')
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        phone = normalize_phone(validated_data.pop('phone'))

        new_user = None
        if add_user:
            new_user = user_model.objects.create(
                username=username,
                first_name=validated_data['name'],
                is_active=True,
            )
            new_user.set_password(password)
            new_user.save()

        employer = Employer.objects.create(
            **validated_data, user=new_user, phone=phone
        )

        return employer

    def update(self, instance, validated_data):
        add_user = validated_data.pop('add_user')
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        if add_user:
            current_user = instance.user
            if username:
                if current_user:
                    if current_user.username != username:
                        current_user.username = username
                        current_user.save()
                else:
                    new_user = user_model.objects.create(
                        username=username,
                        first_name=validated_data['name'],
                        is_active=True,
                    )
                    new_user.set_password(password)
                    instance.user = new_user

            if password:
                instance.user.set_password(password)
                instance.user.save()

        instance.position = validated_data.get('position', instance.position)
        instance.name = validated_data.get('name', instance.name)
        instance.short_name = validated_data.get(
            'short_name', instance.short_name
        )
        instance.phone = normalize_phone(
            validated_data.get('phone', instance.phone)
        )
        instance.save()

        return instance


class UserSerializer(BaseUserSerializer):
    employer_info = serializers.SerializerMethodField()

    def get_employer_info(self, obj):
        result = {}
        try:
            employer = Employer.objects.get(user=obj)
            result['position'] = employer.position
            result['name'] = employer.name
            result['short_name'] = employer.short_name
            result['phone'] = employer.phone
        except Employer.DoesNotExist:
            ...

        return result

    class Meta(BaseUserSerializer.Meta):
        fields = [
            'id',
            'username',
            'employer_info',
        ]
