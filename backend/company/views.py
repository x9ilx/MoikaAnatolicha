from rest_framework import mixins, viewsets

from .models import CompanyRequisites
from .serializers import CompanyRequisitesSerializer


class CompanyRequisitesViewSet(
    viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin
):
    serializer_class = CompanyRequisitesSerializer
    pagination_class = None
    queryset = CompanyRequisites.objects.all()
