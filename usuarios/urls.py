from django.urls import path
from .views import api_registrar_usuario, login_api

urlpatterns = [
    path('registro/', api_registrar_usuario, name='api_registro_usuario'),
    path('login/', login_api, name='login_api'),
]
