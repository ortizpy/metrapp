from django.urls import path
from .views import api_registrar_usuario, login_api, dashboard_data, logout_view

urlpatterns = [
    path('registro/', api_registrar_usuario, name='api_registro_usuario'),
    path('login/', login_api, name='login_api'),
    path('dashboard/', dashboard_data, name='dashboard_data'),
    path('logout/', logout_view, name='logout'),
]
