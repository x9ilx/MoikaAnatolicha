from rest_framework import serializers

from .models import CompanyRequisites


class CompanyRequisitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRequisites
        fields = '__all__'
