from django.urls import path
from .views import LoginView
from .views import LogoutView
from .views import RegisterView
from .views import CurrentUserView

urlpatterns = [
    path("users/login/", LoginView.as_view()),
    path("users/logout/", LogoutView.as_view()),
    path("users/register/", RegisterView.as_view()),
    path("users/current/", CurrentUserView.as_view()),
]
