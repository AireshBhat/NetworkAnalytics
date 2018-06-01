from django.urls import path, include

from .views import *

urlpatterns = [
    path('', dashboard, name="dashboard"),  # Dashboard
    path('uploadData/', upload_data, name="uploadData"),  # Upload files
    path('individualAnalytics/', individual_analytics, name="individualAnalytics"),  # Individual analysis
    path('comparativeAnalytics/',comparative_analytics, name="comparativeAnalytics"),  # Comparision between devices
]