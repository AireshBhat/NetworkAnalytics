from django.urls import path, include

from .views import *

urlpatterns = [
    path('', dashboard, name="dashboard"),  # Dashboard
    path('uploadData/', upload_data, name="uploadData"),  # Upload files
    path('devices/', device_list, name="deviceList"),
    path('individualAnalytics/', individual_data, name="individualAnalytics"),  # Individual analysis
    path('deviceStats/', individual_analytics, name="deviceStats"),  # Device stats
    path('comparativeAnalytics/',comparative_analytics, name="comparativeAnalytics"),  # Comparision between devices
]