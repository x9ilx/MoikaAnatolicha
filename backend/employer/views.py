from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from djoser.views import UserViewSet
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from company.models import CompanySettings
from core.permissions import OnlyManager
from employer.models import Employer, EmployerPositions, EmployerShift
from employer.serializers import EmployerSerializer
from order.models import Order

user_model = get_user_model()


class CHGUserViewSet(UserViewSet):
    def get_queryset(self):
        return user_model.objects.filter(~Q(pk=1))


class EmployerViewSet(viewsets.ModelViewSet):
    serializer_class = EmployerSerializer
    permission_classes = [
        OnlyManager,
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "position",
        "on_shift",
    ]
    ordering = [
        "name",
    ]
    ordering_fields = [
        "name",
        "position",
    ]
    search_fields = ["name", "short_name"]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        return Employer.objects.filter(~Q(pk=1))

    def destroy(self, request, *args, **kwargs):
        employer = get_object_or_404(Employer, pk=kwargs["pk"])
        employer.user.delete()
        employer.delete()
        return Response(
            {"details": "delete - ok"}, status=status.HTTP_204_NO_CONTENT
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path="get_all_position",
        url_name="get-all-position",
    )
    def get_all_position(self, request):
        positions = [
            {"name": name, "verbose_name": name.label}
            for name in EmployerPositions
        ]
        return Response(positions, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["PUT"],
        url_path="set_washer_on_shift/(?P<value>[\d])",
        url_name="set_washer_on_shift",
    )
    def set_washer_on_shift(self, request, pk, value):
        employer = get_object_or_404(Employer, pk=pk)

        if value == "0":
            in_work = Order.objects.filter(
                is_completed=False, washers_order__washer=employer
            ).exists()

            if in_work:
                return Response(
                    {
                        f'Мойщик {employer.short_name} на заказе. ':
                        'Невозможно снять со смены.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        employer.on_shift = True if value == "1" else False
        employer.save()
        return Response(
            {"on_shift": employer.on_shift}, status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path="get_free_washers_count",
        url_name="get-free-washers-count",
    )
    def get_free_washers_count(self, request):
        washers = Employer.objects.filter(
            position=EmployerPositions.WASHER, is_busy_working=False
        ).count()
        return Response(
            {"free_washers_count": washers}, status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["POST"],
        url_path="open_shift",
        url_name="open-shift",
    )
    def open_shift(self, request, pk):
        employer = get_object_or_404(Employer, pk=pk)

        if employer.position == EmployerPositions.ADMINISTRATOR:
            shift_exist = EmployerShift.objects.filter(
                employer=employer,
                is_closed=False,
            )
            shift_id = -1
            if shift_exist.exists():
                shift = shift_exist.first()
                shift_id = shift.pk
            else:
                shift = EmployerShift.objects.create(
                    employer=employer,
                )
                shift_id = shift.pk

            return Response({"shift_id": shift_id}, status=status.HTTP_200_OK)
        return Response({"shift_id": -1}, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["POST"],
        url_path="close_shift",
        url_name="close_shift",
    )
    def close_shift(self, request, pk):

        employer = get_object_or_404(Employer, pk=pk)
        if employer.position == EmployerPositions.ADMINISTRATOR:
            shift_pk = get_object_or_404(
                EmployerShift, employer=employer, is_closed=False
            )
            settings = CompanySettings.objects.get(pk=1)
            shift = get_object_or_404(EmployerShift, pk=shift_pk.pk)
            shift.end_shift_time = timezone.now()
            shift.employer_salary = 0
            shift.is_closed = True

            orders = Order.objects.filter(
                is_completed=True,
                order_datetime__gte=shift.start_shift_time,
                order_datetime__lte=shift.end_shift_time,
            )

            final_cost = 0
            for order in orders:
                final_cost += order.final_cost + order.final_cost_contract

            if final_cost >= settings.administrator_wage_threshold:
                shift.employer_salary += (
                    settings.administrator_earnings_after_threshold
                )
                current_cost = (
                    final_cost - settings.administrator_wage_threshold
                )
                if (
                    current_cost
                    >= settings.administrator_additional_payment_threshold
                ):
                    salary_multipler = (
                        current_cost
                        // settings.administrator_additional_payment_threshold
                    )
                    shift.employer_salary += (
                        settings.administrator_additional_payments_after_threshold
                        * salary_multipler
                    )

            shift.save()

            return Response("Смена закрыта", status=status.HTTP_200_OK)
        return Response(
            "Закртие смены доступно только администратору",
            status=status.HTTP_200_OK,
        )
