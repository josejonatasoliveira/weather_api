from rest_framework import serializers

class WeatherRequest(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()