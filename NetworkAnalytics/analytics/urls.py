from django.urls import path, include
from django.contrib.auth import views as auth_views

from .views import *


urlpatterns = [
    path('', dashboard, name="dashboard"),  # Dashboard
    path('uploadData/', upload_data, name="uploadData"),  # Upload files
    path('devices/', device_list, name="deviceList"),
    path('individualAnalytics/', individual_data, name="individualAnalytics"),  # Individual analysis
    path('deviceStats/', individual_analytics, name="deviceStats"),  # Device stats
    path('comparativeAnalytics/',comparative_analytics, name="comparativeAnalytics"),  # Comparision between devices
    path('deleteInfo/', delete_parameters, name="deleteParameters"),
    path('isAllowed/', is_allowed, name="isAllowed"),
    path('logout/', auth_views.logout, {'next_page': '/'}, name='logout'),
]