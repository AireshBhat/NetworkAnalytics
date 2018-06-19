from django.contrib import admin

from .models import *


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    ordering = ['device_name']
    search_fields = [
        'device_name', 'device_type', 'device_region', 'device_isp',
    ]


@admin.register(DeviceParameters)
class DeviceParametersAdmin(admin.ModelAdmin):
    ordering = ['device_name']
    search_fields = [
        'device_name', 'device_type', 'device_region', 'device_isp', 'event_state', 'event_state_type',
    ]

@admin.register(Parameters)
class ParametersAdmin(admin.ModelAdmin):
    ordering = ['device_name']
    search_fields = [
        'device_name', 'device_type', 'device_region', 'device_isp', 'event_state', 'event_state_type',
    ]


@admin.register(DataUpload)
class DataUploadAdmin(admin.ModelAdmin):
    ordering = ['upload_file']
    search_fields = [
        'upload_file',
    ]
