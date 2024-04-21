from django.urls import include, path
from rest_framework import routers

from company.views import CompanyRequisitesViewSet
from counterparty.views import LegalEntityViewSet
from employer.views import CHGUserViewSet, EmployerViewSet
from order.views import OrderViewSet
from service.views import ServiceViewSet
from vehicle.views import (VehicleModelDelete, VehicleOrTrailerClassViewSet,
                           VehicleOrTrailerTypeViewSet, VehicleViewSet)

app_name = 'api'

v1_router = routers.DefaultRouter()
v1_router.register('users', CHGUserViewSet, basename='User')
v1_router.register(
    'company', CompanyRequisitesViewSet, basename='CompanyRequisites'
)
v1_router.register(
    'vehicle_models/delete', VehicleModelDelete, basename='VehicleModel'
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
v1_router.register(
    'legal_entity',
    LegalEntityViewSet,
    basename='LegalEntity',
)
v1_router.register(
    'vehicles',
    VehicleViewSet,
    basename='Vehicle',
)
v1_router.register(
    'orders',
    OrderViewSet,
    basename='Order',
)

urlpatterns = [
    path('', include(v1_router.urls)),
    # path('', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
