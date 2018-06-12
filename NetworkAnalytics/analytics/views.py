from django.shortcuts import render
from django.http import JsonResponse, Http404, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view

from .forms import *
from .models import *
from .serializers import *
from .utility import *
from .constants import *

import pandas as pd
import json


@csrf_exempt
@api_view(['GET', 'POST'])
def dashboard(request):
    if request.POST:
        device_count = Device.objects.count()
        last_upload = Device.objects.last()
        return JsonResponse({'device_count': device_count, 'last_upload': last_upload})
    elif request.GET:
        return render(request, 'analytics/dashboard.html')
    else:
        return Http404


@csrf_exempt
@api_view(['GET', 'POST'])
def upload_data(request):
    print("request")
    if request.method == 'GET':
        print("Upload darta given")
        return render(request, 'analytics/upload_data.html')
    elif request.method == 'POST':
        print('Request data')
        print(request.data)
        if request.FILES is None:
            return JsonResponse({"error": "No Files Found in the request body"})
        else:
            """
            data = JSONParser().parse(request.POST)
            print("Data")
            print(data)
            """
            serializer = UploadSerializer(data=request.POST)
            if serializer.is_valid():
                uploaded_file = serializer.validated_data['uploaded_file']
                override = serializer.validated_data['override']
                uploaded_file_name = uploaded_file.name
                print(uploaded_file_name)
                if uploaded_file_name.endswith('.csv'):
                    if uploaded_file_name.count('_') == 2:
                        device_name = uploaded_file_name.split('_')[0]
                        if Device.objects.get(device__name=device_name) is not None:
                            if override:
                                serializer.save()
                                Device.objects.get(device__name=device_name).delete()
                                DeviceParameters.objects.filter(device_name=device_name).delete()
                                device_region = uploaded_file_name.split('_')[1]
                                device_isp = uploaded_file_name.split('_')[2]
                                device_type = ''
                                for types in DEVICE_TYPES:
                                    if device_name.lower().endswith(types.lower()):
                                        device_type = types
                                device = Device(device_name=device_name, device_type=device_type,
                                                device_region=device_region, device_isp=device_isp)
                                device.save()
                                file_location = settings.STATIC_URL + uploaded_file_name
                                df = pd.read_csv(file_location, headers=0)
                                for d in df.itertuples():
                                    event_start_date = d[0].split(' ')[0]
                                    event_start_time = d[0].split(' ')[1]
                                    event_end_date = d[1].split(' ')[0]
                                    event_end_time = d[1].split(' ')[1]
                                    event_duration = d[2]
                                    event_state = d[3].split(' ')[1]
                                    event_state_type = d[3].split(' ')[2].strip('()')
                                    if d[4].find('timed out') == -1:
                                        device_ping = d[4].split(' ')[1]
                                        device_packet_loss = d[4].split(' ')[6]
                                        device_rta = d[4].split(' ')[9] + d[4].split(' ')[10]
                                        device_checkout_time = ""
                                    else:
                                        device_ping = ""
                                        device_packet_loss = ""
                                        device_rta = ""
                                        device_checkout_time = d[4].split('Host check timed out after')[1]
                                    device_parameters = DeviceParameters(
                                        device.device_name, device.device_type, device.device_region,
                                        device.device_isp, event_start_time, event_start_date,
                                        event_end_time, event_end_date, event_duration,
                                        event_state, event_state_type, device_ping, device_packet_loss,
                                        device_rta, device_checkout_time
                                    )
                                    device_parameters.save()
                                    return JsonResponse({'status': 'ok'})
                            else:
                                device_exists_message = device_name + ' exists'
                                return JsonResponse({'error': device_exists_message})
                    else:
                        print("Inappropriate File Name")
                        return JsonResponse({'error': 'Inappropriate File Name Format'})
                else:
                    print("Inappropriate File Format")
                    return JsonResponse({'error': 'Inappropriate File Format'})
            else:
                print(serializer.errors)
                return HttpResponse("Invalid serializers")


@csrf_exempt
@api_view(['GET', 'POST'])
def individual_data(request):
    if request.GET:
        return render(request, 'analytics/individual_device.html')

    elif request.POST:
        data = request.data
        data = json.load(data)
        device_name = data['device_name']
        device_info = DeviceParameters.objects.get(device_name=device_name)
        device_serializer = DeviceSerializer(data=device_info, many=True)
        return JsonResponse(device_serializer.data)


@csrf_exempt
@api_view(['GET', 'POST'])
def device_list(request):
    if request.GET:
        devices_list = Device.objects.all()
        devices_list_serializer = DeviceListSerializer(data=devices_list, many=True)
        return JsonResponse(devices_list_serializer.data)
    else:
        return Http404("URL not found")


@csrf_exempt
@api_view(['GET', 'POST'])
def individual_analytics(request):
    if request.POST:
        data = request.data
        data = json.load(data)
        device_name = data['device_name']
        if device_name is None:
            return JsonResponse({'error': 'No Device Name found'})
        else:
            device_info = DeviceParameters.objects.get(device_name=device_name)
            if device_info is None:
                return JsonResponse({'error': 'No Device found'})
            else:
                average_down_time = compute_down_time(device_info)
                average_up_time = compute_up_time(device_info)
                ping_average = compute_average_ping(device_info)
                packet_loss_average = compute_average_packet_loss(device_info)
                return JsonResponse({'average_down_time': average_down_time, 'average_up_time': average_up_time,
                                     'ping_average': ping_average, 'packet_loss_average': packet_loss_average})
        pass
    else:
        return Http404("URL not found")


@csrf_exempt
@api_view(['GET', 'POST'])
def comparative_analytics(request):
    if request.method == 'POST':
        data = request.data
        data = json.loads(data)
        device_names = data['device_names']  # list of devices

    elif request.method == 'GET':
        render(request, 'analytics/comparative_analytics.html')
    else:
        return Http404("URL Not found")
    pass
