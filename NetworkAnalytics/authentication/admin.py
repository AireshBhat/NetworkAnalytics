from django.contrib import admin
from .models import AdminUser


@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    search_fields = ['username', 'full_name']
    ordering = ['full_name']
