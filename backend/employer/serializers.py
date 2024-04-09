from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers

from employer.models import Employer, EmployerPositions


class EmployerSerializer(serializers.ModelSerializer):
    user_name = serializers.StringRelatedField(source='user', read_only=True)
    position_verbose = serializers.SerializerMethodField()
  
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
        ]


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
