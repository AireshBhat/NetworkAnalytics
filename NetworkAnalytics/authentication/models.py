from django.db import models


class AdminUser(models.Model):
    username = models.CharField(max_length=1023, default="", primary_key=True)
    password = models.CharField(max_length=1023, default="", blank=False)
    full_name = models.CharField(max_length=1023, default="", blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
