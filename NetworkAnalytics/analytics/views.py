from django.shortcuts import render
from django.http import JsonResponse, Http404, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.db.models import Q
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
import time
import datetime
import os


@csrf_exempt
@login_required
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
        return render(request, 'index.html')



@csrf_exempt
@api_view(['GET', 'POST'])
def upload_data(request):
    print("request..................................................")
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
                if uploaded_file_name.endswith('.csv') or uploaded_file_name.endswith('.xlsx'):
                    if uploaded_file_name.count('_') == 2:
                        device_name = uploaded_file_name.split('_')[0]
                        if True:
                            try:
                                Device.objects.filter(device_name=device_name).delete()
                            except Exception as e:
                                print(e)
                                pass
                            if True:
                                data_upload = DataUpload.objects.create()
                                data_upload.upload_file = uploaded_file
                                data_upload.save()

                                device_region = uploaded_file_name.split('_')[1]
                                device_isp = uploaded_file_name.split('_')[2].replace(".csv", "")
                                device_isp = device_isp.replace(".xlsx", "")
                                device_type = ''
                                for types in DEVICE_TYPES:
                                    if device_name.lower().endswith(types):
                                        device_type = types
                                        break
                                device = Device(device_name=device_name, device_type=device_type,
                                                device_region=device_region, device_isp=device_isp)
                                device.save()
                                file_location = "~" + settings.STATIC_URL + uploaded_file_name
                                if uploaded_file_name.endswith('.csv'):
                                    df = pd.read_csv(file_location, header=0)
                                else:
                                    df = pd.read_excel(file_location, header=0)
                                try:
                                    DataUpload.objects.all().delete()
                                    if os.path.isfile('/home/nalvp/static/' + uploaded_file_name):
                                        os.remove('/home/nalvp/static/' + uploaded_file_name)
                                    print("Deleted")
                                except:
                                    pass
                                print(df.head())
                                df = df.dropna(how='all')
                                try:
                                    df = df.drop(columns="Unnamed: 0")
                                    df = df.drop(columns="Unnamed: 1")
                                    df = df.drop(columns="Unnamed: 2")
                                except Exception as e:
                                    pass
                                last_date = None
                                if Parameters.objects.filter(device_name=device_name).last() is not None:
                                    last_date = Parameters.objects.filter(device_name=device_name).last().event_start_date
                                for i in range(int(df.size / 5)):
                                    print("Entered loop")
                                    try:
                                        print(df)
                                        print("DF printed")
                                        event_start = str(df['Event Start Time'][i])
                                        print("Start Split")
                                        print(event_start)
                                        event_start_time = event_start.split(' ')[1]
                                        print("Start split time done")
                                        if event_start_time.count(":") == 1:
                                            print(event_start_time)
                                            event_start_time += ":00"
                                        event_start_date = event_start.split(' ')[0].replace("/", "-")
                                        print(event_start_date)
                                        print("Start Time Done")
                                        event_end = str(df['Event End Time'][i])
                                        event_end_date = event_end.split(' ')[0].replace("/", "-")
                                        event_end_time = event_end.split(' ')[1]
                                        if event_end_time.count(":") != 2:
                                            event_end_time += ":00"
                                        print(event_end_date)
                                        print("End Time Done")
                                        event_state = df['Event/State Type'][i].split(' ')[1]
                                        event_duration = df['Event Duration'][i].strip("+")
                                        event_state_type = df['Event/State Type'][i].split(' ')[2].strip('()')
                                        if df['Event/State Information'][i].lower().find("criti") >= 0:
                                            device_ping = "CRITICAL"
                                            device_packet_loss = "100"
                                            device_rta = ""
                                            device_checkout_time = ""
                                        elif df['Event/State Information'][i].find('out') == -1:
                                            device_ping = df['Event/State Information'][i].split(' ')[1]
                                            device_packet_loss = df['Event/State Information'][i].split(' ')[6].replace("%,", "")
                                            try:
                                                device_rta = df['Event/State Information'][i].split(' ')[9]
                                            except Exception as e:
                                                device_rta = ""
                                            device_checkout_time = ""
                                        else:
                                            device_ping = ""
                                            device_packet_loss = ""
                                            device_rta = ""
                                            device_checkout_time = df['Event/State Information'][i].split('Host check timed out after ')[1].replace(
                                                " seconds)", "")
                                        if last_date is not None:
                                            if data_to_server_format(event_start_date) > last_date:
                                                try:
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
                                                    parameters = Parameters()
                                                    parameters.device_name = device.device_name
                                                    parameters.device_type = device.device_type
                                                    parameters.device_region = device.device_region
                                                    parameters.device_isp = device.device_isp
                                                    parameters.event_start_time = event_start_time
                                                    parameters.event_start_date = date_to_server_format(event_start_date)
                                                    parameters.event_end_time = event_end_time
                                                    parameters.event_end_date = date_to_server_format(event_end_date)
                                                    parameters.event_duration = time_to_seconds(event_duration)
                                                    parameters.event_state = event_state
                                                    parameters.event_state_type = event_state_type
                                                    parameters.device_ping = device_ping
                                                    if device_packet_loss is not "":
                                                        parameters.device_packet_loss = int(device_packet_loss)
                                                    else:
                                                        parameters.device_packet_loss = 0
                                                    if device_rta is not "":
                                                        parameters.device_rta = float(device_rta)
                                                    else:
                                                        parameters.device_rta = 0.0
                                                    if device_checkout_time is not "":
                                                        parameters.device_checkout_time = float(
                                                            device_checkout_time.replace(" seconds", ""))
                                                    else:
                                                        parameters.device_checkout_time = 0.0
                                                    parameters.save()
                                                except Exception as e:
                                                    print(e)
                                                    pass
                                            else:
                                                pass
                                        else:
                                            try:
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
                                                parameters = Parameters()
                                                parameters.device_name = device.device_name
                                                parameters.device_type = device.device_type
                                                parameters.device_region = device.device_region
                                                parameters.device_isp = device.device_isp
                                                parameters.event_start_time = event_start_time
                                                parameters.event_start_date = date_to_server_format(event_start_date)
                                                parameters.event_end_time = event_end_time
                                                parameters.event_end_date = date_to_server_format(event_end_date)
                                                parameters.event_duration = time_to_seconds(event_duration)
                                                parameters.event_state = event_state
                                                parameters.event_state_type = event_state_type
                                                parameters.device_ping = device_ping
                                                if device_packet_loss is not "":
                                                    parameters.device_packet_loss = int(device_packet_loss)
                                                else:
                                                    parameters.device_packet_loss = 0
                                                if device_rta is not "":
                                                    parameters.device_rta = float(device_rta)
                                                else:
                                                    parameters.device_rta = 0.0
                                                if device_checkout_time is not "":
                                                    parameters.device_checkout_time = float(
                                                        device_checkout_time.replace(" seconds", ""))
                                                else:
                                                    parameters.device_checkout_time = 0.0
                                                parameters.save()
                                            except Exception as e:
                                                print(e)
                                                pass
                                    except Exception as e:
                                        print("saving exception")
                                        print(e)
                                        pass
                                print("Return called")
                                return HttpResponse(json.dumps({"status": "ok"}), content_type="application/json")
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
        print(data)
        try:
            device_name = data['device_name']
        except Exception as e:
            return JsonResponse(json.dumps({'error': 'No Device Name found'}), safe=False)
        else:
            print(device_name)
            device_info = list(Parameters.objects.filter(device_name=device_name))
            print(device_info)
            start_time_list = []
            end_time_list = []
            for info in device_info:
                start_time = str(info.event_start_date) + " " + str(info.event_start_time)
                print(start_time)
                try:
                    start_time = time.mktime(datetime.datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S").timetuple())
                except Exception as e:
                    try:
                        start_time = start_time[:len(start_time)-3]
                        print("Start Time")
                        print(start_time)
                        start_time = time.mktime(datetime.datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S").timetuple())
                    except Exception as e:
                        print(e)
                        return HttpResponse(json.dumps({'error': 'invalid starttime format'}), content_type="application/json")
                start_time_list.append(start_time)
                end_time = str(info.event_end_date) + " " + str(info.event_end_time)
                try:
                    end_time = time.mktime(datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S").timetuple())
                except Exception as e:
                    try:
                        end_time = end_time[:len(end_time)-3]
                        end_time = time.mktime(datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S").timetuple())
                    except Exception as e:
                        return HttpResponse(json.dumps({'error': 'invalid endtime format'}), content_type="application/json")
                end_time_list.append(end_time)
            param_list = []

            for i in range(len(start_time_list)):
                info = device_info[i]
                start_time = start_time_list[i]
                end_time = end_time_list[i]
                param = {"device_name": info.device_name,
                "device_type": info.device_type,
                "device_region": info.device_region,
                "device_isp": info.device_isp,
                "event_start_time": start_time,
                "event_end_time": end_time,
                "event_state": info.event_state,
                "event_state_type": info.event_state_type,
                "device_ping": info.device_ping,
                "device_packet_loss": info.device_packet_loss,
                "device_rta": info.device_rta,
                "device_checkout_time": info.device_checkout_time}
                param_list.append(param)
            return HttpResponse(json.dumps(param_list), content_type="application/json")


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
        device_name = data['device_name']
        print("Stats")
        print(device_name)
        try:
            start_date = data['start_date']
            print(start_date)
        except KeyError as e:
            return HttpResponse(json.dumps({"error": "no start date found"}), content_type="application/json")
        try:
            end_date = data['end_date']
            print(end_date)
        except KeyError as e:
            return HttpResponse(json.dumps({"error": "no end date found"}), content_type="application/json")
        if device_name is None:
            return HttpResponse(json.dumps({'error': 'No Device Name found'}), content_type="application/json")
        else:
            device_info = Parameters.objects.filter(Q(device_name=device_name))
            if device_info is None:
                return HttpResponse(json.dumps({'error': 'No Device found'}), content_type="application/json")
            else:
                try:
                    device_info = device_info.filter(Q(event_start_date__gte=start_date, event_end_date__lte=end_date))
                except Exception as e:
                    pass
                average_down_time = 0
                average_up_time = 0
                try:
                    average_down_time = compute_down_time(device_info)
                    average_up_time = compute_up_time(device_info)
                except Exception as e:

                    pass
                # ping_average = compute_average_ping(device_info)
                packet_loss_average = compute_average_packet_loss(device_info)
                down_counter = 0
                rta_counter = 0
                rta_duration = 0
                down_start_time = []
                down_end_time = []
                rta_start_time = []
                rta_end_time = []
                for data in device_info:
                    if data.event_state == 'DOWN':
                        down_counter += 1
                        start_time = str(data.event_start_date) + " " + str(data.event_start_time)
                        end_time = str(data.event_end_date) + " " +str(data.event_end_time)
                        down_start_time.append(time.mktime(datetime.datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S").timetuple()))
                        down_end_time.append(time.mktime(datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S").timetuple()))
                    if data.device_rta >= 120.0:
                        rta_counter += 1
                        start_time = str(data.event_start_date) + " " + str(data.event_start_time)
                        end_time = str(data.event_end_date) + " " +str(data.event_end_time)
                        rta_start_time.append(time.mktime(datetime.datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S").timetuple()))
                        rta_end_time.append(time.mktime(datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S").timetuple()))
                return HttpResponse(json.dumps({'average_down_time': average_down_time,
                                                'average_up_time': average_up_time,#  'ping_average': ping_average,
                                                'packet_loss_average': packet_loss_average,
                                                'down_time_count': down_counter,
                                                'down_start_time': down_start_time,
                                                'down_end_time': down_end_time,
                                                'rta_counter': rta_counter,
                                                'rta_start_time': rta_start_time,
                                                'rta_end_time':rta_end_time}),
                                    content_type="application/json")
        pass
    else:
        return Http404("URL not found")

@csrf_exempt
@api_view(['GET', 'POST'])
def comparative_analytics(request):
    if request.method == 'GET':
        return render(request, 'analytics/comparative_analytics.html')
    else:
        print("POST")
        data = request.data
        device_names = data['devices']
        print(device_names)
        if type(device_names) is not list:
            return HttpResponse(json.dumps({"error": "no list found. expecting list"}), content_type="application/json")
        elif len(device_names) is 0:
            return HttpResponse(json.dumps({"error": "No device names found"}), content_type="application/json")
        else:
            response_list = Parameters.objects.all()
            for device_name in device_names:
                response_list = response_list.filter(device_name=device_name)
            parameters_serializer = DeviceListSerializer(data=response_list, many=True)
            if parameters_serializer.is_valid() or True:
                return HttpResponse(json.dumps(parameters_serializer.data), content_type="application/json")


@csrf_exempt
@api_view(['POST'])
def delete_parameters(request):
    if request.method == 'POST':
        print("Inside data")
        data = request.data
        try:
            device_name = data['device_name']
            Parameters.objects.filter(device_name=device_name).delete()
            Device.objects.filter(device_name=device_name).delete()
            return HttpResponse(json.dumps({"status": "ok"}), content_type="application/json")
        except Exception as e:
            print(e)
            pass


@csrf_exempt
def is_allowed(request):
    if request.method == 'GET':
        if request.user.username == "nalvp":
            return HttpResponse(json.dumps({"is_allowed": True}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({"is_allowed": False}), content_type="application/json")


@csrf_exempt
def user_logout(request):
    if request.method == 'GET':
        logout(request)
        print(request.user)
        return render(request, 'index.html')

@csrf_exempt
def handler404_not_found(request):
    return render(request, '404.html')
