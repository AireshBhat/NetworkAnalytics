from rest_framework import serializers

from .models import *


class UploadSerializer(serializers.Serializer):
    uploaded_file = serializers.FileField()
    override = serializers.BooleanField(default=False)

    def create(self, validated_data):
        return DataUpload.objects.create(validated_data.get('uploaded_file'))

    def update(self, instance, validated_data):
        pass


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceParameters
        fields = ('device_name', 'device_type', 'device_region', 'device_isp', 'event_start_time', 'event_start_date',
                  'event_end_time', 'event_end_date', 'event_duration', 'event_state', 'event_state_type',
                  'device_ping', 'device_packet_loss', 'device_rta', 'device_checkout_time')

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class DeviceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('created_at', 'device_name', 'device_type', 'device_region', 'device_isp')

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class DeviceAnalysisSerializers(serializers.Serializer):
    total_down_time = serializers.CharField(default="")
    total_up_time = serializers.CharField(default="")
    ping_average = serializers.CharField(default="")
    packet_loss_average = serializers.CharField(default="")

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

