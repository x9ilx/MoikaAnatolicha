from django.urls import include, path
from rest_framework import routers

from company.views import CompanyRequisitesViewSet

app_name = 'api'

v1_router = routers.DefaultRouter()
v1_router.register(
    'company', CompanyRequisitesViewSet, basename='CompanyRequisites'
)

urlpatterns = [
    path('', include(v1_router.urls)),
    path('', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
