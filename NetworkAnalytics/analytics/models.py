from django.db import models
from django.conf import settings


class DataUpload(models.Model):
    upload_time = models.DateTimeField(auto_created=True)
    upload_file = models.FileField(upload_to=settings.STATIC_URL[1:])


class Device(models.Model):
    created_at = models.DateTimeField(auto_created=True)
    device_name = models.CharField(max_length=1023, primary_key=True, blank=False, default="")
    device_type = models.CharField(max_length=20, blank=False, default="")
    device_region = models.CharField(max_length=1023, blank=False, default="")
    device_isp = models.CharField(max_length=1023, blank=False, default="")

    class Meta:
        ordering = ['created_at']


class DeviceParameters(models.Model):
    device_name = models.CharField(max_length=1023, primary_key=True, blank=False, default="")
    device_type = models.CharField(max_length=20, blank=False, default="")
    device_region = models.CharField(max_length=1023, blank=False, default="")
    device_isp = models.CharField(max_length=1023, blank=False, default="")
    event_start_time = models.CharField(max_length=50, blank=False, default="")
    event_start_date = models.CharField(max_length=50, blank=False, default="")
    event_end_time = models.CharField(max_length=50, blank=False, default="")
    event_end_date = models.CharField(max_length=50, blank=False, default="")
    event_duration = models.CharField(max_length=50, blank=False, default="")
    event_state = models.CharField(max_length=10, default="")  # Up/Down
    event_state_type = models.CharField(max_length=10, default="")  # Hard, Soft, etc
    device_ping = models.CharField(max_length=10, default="OK")
    device_packet_loss = models.CharField(max_length=10, default="0%")
    device_rta = models.CharField(max_length=10, default="")  # In milliseconds
    device_checkout_time = models.CharField(max_length=10, default="")

    def __str__(self):
        return self.device_name
