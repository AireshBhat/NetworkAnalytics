"""NetworkAnalytics URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from graphene_django.views import GraphQLView

urlpatterns = [
    path('rxukDcskAnhJMZN2nvuJSqajtcAh9Yd0XD9KmpWmt5rlMmF6xNbCEyktm6aXho2T/admin/', admin.site.urls),
    path('graphql', GraphQLView.as_view(graphiql=True)),
    path('zmyJkfZSpDBU8FL0iWZ9HkWpvoraWG9eFSfZd0g0JMvpD1IUxt6AwJfaRclVyg8O/authentication/',
         include('authentication.urls')),
    path('', include('dashboard.urls')),
    path('data/', include('data.urls')),
    path('analytics/', include('analytics.urls')),
]
