from django.db import models

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class WeatherHistorical(BaseModel):
    lat = models.FloatField()
    lon = models.FloatField()

    class Meta:
        db_table = "weather_historical"

