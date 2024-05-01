from rest_framework.pagination import PageNumberPagination


# One of the reason to extend this class is
# size paramter does not show up when directly using
# PageNumberPagination in openapi schema
class PageSizePagination(PageNumberPagination):
    page_size = 10  # Default page size for all endpoints
    page_size_query_param = "size"
    max_page_size = 100
