from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class PageCountPagination(PageNumberPagination):
    page_size_query_param = 'limit'

    def get_page_number(self, request, paginator):
        page = request.GET.get('page', 1)
        if int(page) > paginator.num_pages:
            return paginator.num_pages

        return super().get_page_number(request, paginator)

    def get_paginated_response(self, data):
        return Response(
            {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'results': data,
            }
        )
