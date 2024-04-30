from django.urls import path

from .views import BlogDetailView
from .views import BlogView
from .views import CategoryListView
from .views import CommentCreateView
from .views import CurrentUserView
from .views import LoginView
from .views import LogoutView
from .views import RegisterView

urlpatterns = [
    path("users/login/", LoginView.as_view()),
    path("users/logout/", LogoutView.as_view()),
    path("users/register/", RegisterView.as_view()),
    path("users/current/", CurrentUserView.as_view()),
    path("category/list", CategoryListView.as_view(), name="category-list"),
    path("blog/detail/<int:pk>/", BlogDetailView.as_view(), name="blog-detail"),
    path("blog/", BlogView.as_view(), name="blog-create"),
    path("blog/<int:pk>/", BlogView.as_view(), name="blog-delete"),
    path(
        "blog/<int:blog_id>/comment/",
        CommentCreateView.as_view(),
        name="comment-create",
    ),
]
