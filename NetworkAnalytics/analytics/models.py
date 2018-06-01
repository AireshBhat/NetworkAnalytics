from django.db import models


class DeviceParameters(models.Model):
    device_name = models.CharField(max_length=1023, primary_key=True, blank=False, default="")
    device_type = models.CharField(max_length=20, blank=False, default="")
    device_region = models.CharField(max_length=1023, blank=False, default="")
    device_isp = models.CharField(max_length=1023, blank=False, default="")
    event_start_time = models.CharField(max_length=50, blank=False, default="")
    event_end_time = models.CharField(max_length=50, blank=False, default="")
    event_duration = models.CharField(max_length=50, blank=False, default="")
    event_state = models.CharField(max_length=10, default="")  # Up/Down
    event_state_type = models.CharField(max_length=10, default="")  # Hard, Soft, etc
    device_ping = models.CharField(max_length=10, default="OK")
    device_packet_loss = models.CharField(max_length=10, default="0%")
    device_rta = models.FloatField(default=0.0)  # In milliseconds
    device_checkout_time = models.FloatField(default=0.0)

    def __str__(self):
        return self.device_name
