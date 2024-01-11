from datetime import datetime, timezone
import json

import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render

DAYS_WEEK = {
    'Sunday': 0,
    'Monday': 1, 
    'Tuesday': 2, 
    'Wednesday': 3, 
    'Thursday': 4,
    'Friday': 5, 
    'Saturday': 6, 
}
def degrees_to_cardinal(degrees):
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]

    val=int((degrees/22.5)+.5)
    index = val % 16
    return directions[index]

def render_dash(request, template="index.html"):

    return render(request, template, {})

def get_data(request):
    lat = request.POST.get("latitude")
    lon = request.POST.get("longitude")
    cnt = settings.NUM_DAYS * 8

    response = requests.get(settings.API_URL + f"?lat={lat}&lon={lon}&cnt={cnt}&appid={settings.API_KEY}&units=metric")

    data = response.json()
    data = data.get('list')
    
    response = {
        "data": [],
        "title": "",
        "forecast": []
    }
    day_processed = set()
    days = set()
    data_humidity = []
    waveHeight = []
    for row in data:
        response["data"].append({
            "time": datetime.utcfromtimestamp(row.get("dt")).replace(tzinfo=timezone.utc).isoformat(),
            "windSpeed": row["wind"]["speed"],
            "R": degrees_to_cardinal(row["wind"]["deg"]),
            "waveHeight": row["wind"]["gust"],
            "description": row["weather"][0]["description"]
        })

        waveHeight.append(row["wind"]["gust"])

        data_humidity.append([DAYS_WEEK[datetime.utcfromtimestamp(row.get("dt")).replace(tzinfo=timezone.utc).strftime('%A')], int(row.get("dt_txt").split(" ")[1].split(":")[0]), row["main"]["humidity"]])

        if(row.get("dt_txt").split(" ")[0] not in day_processed and row.get("dt_txt").split(" ")[1] == "12:00:00"):
            day_processed.add(row.get("dt_txt").split(" ")[0])
            days.add(datetime.utcfromtimestamp(row.get("dt")).replace(tzinfo=timezone.utc).strftime('%A'))

            response["forecast"].append({
                "localDate": row.get("dt_txt"),
                "day": datetime.utcfromtimestamp(row.get("dt")).replace(tzinfo=timezone.utc).strftime('%A'),
                "minTemp": row["main"]["temp_min"],
                "maxTemp": row["main"]["temp_max"],
                "shortDesc": row["weather"][0]["description"],
                "skyIcon": row["weather"][0]["main"],
                "weatherIcon": row["weather"][0]["main"],
            })
    
    response = {
        "data": response, 
        "max": max(waveHeight),
        "data_humidity": data_humidity
    }

    return JsonResponse(response)