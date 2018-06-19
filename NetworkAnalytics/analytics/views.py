from django.shortcuts import render
from django.http import JsonResponse, Http404, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .forms import DataUploadForm
from .models import *
from .serializers import *
from .utility import *
from .constants import *

import pandas as pd
import json
import jsonpickle

@csrf_exempt
@api_view(['GET', 'POST'])
def dashboard(request):
    if request.method == 'POST':
        print('Inside dashboard POST')
        device_count = Device.objects.count()
        print(device_count)
        last_upload = Device.objects.last()
        print(last_upload)
        return HttpResponse(jsonpickle.encode({"device_count": device_count,
        "last_upload": last_upload}), content_type = 'application/json')
    elif request.method == 'GET':
        return render(request, 'analytics/dashboard.html')


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
            serializer = UploadSerializer(data=request.data)
            if serializer.is_valid():
                uploaded_file = serializer.validated_data['uploaded_file']
                # override = serializer.validated_data['override']
                uploaded_file_name = uploaded_file.name
                print(uploaded_file_name)
                if uploaded_file_name.endswith('.csv'):
                    if uploaded_file_name.count('_') == 2:
                        device_name = uploaded_file_name.split('_')[0]
                        if True:
#                        if Device.objects.get(device_name=device_name) == None:
                            if True:
                                data_upload = DataUpload.objects.create()
                                data_upload.upload_file = uploaded_file
                                data_upload.save()
                                try:
                                    Device.objects.get(device_name=device_name).delete()
                                    DeviceParameters.objects.filter(device_name=device_name).delete()
                                    Parameters.objects.filter(device_name=device_name).delete()
                                except Exception as e:
                                    pass
                                device_region = uploaded_file_name.split('_')[1]
                                device_isp = uploaded_file_name.split('_')[2].replace(".csv", "")
                                device_type = ''
                                for types in DEVICE_TYPES:
                                    print(types)
                                    print(DEVICE_TYPES)
                                    if device_name.lower().endswith(types):
                                        device_type = types
                                        break
                                device = Device(device_name=device_name, device_type=device_type,
                                                device_region=device_region, device_isp=device_isp)
                                device.save()
                                file_location = '/home/nalvp' + settings.STATIC_URL + uploaded_file_name
                                df = pd.read_csv(file_location)
                                for d in df.itertuples():
                                    try:
                                        print(d)
                                        event_start_time = d[1].split(' ')[1]
                                        event_start_date = d[1].split(' ')[0]
                                        event_end_date = d[2].split(' ')[0]
                                        event_end_time = d[2].split(' ')[1]
                                        event_duration = d[3]
                                        event_state = d[4].split(' ')[1]
                                        event_state_type = d[4].split(' ')[2].strip('()')
                                        if d[5].find("CRITICAL") != -1:
                                            device_ping = "CRITICAL"
                                            device_packet_loss = ""
                                            device_rta = ""
                                            device_checkout_time = ""
                                        elif d[5].find('out') == -1:
                                            device_ping = d[5].split(' ')[1]
                                            device_packet_loss = d[5].split(' ')[6].replace(",", "")
                                            try:
                                                device_rta = d[5].split(' ')[9] + d[5].split(' ')[10]
                                            except Exception as e:
                                                device_rta = ""
                                            device_checkout_time = ""
                                        else:
                                            device_ping = ""
                                            device_packet_loss = ""
                                            device_rta = ""
                                            device_checkout_time = d[5].split('Host check timed out after')[1].replace(")", "")
                                        device_parameters = DeviceParameters.objects.create()
                                        device_parameters.device_name = device_name
                                        device_parameters.device_type = device_type
                                        device_parameters.device_region = device_region
                                        device_parameters.device_isp = device_isp
                                        device_parameters.event_start_time = event_start_time
                                        device_parameters.event_start_date = event_start_date
                                        device_parameters.event_end_time = event_end_time
                                        device_parameters.event_end_date = event_end_date
                                        device_parameters.event_duration = event_duration
                                        device_parameters.event_state = event_state
                                        device_parameters.event_state_type = event_state_type
                                        device_parameters.device_ping = device_ping
                                        device_parameters.device_packet_loss = device_packet_loss
                                        device_parameters.device_rta = device_rta
                                        device_parameters.device_checkout_time = device_checkout_time
                                        device_parameters.save()
                                        paramters = Parameters()
                                        paramters.device_name = device.device_name
                                        paramters.device_type = device.device_type
                                        paramters.device_region = device.device_region
                                        paramters.device_isp = device.device_isp
                                        paramters.event_start_time = event_start_time
                                        paramters.event_start_date = date_to_server_format(event_start_date)
                                        paramters.event_end_time = event_end_time
                                        paramters.event_end_date = date_to_server_format(event_end_date)
                                        paramters.event_duration = time_to_seconds(event_duration)
                                        paramters.event_state = event_state
                                        paramters.event_state_type = event_state_type
                                        paramters.device_ping = device_ping
                                        paramters.device_packet_loss = int(device_packet_loss.replace("%", ""))
                                        paramters.device_rta = float(device_rta.replace(" ms", ""))
                                        paramters.device_checkout_time = int(device_checkout_time.replace(" seconds", ""))
                                        paramters.save()
                                        print(device_parameters.device_start_time)
                                    except Exception as e:
                                        pass
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
    if request.method == 'GET':
        return render(request, 'analytics/individual_device.html')
    elif request.method == 'POST':
        data = request.data
        print("Request Data.....")
        print(data)
        try:
            device_name = data['device_name']
        except Exception as e:
            return JsonResponse(json.dumps({'error': 'No Device Name found'}), safe=False)
        else:
            print(device_name)
            device_info = DeviceParameters.objects.filter(device_name=device_name)
            device_serializer = DeviceSerializer(data=device_info, many=True)
            if device_serializer.is_valid():
                return JsonResponse(device_serializer.data, safe=False)
            else:
                print(device_serializer.error_messages)
                return JsonResponse(device_serializer.data, safe=False)


@csrf_exempt
@api_view(['GET', 'POST'])
def device_list(request):
    if request.method == 'GET':
        devices_list = Device.objects.all()
        devices_list_serializer = DeviceListSerializer(data=devices_list, many=True)
        if devices_list_serializer.is_valid() or not devices_list_serializer.is_valid():
            return JsonResponse(devices_list_serializer.data, safe=False)
    else:
        return Http404("Endpoint not found")


@csrf_exempt
@api_view(['GET', 'POST'])
def individual_analytics(request):
    if request.method == 'POST':
        data = request.data
        data = json.load(data)
        device_name = data['device_name']
        print("Inside individual analytics")
        if device_name is None:
            return JsonResponse(json.dumps({'error': 'No Device Name found'}))
        else:
            print(device_name)
            device_info = DeviceParameters.objects.get(device_name=device_name)
            if device_info is None:
                return JsonResponse(json.dumps({'error': 'No Device found'}))
            else:
                average_down_time = compute_down_time(device_info)
                average_up_time = compute_up_time(device_info)
                ping_average = compute_average_ping(device_info)
                packet_loss_average = compute_average_packet_loss(device_info)
                return JsonResponse(json.dumps({'average_down_time': average_down_time, 'average_up_time': average_up_time,
                                     'ping_average': ping_average, 'packet_loss_average': packet_loss_average}))
        pass
    else:
        return Http404("URL not found")

@csrf_exempt
@api_view(['GET', 'POST'])
def comparative_analytics(request):
    pass
