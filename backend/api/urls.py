from django.urls import include, path
from rest_framework import routers

from company.views import CompanyRequisitesViewSet
from employer.views import EmployerViewSet
from service.views import ServiceViewSet
from vehicle.views import (VehicleOrTrailerClassViewSet,
                           VehicleOrTrailerTypeViewSet)

app_name = 'api'

v1_router = routers.DefaultRouter()
v1_router.register(
    'company', CompanyRequisitesViewSet, basename='CompanyRequisites'
)
v1_router.register(
    'vehicle_class',
    VehicleOrTrailerClassViewSet,
    basename='VehicleOrTrailerClass',
)
v1_router.register(
    'vehicle_type',
    VehicleOrTrailerTypeViewSet,
    basename='VehicleOrTrailerType',
)
v1_router.register(
    'services',
    ServiceViewSet,
    basename='Service',
)
v1_router.register(
    'employees',
    EmployerViewSet,
    basename='Employer',
)

urlpatterns = [
    path('', include(v1_router.urls)),
    path('', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
