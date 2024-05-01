from api.views import CustomPasswordResetView
from api.views import password_reset_confirm
from django.urls import include
from django.urls import path

from .views import BlogDetailView
from .views import BlogsView
from .views import BlogView
from .views import CategoryListView
from .views import CommentView
from .views import CurrentUserView
from .views import LoginView
from .views import LogoutView
from .views import RecentBlogListView
from .views import RegisterView
from .views import TagListView

urlpatterns = [
    path("users/login/", LoginView.as_view()),
    path("users/logout/", LogoutView.as_view()),
    path("users/register/", RegisterView.as_view()),
    path("users/current/", CurrentUserView.as_view()),
    path("category/list/", CategoryListView.as_view(), name="category-list"),
    path("tag/list/", TagListView.as_view(), name="tag-list"),
    path("blog/detail/<int:pk>/", BlogDetailView.as_view(), name="blog-detail"),
    path("blog/", BlogView.as_view(), name="blog-create"),
    path("blog/<int:pk>/", BlogView.as_view(), name="blog-delete"),
    path(
        "blog/<int:blog_id>/comment/",
        CommentView.as_view(),
        name="comment-create-view",
    ),
    path("blogs/", BlogsView.as_view(), name="blogs-list"),
    path("blogs/recent/", RecentBlogListView.as_view(), name="recent-blogs"),
    path("auth/password/reset/", CustomPasswordResetView.as_view()),
    path("auth/", include("dj_rest_auth.urls")),
    path(
        "auth/forgot-password/confirm/<str:uidb64>/<str:token>/",
        password_reset_confirm,
        name="password_reset_confirm",
    ),
]
