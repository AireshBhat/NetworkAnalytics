from django.contrib import admin

from .models import DeviceParameters


@admin.register(DeviceParameters)
class DeviceParametersAdmin(admin.ModelAdmin):
    ordering = ['device_name']
    search_fields = [
        'device_name', 'device_type', 'device_region', 'device_isp', 'event_state', 'event_state_type',
    ]
