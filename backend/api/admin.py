from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from . import models


@admin.register(models.User)
class UserAdmin(BaseUserAdmin):

    list_display = (
        "id",
        "username",
        "first_name",
        "last_name",
        "email",
        "is_staff",
        "date_joined",
    )

    list_filter = (
        "last_login",
        "date_joined",
        "is_active",
        "is_superuser",
        "is_staff",
    )

    search_fields = ("id", "email", "username")


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("id", "name")


@admin.register(models.Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("id", "name")

@admin.register(models.BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("id","title", "content", "author", "creation_date")
    search_fields = ("id","title", "author")

@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "author")
    search_fields = ("id", "author")