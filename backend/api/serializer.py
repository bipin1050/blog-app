from dj_rest_auth.serializers import PasswordResetSerializer
from django.conf import settings
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import BlogPost
from .models import Category
from .models import Comment
from .models import Tag
from .models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_superuser",
            "is_staff",
            "date_joined",
        ]


class CreateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class BlogSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField(method_name="get_category")
    tags = serializers.StringRelatedField(many=True)
    author = serializers.SerializerMethodField(method_name="get_author")

    def get_category(self, obj):
        return obj.category.name if obj.category else None

    def get_author(self, obj):
        author = User.objects.get(pk=obj.author_id)
        return (
            author.first_name + " " + author.last_name
            if author.first_name
            else author.username
        )

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "title",
            "content",
            "author",
            "creation_date",
            "category",
            "tags",
        ]
        read_only_fields = ["author", "creation_date"]


class BlogCreateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=255), write_only=True
    )
    category = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "title",
            "content",
            "author",
            "creation_date",
            "category",
            "tags",
        ]
        read_only_fields = ["author", "creation_date"]

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        category_name = validated_data.pop("category")
        category, _ = Category.objects.get_or_create(name=category_name)

        tags_list = []
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            tags_list.append(tag)

        blog_post = BlogPost.objects.create(**validated_data, category=category)
        blog_post.tags.set(tags_list)

        return blog_post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]

    def to_representation(self, instance):
        return instance.name


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name"]

    def to_representation(self, instance):
        return instance.name


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "blog_post", "content"]
        read_only_fields = ["author", "blog_post"]


class CommentReturnSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(method_name="get_author")

    def get_author(self, obj):
        author = User.objects.get(pk=obj.author_id)
        return (
            author.first_name + " " + author.last_name if author.first_name else "User"
        )

    class Meta:
        model = Comment
        fields = ["id", "author", "blog_post", "content"]


class InitialPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CustomPasswordResetSerializer(PasswordResetSerializer):
    """Custom serializer to send emails from queue"""

    def save(self):
        request = self.context.get("request")
        # Set some values to trigger the send_email method.
        opts = {
            "use_https": False,
            "from_email": getattr(settings, "DEFAULT_FROM_EMAIL"),
            "request": request,
            "domain_override": "localhost:8000",
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)
