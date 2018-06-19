from django.db import models
from django.conf import settings


class DataUpload(models.Model):
    upload_time = models.DateTimeField(auto_now_add=True, blank=False)
    upload_file = models.FileField(upload_to=settings.STATIC_URL[1:])

    def __str__(self):
        return self.upload_file


class Device(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, blank=False)
    device_name = models.CharField(max_length=1023, blank=False, default="")
    device_type = models.CharField(max_length=20, blank=False, default="")
    device_region = models.CharField(max_length=1023, blank=False, default="")
    device_isp = models.CharField(max_length=1023, blank=False, default="")

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.device_name


class DeviceParameters(models.Model):
    device_name = models.CharField(max_length=1023,blank=False, default="")
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


class Parameters(models.Model):
    device_name = models.CharField(max_length=1023, blank=False, default="")
    device_type = models.CharField(max_length=20, blank=False, default="")
    device_region = models.CharField(max_length=1023, blank=False, default="")
    device_isp = models.CharField(max_length=1023, blank=False, default="")
    event_start_time = models.CharField(default="", blank=False, max_length=1023)
    event_start_date = models.DateField(blank=False)
    event_end_time = models.CharField(blank=False, default="", max_length=1023)
    event_end_date = models.DateField(blank=False)
    event_duration = models.BigIntegerField(default=0, blank=False)
    event_state = models.CharField(max_length="", default="")  # Up,Down
    event_state_type = models.CharField(max_length=10, default="")  # Hard, Soft.
    device_ping = models.CharField(max_length=10, default="OK")
    device_packet_loss = models.IntegerField()  # Percentage
    device_rta = models.IntegerField()  # Milliseconds
    device_checkout_time = models.IntegerField()  # Seconds

    def __str__(self):
        return self.device_name

