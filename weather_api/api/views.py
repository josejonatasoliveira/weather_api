import json

import requests
from django.conf import settings
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view

from .models import WeatherHistorical
from .serializers import WeatherRequest

    
@swagger_auto_schema(method='POST', operation_description="POST /weather/", request_body=WeatherRequest)
@api_view(['POST'])
def get_weather_data(request):
    lat = request.data.get("latitude")
    lon = request.data.get("longitude")
    cnt = settings.NUM_DAYS * 8

    weather, _ = WeatherHistorical.objects.get_or_create(**{
        "lat": lat,
        "lon": lon
    })

    response = requests.get(settings.API_URL + f"?lat={lat}&lon={lon}&cnt={cnt}&appid={settings.API_KEY}&units=metric")

    data = response.json()
    return Response({"data": data})
