from io import BytesIO

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CompanyRequisites
from .serializers import CompanyRequisitesSerializer


class CompanyRequisitesViewSet(
    viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin
):
    serializer_class = CompanyRequisitesSerializer
    pagination_class = None
    queryset = CompanyRequisites.objects.all()
