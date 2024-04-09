from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


class PageCountPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_page': self.page.paginator.num_pages,
            'results': data
        })