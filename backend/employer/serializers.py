from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers

from employer.models import Employer


class EmployerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employer
        fields = '__all__'


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