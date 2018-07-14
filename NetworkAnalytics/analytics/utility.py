from .models import *
import datetime

def time_to_seconds(time):
    split = time.split(' ')
    days = split[0][0:len(split[0])-1]
    hours = split[1][0:len(split[1])-1]
    mins = split[2][0:len(split[2])-1]
    secs = split[3][0:len(split[3])-1]
    seconds = 86400*int(days) + 3600*int(hours) + 60*int(mins) + int(secs)
    return seconds


def seconds_to_time(seconds):
    days = int(seconds % 86400)
    hours = int((seconds - (days * 86400)) % 3600)
    mins = int((seconds - (days * 86400) - (hours * 3600)) % 60)
    secs = seconds - 60*mins - 3600*hours - 86400*days
    time = str(days) + "d " + str(hours) + "h " + str(mins) + "m " + str(secs) + "s"
    return time

def compute_down_time(device_params_list):
    average_time = 0
    total_time = 0
    for device_params in device_params_list:
        total_time += device_params.event_duration
        if device_params.event_state == "DOWN":
            average_time += device_params.event_duration
    return average_time/total_time


def compute_up_time(device_params_list):
    average_time = 0
    total_time = 0
    for device_params in device_params_list:
        total_time += device_params.event_duration
        if device_params.event_state == "UP":
            average_time += device_params.event_duration
    return average_time / total_time

def compute_average_ping(device_params_list):
    average_ping = 0.0
    for device_params in device_params_list:
        ping = float(device_params.device_ping)
        average_ping += ping / len(device_params_list)
    return str(average_ping)


def compute_average_packet_loss(device_params_list):
    average_packet_loss = 0.0
    for device_params in device_params_list:
        packet_loss = float(device_params.device_packet_loss)
        average_packet_loss += (float) (packet_loss / len(device_params_list))
    average_packet_loss = str(average_packet_loss)
    return average_packet_loss


def date_to_server_format(date):
    date_split = date.split("-")
    try:
        d = datetime.datetime.strptime(date, "%m-%d-%Y")
        return d.strftime("%Y-%m-%d")
    except Exception as e:
        print("Parse error")
        print(e)
        try:
            d = datetime.datetime.strptime(date, "%m/%d/%Y")
            print(d.strftime("%Y-%m-%d"))
            return d.strftime("%Y-%m-%d")
        except Exception as e:
            print("Parse error 4")
            print(e)
            try:
                d = datetime.datetime.strptime(date, "%d-%m-%Y")
                print(d.strftime("%Y-%m-%d"))
                return d.strftime("%Y-%m-%d")
            except Exception as e:
                print("Parse error 2")
                print(e)
                try:
                    d = datetime.datetime.strptime(date, "%d/%m/%Y")
                    print(d.strftime("%Y-%m-%d"))
                    return d.strftime("%Y-%m-%d")
                except Exception as e:
                    print("Parse error 3")
                    print(e)
                    try:
                        d = datetime.datetime.strptime(date, "%Y-%m-%d")
                        print(d.strftime("%Y-%m-%d"))
                        return d.strftime("%Y-%m-%d")
                    except Exception as e:
                        print(e)
                        print("Parse error 5")
                        try:
                            d = datetime.datetime.strptime(date, "%Y/%m/%d")
                            print(d.strftime("%Y-%m-%d"))
                            return d.strftime("%Y-%m-%d")
                        except Exception as e:
                            print("Parse error 6")
                            print(e)
                            pass

