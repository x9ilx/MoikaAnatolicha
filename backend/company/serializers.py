from rest_framework import serializers

from .models import CompanyRequisites


class CompanyRequisitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRequisites
        fields = [
            'name',
            'address',
            'ogrn',
            'inn',
            'okved',
            'name_of_bank',
            'correspondent_account_of_bank',
            'bik_of_bank',
            'account_number_of_IP',
            'email',
            'phone',
            'director_name',
        ]
