from rest_framework import serializers

from .models import CompanyRequisites, CompanySettings


class CompanyRequisitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRequisites
        fields = [
            'name',
            'address',
            'ogrn',
            'inn',
            'okved',
            'okpo',
            'name_of_bank',
            'correspondent_account_of_bank',
            'bik_of_bank',
            'account_number_of_IP',
            'email',
            'phone',
            'director_name',
        ]


class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = [
            'administrator_wage_threshold',
            'administrator_earnings_after_threshold',
            'administrator_additional_payment_threshold',
            'administrator_additional_payments_after_threshold',
            'overdue_order_timer',
        ]
