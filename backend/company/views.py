from rest_framework import mixins, viewsets

from .models import CompanyRequisites, CompanySettings
from .serializers import CompanyRequisitesSerializer, CompanySettingsSerializer


class CompanyRequisitesViewSet(
    viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin
):
    serializer_class = CompanyRequisitesSerializer
    pagination_class = None
    queryset = CompanyRequisites.objects.all()


class CompanySettingsViewSet(
    viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin
):
    serializer_class = CompanySettingsSerializer
    pagination_class = None
    queryset = CompanySettings.objects.all()
