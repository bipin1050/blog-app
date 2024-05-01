from api.paginations import PageSizePagination
from api.serializer import CustomPasswordResetSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from rest_framework import filters
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BlogPost
from .models import Category
from .models import Comment
from .models import Tag
from .serializer import BlogCreateSerializer
from .serializer import BlogSerializer
from .serializer import CategorySerializer
from .serializer import CommentReturnSerializer
from .serializer import CommentSerializer
from .serializer import CreateUserSerializer
from .serializer import InitialPasswordResetSerializer
from .serializer import LoginSerializer
from .serializer import TagSerializer
from .serializer import UserSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
        return Response(
            {"detail": "Invalid credentials."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "Successfully logged out."})


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(instance=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "User created successfully."},
            status=status.HTTP_201_CREATED,
        )


class BlogsView(ListAPIView):

    serializer_class = BlogSerializer
    pagination_class = PageSizePagination
    search_fields = ["title", "content"]
    filter_backends = [filters.SearchFilter]

    def get(self, request):
        return super().get(request)

    def get_queryset(self):
        queryset = BlogPost.objects.all()
        category_param = self.request.query_params.get("category")
        tags_param = self.request.query_params.get("tags")

        if category_param:
            queryset = queryset.filter(category__name__iexact=category_param.upper())
        if tags_param:
            queryset = queryset.filter(tags__name__iexact=tags_param.upper())
        return queryset


class BlogDetailView(APIView):
    """
    create a specific Blog instance.
    """

    def get(self, request, pk):
        blog = get_object_or_404(BlogPost, pk=pk)
        serializer = BlogSerializer(blog)
        return Response(serializer.data)


class BlogView(APIView):
    """
    create or delete blog instance
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BlogCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = serializer.validated_data["category"]

        category = Category.objects.get_or_create(name=category)[0]
        serializer.save(author=request.user, category=category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        blog = get_object_or_404(BlogPost, pk=pk)
        if blog.author == request.user:
            blog.delete()
            return Response(
                {"message": "Blog deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {"message": "You are not authorized to delete this blog"},
                status=status.HTTP_403_FORBIDDEN,
            )


class RecentBlogListView(ListAPIView):
    serializer_class = BlogSerializer

    def get_queryset(self):
        return BlogPost.objects.order_by("-creation_date")[:5]


class BlogListByCategoryView(ListAPIView):
    serializer_class = BlogSerializer
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        category_id = self.kwargs.get("category_id")
        if category_id:
            queryset = BlogPost.objects.filter(category__id=category_id)
        else:
            queryset = BlogPost.objects.all()
        return queryset


class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class TagListView(APIView):
    def get(self, request):
        categories = Tag.objects.all()
        serializer = TagSerializer(categories, many=True)
        return Response(serializer.data)


class CommentView(APIView):

    def get(self, request, blog_id):
        try:
            comments = Comment.objects.filter(blog_post_id=blog_id)
            serializer = CommentReturnSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response(
                {"message": "Comments not found for this blog post."},
                status=status.HTTP_200_OK,
            )

    def post(self, request, blog_id):
        if not request.user.is_authenticated:
            return Response(
                {"message": "You must be logged in to post a comment."},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            blog = BlogPost.objects.get(id=blog_id)
        except BlogPost.DoesNotExist:
            return Response(
                {"message": "Blog not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user, blog_post=blog)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def is_valid_user_email(email):
    return email in get_user_model().objects.values_list("email", flat=True)


class CustomPasswordResetView(APIView):
    def post(self, request):
        initial_serializer = InitialPasswordResetSerializer(
            data=request.data, context={"request": request}
        )
        initial_serializer.is_valid(raise_exception=True)
        email = initial_serializer.validated_data["email"]

        # Check if the email is valid
        if is_valid_user_email(email):
            reset_serializer = CustomPasswordResetSerializer(
                data=request.data, context={"request": request}
            )
            reset_serializer.is_valid(raise_exception=True)
            reset_serializer.save()
            return Response({"ok": True, "email": email}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Invalid email address."}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["GET"])
def password_reset_confirm(request, uidb64, token):
    """Redirects to frontend password reset confirm"""
    # hardcoding the frontend url for testing purposes
    frontend_url = f"http://localhost:3000/resetpassword/confirm/{uidb64}/{token}/"
    return HttpResponseRedirect(frontend_url)
