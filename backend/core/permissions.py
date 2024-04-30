from rest_framework import permissions

from employer.models import Employer, EmployerPositions


class OnlyAuth(permissions.BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_anonymous


class OnlyManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_anonymous or request.user.is_superuser

    def has_object_permission(self, request, view, obj):

        if request.user.is_superuser:
            return True

        employer = Employer.objects.get(user=request.user)
        return employer and (
            employer.position == EmployerPositions.MANAGER
            or request.user.is_superuser
        )
