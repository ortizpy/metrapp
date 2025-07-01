from django.urls import path
from .views import api_registrar_usuario

urlpatterns = [
    path('registro/', api_registrar_usuario, name='api_registro_usuario'),
]
