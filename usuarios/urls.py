from django.urls import path
from .views import (
    api_registrar_usuario,
    dashboard_data,
    logout_view,
    forbidden_view,
    CustomTokenObtainPairView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('registro/', api_registrar_usuario, name='api_registro_usuario'),
    path('dashboard/', dashboard_data, name='dashboard_data'),
    path('logout/', logout_view, name='logout'),
    path('forbidden/', forbidden_view, name='forbidden'),

    # Rutas para JWT
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
